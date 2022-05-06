// require("dotenv").config();

// require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require('dotenv').config({ path: "./.env" });
// require("hardhat-gas-reporter");
// require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 let accountPrivateKey;
 if (!process.env.PRIVATE_KEY) {
   throw new Error("Please set your PRIVATE_KEY in a .env file");
 } else {
   accountPrivateKey = process.env.PRIVATE_KEY;
 }
 
 let infuraId;
 if (!process.env.INFURA_ID) {
   throw new Error("Please set your INFURA_ID in a .env file");
 } else {
  infuraId = process.env.INFURA_ID;
 }

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraId}`,
      accounts: [accountPrivateKey],
    },
  },
};
