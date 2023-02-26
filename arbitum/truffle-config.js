// create a file at the root of your project and name it .env -- there you can set process variables
// like the mnemomic below. Note: .env is ignored by git in this project to keep your private information safe
require('dotenv').config();
const mnemonic = process.env["MNEMONIC"];
const alchemyKey = process.env["ALCHEMY_KEY"];
const goerliKey = process.env["GOERLI_KEY"]

//uncomment to use mainnetMnemonic, be sure to set it in the .env file
//const mainnetMnemonic = process.env["MAINNET_MNEMONIC"]

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  /**
  * contracts_build_directory tells Truffle where to store compiled contracts
  */
  // contracts_build_directory: './build/arbitrum-contracts',
  contracts_build_directory: './build/ethereum-contracts',

  /**
  *  contracts_directory tells Truffle where to find your contracts
  */
  // contracts_directory: './contracts/arbitrum',
  contracts_directory: './contracts/ethereum',

  networks: {
    development: {
      url: "http://127.0.0.1:9545",
      network_id: "*",
    },
    arbitrum_testnet: {
      network_id: 421613,
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: 'https://arb-goerli.g.alchemy.com/v2/' + alchemyKey,
          addressIndex: 0,
          numberOfAddresses: 1,
          network_id: 421613,
          chainId: 421613
        })
      }
    },
    // requires a mainnet mnemonic; you can save this in .env or in whatever secure location
    // you wish to use
    arbitrum_mainnet: {
      network_id: 42161,
      chain_id: 42161,
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://arbitrum-mainnet.infura.io/v3/" + alchemyKey, 0, 1);
      }
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, "https://eth-goerli.g.alchemy.com/v2/MRRdG0d-MJXVwl5ogBT_pkUHlbWcqxkl"),
      network_id: 5,
      gas: 4465030
    }
  },

  mocha: {
    timeout: 100000
  },
  compilers: {
    solc: {
      version: "^0.8.9",
      settings:  {
        optimizer: {
          enabled: true,
          runs: 800
        }
      }
    },
  },
  db: {
    enabled: false
  },
  plugins: [
    'truffle-plugin-verify'
  ], 
  api_keys: {
    etherscan: process.env.ETHERSCANAPI
  }
}
