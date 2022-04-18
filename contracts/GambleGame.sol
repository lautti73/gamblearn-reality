//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface RealityETH {
    function resultFor(bytes32 questionId) external returns (bytes32);
    function askQuestion(
        uint256 templateId,
        string memory question,
        address arbitrator,
        uint32 timeout,
        uint32 openingTs,
        uint256 nonce
    ) external payable returns (bytes32 questionId);
}

contract BetFactory is Ownable {

    Bet[] public deployedBets;
    mapping(address => Bet[]) public myBets;
    event CreateBet(
        Bet indexed newBet
    );

    constructor() {}

    function createBet(string memory firstTeam, string memory secondTeam, string memory betDesc, string memory betType, string memory betSubtype, uint matchTimestamp, bool acceptsTie) external {
        require(bytes(firstTeam).length > 0
            && bytes(secondTeam).length > 0  
            && keccak256(abi.encode(firstTeam)) != keccak256(abi.encode(secondTeam))
            && bytes(betDesc).length > 0 ,
            "You must enter at least two different teams, and a description"
        );
        require(bytes(firstTeam).length < 31
            && bytes(secondTeam).length < 31  
            && bytes(betDesc).length < 301 ,
            "The max length of team names is 30 characters and the max length for description is 300 characters"
        );

        require(bytes(betType).length < 31
            && bytes(betSubtype).length < 31,
            "The max length of type is 30 characters"
        );

        require(matchTimestamp - 86400 > block.timestamp, "The match must start at least 24 hours later than the gamble creation");

        Bet newBet = new Bet(msg.sender, firstTeam, secondTeam, betDesc, betType, betSubtype, matchTimestamp, owner(), acceptsTie);
        emit CreateBet(newBet);
        deployedBets.push(newBet);
        myBets[msg.sender].push(newBet);
    }

    function getDeployedGambleGames() public view returns (Bet[] memory) {
        return deployedBets;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}


contract Bet {
    struct Gamble {
        address payable playerAddress;
        string teamGambled;
        uint amount;
    }

    address public manager;
    string public firstTeam;
    string public secondTeam;
    string public tie;
    string public betDesc;
    string public betType;
    string public betSubtype;
    uint256 public matchTimestamp;
    bytes32 public questionIdTimestamp;
    bool public isMatchTimestampSet;
    bool public acceptsTie;
    bool public isCompleted;
    bool public isCanceled;
    uint public completedTimestamp;
    string public winner; 
    bytes32 public questionId;
    uint256 public realityFee;
    
   
    mapping(address => mapping(string => uint)) public gambledFor;

    address payable public owner;
    Gamble[] public gambles;
    mapping (string => uint) public balance;
    address public realityContract;
    uint public contractBalanceSnap;

    event CreatedGamble(
        address indexed gambler
    );
    event CancelGamble(
        uint256 indexed completedTimestamp
    );
    event RewardClaimed(
        address indexed claimer,
        uint256 indexed amount
    );
    event SetWinner(
        string indexed winner
    );
    event SetTimestamp(
        uint256 indexed timestamp
    );

    modifier onlyOwner() {
        require( 
            msg.sender == owner, 
            "Only the owner of the gamble can execute this function"
        );
        _;
    }

    modifier validTeam( string calldata team ) {
        if(acceptsTie) {
            require(
            keccak256(abi.encode(firstTeam)) == keccak256(abi.encode(team)) 
            || 
            keccak256(abi.encode(secondTeam)) == keccak256(abi.encode(team))
            || 
            keccak256(abi.encode(tie)) == keccak256(abi.encode(team)),
            "You must select a valid team");
        } else {
            require(
            keccak256(abi.encode(firstTeam)) == keccak256(abi.encode(team)) 
            || 
            keccak256(abi.encode(secondTeam)) == keccak256(abi.encode(team)),
            "You must select a valid team");
        }  
        _;
    }

    modifier mustBeIncompleted() {
        require(
            !isCompleted,
            "This gamble is already completed"
        );
        _;
    }

    constructor(
        address _manager, 
        string memory _firstTeam, 
        string memory _secondTeam, 
        string memory _betDesc, 
        string memory _betType, 
        string memory _betSubtype, 
        uint _matchTimestamp, 
        address _owner,
        bool _acceptsTie
        ) {
        owner = payable(_owner);
        manager = _manager;
        firstTeam = _firstTeam;
        secondTeam = _secondTeam;
        betDesc = _betDesc;
        betType = _betType;
        betSubtype = _betSubtype;
        matchTimestamp = _matchTimestamp;
        isMatchTimestampSet = false;
        acceptsTie = _acceptsTie;
        tie = "Tie";
        isCompleted = false;
        isCanceled= false;
        winner = "undefined";
        realityContract = 0xDf33060F476F8cff7511F806C72719394da1Ad64;
        realityFee = 2000000000000000;
    }

    function enterGamble(string calldata teamGambled) public payable validTeam(teamGambled) mustBeIncompleted {
        require(
            msg.value >= 0.002 ether,
            "Minimum amount to gamble is 0.002 eth"
        );

        require(matchTimestamp - 3600 > block.timestamp, "The gamble do not receive more bets");

        if(gambles.length == 1) {
            require(isMatchTimestampSet, "The match start timestamp is not checked yet");
        }
        string memory us = "\u241f";

        if(balance[firstTeam] == 0 && balance[secondTeam] == 0 && balance[tie] == 0) {
            string memory question = string(abi.encodePacked("The match between ", firstTeam, " and ", secondTeam, ", with the following description: ", betDesc, ", will take place on which date?", us, "sports", us, "en"));
            questionIdTimestamp = RealityETH(realityContract).askQuestion{value: realityFee}(4, question, realityContract, 43200, 0, 0);
        }

        if(balance[teamGambled] == 0 && gambles.length > 0) {
            string memory question;
            if (acceptsTie) {
                question = string(abi.encodePacked("Which team won?", us,"\"", firstTeam,"\",","\"", secondTeam,"\",", "\"Tie\"", us, "sports", us, "en"));
            } else {
                question = string(abi.encodePacked("Which team won?", us,"\"", firstTeam,"\",","\"", secondTeam,"\"", us, "sports", us, "en"));
            }
            questionId = RealityETH(realityContract).askQuestion{value: realityFee}(2, question, realityContract, 86400, 0, 0);
        }

        Gamble memory gamble = Gamble({
            playerAddress: payable(msg.sender), 
            teamGambled: teamGambled, 
            amount: msg.value
            });

        gambledFor[msg.sender][teamGambled] += msg.value;
        gambles.push(gamble);
        balance[teamGambled] += msg.value;
        emit CreatedGamble(msg.sender);
    }

    // function setReality(address _address) public onlyOwner {
    //     realityContract = _address;
    // }

    function claimReward() public {
        require(keccak256(abi.encode(winner)) != keccak256(abi.encode("undefined")), "Winner is not set");
        require(gambledFor[msg.sender][winner] > 0, "You have not reward to claim");
        uint256 amount = gambledFor[msg.sender][winner];
        gambledFor[msg.sender][winner] = 0;
        emit RewardClaimed(msg.sender, amount);
        (bool sent, ) = msg.sender.call{value: amount * contractBalanceSnap * 99 / 100 / balance[winner] }("");
        require(sent, "Failed to send Ether");
    }

    function setWinner() public {
        require(keccak256(abi.encode(winner)) == keccak256(abi.encode("undefined")), "Winner is already set");
        require(isMatchTimestampSet, "The match start timestamp is not checked yet");
        bytes32 resultBytes = RealityETH(realityContract).resultFor(questionId);
        require(resultBytes != 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe, "There is no accepted answer yet");

        uint256 resultNumber = uint256(resultBytes);
        if (resultNumber == 0) {
            winner = firstTeam;
        } else if (resultNumber == 1) {
            winner = secondTeam;
        } else if (resultNumber == 2) {
            winner = tie;
        }
        contractBalanceSnap = address(this).balance;
        isCompleted = true;
        completedTimestamp = block.timestamp;
        emit SetWinner(winner);
    }

    function setTimestamp() public {
        require(isMatchTimestampSet == false, "The timestamp is already set");
        bytes32 resultBytes = RealityETH(realityContract).resultFor(questionIdTimestamp);
        require(resultBytes != 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe, "There is no accepted answer yet");
        isMatchTimestampSet = true;
        uint256 resultNumber = uint256(resultBytes);
        matchTimestamp = resultNumber;
        emit SetTimestamp(resultNumber);
        if (resultNumber <= block.timestamp) {
            _cancelGamble();
        }
    }

    function getGambles() public view returns (Gamble[] memory) {
        return gambles;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function cancelGamble() public onlyOwner {
        _cancelGamble();
    }

    function _cancelGamble() private mustBeIncompleted {
        contractBalanceSnap = address(this).balance;
        uint256 oldTotal =  address(this).balance + (2 * realityFee);
        isCompleted = true;
        isCanceled = true;
        completedTimestamp = block.timestamp;
        emit CancelGamble(block.timestamp);
        for( uint i = 0; i < gambles.length; i++) {
            (bool sent, ) = gambles[i].playerAddress.call{value: gambles[i].amount * contractBalanceSnap / oldTotal * 99 / 100 }("");
            require(sent, "Failed to send Ether");
        }
        (bool sent2, ) = owner.call{value: address(this).balance }("");
        require(sent2, "Failed to send Ether");
    }
}
