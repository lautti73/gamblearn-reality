//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract RealityETHMock {

    bytes32 public result;
    bytes32 public questionId;

    constructor() {}

    function resultFor(bytes32 _questionId) external returns (bytes32) {
        return result;
    }

    function askQuestion(
        uint256 templateId,
        string memory question,
        address arbitrator,
        uint32 timeout,
        uint32 openingTs,
        uint256 nonce
    ) external payable returns (bytes32 _questionId) {
        return questionId;
    }
}