require('dotenv').config();
const { ethers } = require("hardhat");
const Arguments = require("../arguments/idf-arguments");

const main = async () => {
  try {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const IdentDeFi = await ethers.getContractFactory("IdentDeFi");
    const identDeFi = await IdentDeFi.deploy(...Arguments);
    await identDeFi.deployed();
    console.log(`deployed to ${identDeFi.address}`);

    return console.log('SUCCESS: Deployment completed');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
