require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const {
  MNEMONIC,
  ALCHEMY_KEY,
  PRIVATE_KEY,
  SCAN_API_KEY,
  REPORT_GAS
} = process.env;

const needsNodeAPI =
  process.env.npm_config_argv &&
  (process.env.npm_config_argv.includes("rinkeby") ||
    process.env.npm_config_argv.includes("kovan") ||
    process.env.npm_config_argv.includes("mainnet") ||
    process.env.npm_config_argv.includes("matic") ||
    process.env.npm_config_argv.includes("mumbai") ||
    process.env.npm_config_argv.includes("arbitrum") ||
    process.env.npm_config_argv.includes("arbitrumtest") ||
    process.env.npm_config_argv.includes("optimism") ||
    process.env.npm_config_argv.includes("optimismtest"));

if (!PRIVATE_KEY && needsNodeAPI) {
  console.error("Please set a private key and ALCHEMY_KEY.");
  process.exit(0);
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.12',
  networks: {
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    kovan: {
      url: "https://eth-kovan.alchemyapi.io/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    arbitrum: {
      url: "https://arb-mainnet.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    arbitrumtest: {
      url: "https://arb-rinkeby.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    optimism: {
      url: "https://opt-mainnet.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    optimismtest: {
      url: "https://opt-kovan.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: SCAN_API_KEY
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }
};
