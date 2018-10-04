require("dotenv").config();
require("babel-register")({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require("babel-polyfill");

const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
console.log(process.env.PRIVATE_KEY);
const providerWithPrivateKey = (key, rpcEndpoint) =>
  new HDWalletProvider(key, rpcEndpoint);

const infuraProvider = network =>
  providerWithPrivateKey(
    process.env.PRIVATE_KEY,
    `https://${network}.infura.io`
  );

const rinkebyProvider = () => infuraProvider("rinkeby");
const mainnetProvider = () => infuraProvider("mainnet");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // eslint-disable-line camelcase
    },
    rinkeby: {
      provider: rinkebyProvider,
      network_id: 3 // eslint-disable-line camelcase
    },
    mainnet: {
      provider: mainnetProvider,
      gasPrice: 5e6,
      network_id: 1 // eslint-disable-line camelcase
    },
    coverage: {
      host: "localhost",
      network_id: "*", // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  }
};
