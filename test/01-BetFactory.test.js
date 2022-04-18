const { expect } = require("chai");
const { ethers } = require("hardhat");
const { smock } = require("@defi-wonderland/smock");

describe("BetFactory", function () {
	let BetFactory;
	let betFactory;
	// let deployer;
	// let addr1;
	// let addr2;

	beforeEach(async function () {
		[deployer, addr1, addr2] = await hre.ethers.getSigners();
		BetFactory = await ethers.getContractFactory("BetFactory");
		betFactory = await BetFactory.deploy();
		await betFactory.deployed();
	});
	it("Should create a bet", async() => {
		const tx = betFactory.createBet("KRU", "FNC", "Quarter Finals","Esports", "Valorant", 1652293751, false);
		return expect(tx).emit(betFactory, 'CreateBet')
	});
	it("Should fail because of timestamp 24hs rule", async() => {
		const tx = betFactory.createBet("KRU", "FNC", "Quarter Finals","Esports", "Valorant", 1649723351, false);
		return expect(tx).to.be.revertedWith("The match must start at least 24 hours later than the gamble creation");
	});
});
