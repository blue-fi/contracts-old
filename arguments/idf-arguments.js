require('dotenv').config();
const ethers = require("ethers");

const {
  SERVER_URL,
  ORACLE,
  JOB_ID,
  FEE,
  PRICE,
  NETWORK
} = process.env;

/**
 * Crowdfundr
 * uint256 _goal,
 * address _fundraiser,
 * string memory _tokenURI
 */
// const fee = FEE * 10**18;

module.exports = [
  `${SERVER_URL}${NETWORK}`,
  ORACLE,
  ethers.utils.parseEther(`${FEE}`),
  ethers.utils.parseEther(`${PRICE}`)
];
