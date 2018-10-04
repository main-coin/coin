var MainCoin = artifacts.require("./MainCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(MainCoin);
};
