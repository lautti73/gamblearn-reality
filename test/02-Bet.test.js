const { expect } = require("chai");
const { ethers } = require("hardhat");
const { smock } = require("@defi-wonderland/smock");
const { time } = require("console");

describe("Bet", function () {
	let Bet;
	let bet;
    let BetMocked;
    let betMocked;
	let RealityETHMock;
	let realityeth;
	let deployer;
	let addr1;
	let addr2;

	beforeEach(async function () {
		[deployer, addr1, addr2] = await hre.ethers.getSigners();
		Bet = await ethers.getContractFactory("Bet");
		bet = await Bet.deploy(deployer.address, "KRU", "FNC", "Quarter Finals","Esports", "Valorant", 1683912077, deployer.address, false);
		await bet.deployed();

        BetMocked = await smock.mock("Bet");
		betMocked = await BetMocked.deploy(deployer.address, "KRU", "FNC", "Quarter Finals","Esports", "Valorant", 1683912077, deployer.address, false);
		await betMocked.deployed();

		BetMockedNotOwner = await smock.mock("Bet");
		betMockednotowner = await BetMockedNotOwner.deploy(deployer.address, "KRU", "FNC", "Quarter Finals","Esports", "Valorant", 1683912077, addr1.address, false);
		await betMockednotowner.deployed();

		RealityETHMock = await smock.mock("RealityETHMock");
		realityeth = await RealityETHMock.deploy();
		await realityeth.deployed();
		
		await bet.setReality(realityeth.address);
		await betMocked.setReality(realityeth.address);
	});
	describe("Enter Gamble", async() => {
		it("Enters a gamble with a correct amount", async() => {
			const tx = bet.enterGamble("KRU", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.emit(bet, 'CreatedGamble');
		});
		it("Enters a gamble with a non-correct amount", async() => {
			const tx = bet.enterGamble("KRU", {value: ethers.utils.parseEther('0.001')});
			return expect(tx).to.be.revertedWith("Minimum amount to gamble is 0.002 eth");
		});
		it("Enters a gamble with a non-correct team", async() => {
			const tx = bet.enterGamble("KRu", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.be.revertedWith("You must select a valid team");
		});
		it("Enters a gamble with tie team, when it's not accepted", async() => {
			const tx = bet.enterGamble("Tie", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.be.revertedWith("You must select a valid team");
		});
		it("Enters a gamble with tie team, when it's accepted", async() => {
			await betMocked.setVariable("acceptsTie", true);
			const tx = betMocked.enterGamble("Tie", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.emit(betMocked, 'CreatedGamble');
		});
		it("Enters a gamble with wrong team, when tie is accepted", async() => {
			await betMocked.setVariable("acceptsTie", true);
			const tx = betMocked.enterGamble("Tiee", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.be.revertedWith("You must select a valid team");
		});
		it("Enters a crossdated gamble", async() => {
			betMocked.setVariable("matchTimestamp", 1649773643);
			const tx = betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.be.revertedWith("The gamble do not receive more bets");
		});
		it("Enters the second gamble with the timestamp not answered", async() => {
			await bet.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			const tx = bet.enterGamble("KRU", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.be.revertedWith("This gamble is not open, please check the state");
		});
		it("Enters the second gamble with the timestamp answered", async() => {
			const timestamp = ethers.BigNumber.from(1683085128);
			const timestamp32bytes = ethers.utils.hexZeroPad(timestamp.toHexString(), 32);
			await realityeth.setVariable("result", timestamp32bytes);
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			await betMocked.setTimestamp();
			const tx = betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.003')});
			return expect(tx).to.emit(betMocked, 'CreatedGamble');
		});
	})
	describe("Set timestamp", async() => {
		it("Set timestamp when it is already set", async() => {
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			const timestamp = ethers.BigNumber.from(1684002823);
			const timestamp32bytes = ethers.utils.hexZeroPad(timestamp.toHexString(), 32);
			await realityeth.setVariable("result", timestamp32bytes);
			await betMocked.setTimestamp();
			const tx = betMocked.setTimestamp();
			return expect(tx).to.be.revertedWith("The checking timestamp period is not open");
		});
		it("Set timestamp when it's not set", async() => {
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			const timestamp = ethers.BigNumber.from(1684002823);
			const timestamp32bytes = ethers.utils.hexZeroPad(timestamp.toHexString(), 32);
			await realityeth.setVariable("result", timestamp32bytes);
			const tx = betMocked.setTimestamp();
			return expect(tx).to.emit(betMocked, 'SetTimestamp').withArgs(1684002823);
		});
		it("Set timestamp when it's not set and it's minor than now", async() => {
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			const timestamp = ethers.BigNumber.from(1649864622);
			const timestamp32bytes = ethers.utils.hexZeroPad(timestamp.toHexString(), 32);
			await realityeth.setVariable("result", timestamp32bytes);
			const tx = betMocked.setTimestamp();
			return expect(tx).to.emit(betMocked, 'CancelGamble') 
		});
	})
	describe("Set winner", async() => {
		it("Set winner when it's already set and timestamp is not set", async() => {
			await betMocked.setVariable("isMatchTimestampSet", true);
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			await betMocked.setWinner();
			const tx = betMocked.setWinner();
			return expect(tx).to.be.revertedWith("Winner is already set");
		});
		it("Set winner when it's already set and timestamp is set", async() => {
			await betMocked.setVariable("isMatchTimestampSet", true);
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			await betMocked.setWinner();
			const tx = betMocked.setWinner();
			return expect(tx).to.be.revertedWith("Winner is already set");
		});
		it("Set winner when it is not set and timestamp is not set", async() => {
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			const tx = betMocked.setWinner();
			return expect(tx).to.be.revertedWith("The match start timestamp is not checked yet");
		});
		it("Set winner when it is not set and timestamp is not set", async() => {
			await betMocked.setVariable("isMatchTimestampSet", true);
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			const tx = betMocked.setWinner();
			return expect(tx).to.emit(betMocked, "SetWinner").withArgs("KRU");
		});
		it("Set winner when it is not set and timestamp is set", async() => {
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			const tx = betMocked.setWinner();
			return expect(tx).to.be.revertedWith("The match start timestamp is not checked yet");
		});
	})
	describe("Claim reward", async() => {
		it("Claims reward having won", async() => {	
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			await betMocked.setVariable("isMatchTimestampSet", true);
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			await betMocked.setWinner();
			await betMocked.setVariable("winner", "KRU");
			
			const tx = betMocked.claimReward();
			return expect(tx).to.emit(betMocked, 'RewardClaimed');
		});
		it("Claims reward not having won", async() => {
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});

			await betMocked.setVariable("isMatchTimestampSet", true);
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			await betMocked.setWinner();
			await betMocked.setVariable("winner", "FNC");

			const tx = betMocked.claimReward();
			return expect(tx).to.be.revertedWith("You have not reward to claim");
		});
		it("Claims reward having bet for both teams differents amounts", async() => {
			await betMocked.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});

			const timestamp = ethers.BigNumber.from(1684002823);
			const timestamp32bytes = ethers.utils.hexZeroPad(timestamp.toHexString(), 32);
			await realityeth.setVariable("result", timestamp32bytes);
			await betMocked.setTimestamp();

			await betMocked.enterGamble("FNC", {value: ethers.utils.parseEther('0.003')});
			
			const winner = ethers.BigNumber.from(0);
			const winner32bytes = ethers.utils.hexZeroPad(winner.toHexString(), 32);
			await realityeth.setVariable("result", winner32bytes);
			await betMocked.setWinner();
			await betMocked.setVariable("winner", "FNC");

			const tx = betMocked.claimReward();
			return expect(tx).to.emit(betMocked, 'RewardClaimed').withArgs(deployer.address, ethers.utils.parseEther('0.003'));
		});
	})
	describe("Cancel gamble", async() => {
		it("Should cancel the gamble", async() => {;
			const tx = bet.cancelGamble();
			return expect(tx).to.emit(bet, 'CancelGamble');
		});
		it("Should cancel the gamble, having at least 1 gamble", async() => {;
			await bet.enterGamble("KRU", {value: ethers.utils.parseEther('0.002')});
			const tx = bet.cancelGamble();
			return expect(tx).to.emit(bet, 'CancelGamble');
		});
		it("Should revert cancel gamble, only owner permission", async() => {;
			const tx = betMockednotowner.cancelGamble();
			return expect(tx).to.be.revertedWith("Only the owner of the gamble can execute this function");
		});
	})
});
