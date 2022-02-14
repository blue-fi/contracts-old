require('dotenv').config();
const ethers = require("ethers");

const {
  SERVER_URL,
  ORACLE,
  JOB_ID,
  FEE
} = process.env;

/**
 * Crowdfundr
 * uint256 _goal,
 * address _fundraiser,
 * string memory _tokenURI
 */
// const fee = FEE * 10**18;

module.exports = [
  SERVER_URL,
  ORACLE,
  JOB_ID,
  ethers.utils.parseEther(`${FEE}`)
];
