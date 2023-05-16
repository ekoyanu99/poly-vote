require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

//Account credentials from which our contract will be deployed
const mnemonic = process.env.MNEMONIC;

//API key of your Datahub account for Avalanche Fuji test network
//const APIKEY = process.env.APIKEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: ""
    },
    mumbai: {
      provider: function() {
        return new HDWalletProvider({mnemonic, providerOrUrl: `https://rpc.ankr.com/polygon_mumbai`})
      },
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001
    }
  },
  compilers:{
    solc: {
      version:"^0.8.9",
      optimizer: {
      enabled: true,
      runs: 200
    },
    evmVersion: "byzantium",
  },
  },
  plugins: [
    'truffle-plugin-verify'
  ], 
  api_keys: {
    polygonscan: process.env.POLYGONSCANAPI
  }
}