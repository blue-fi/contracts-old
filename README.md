# Project: IdentDeFi

## Project Spec
ERC-721 contract to create non-transferrable NFTs to support zero-knowledge verification of identity through KYC.

### Behaviour
-
## Notes
-
## Design Approach
-
## Requirements

- NPM

## Installation

1. Set your environment variables
```bash
open .env.example
```
fill in the missing following fields:
```bash
ALCHEMY_KEY="< your alchemy API key for the appropriate network >"
PRIVATE_KEY="< private key of the wallet that will be used to deploy and execute methods >"
SCAN_API_KEY="< Etherscan API key for contract deployment vaidation can be found here https://etherscan.io/apis >"
OWNER_ADDRESS="< account address of the wallet that will be used to deploy and execute methods that use gas >"
NETWORK="< name of network that will be deployed to. Example 'rinkeby', 'kovan' or 'mainnet' >"
```
rename '.env.example' file to '.env'

2. Install dependencies by running:

```bash
npm install

# OR...

yarn install
```

## Test

```bash
npm test
```

## Deployment

```bash
npm run deploy:<network>
```
## Validate Contract on Etherscan

```bash
npx hardhat verify --network <deployed network> <contract address> --show-stack-traces
```
