const MainCoin = artifacts.require("./MainCoin.sol");
const args = process.argv.splice(6);
console.log(args);

module.exports = async function() {
  const token = await MainCoin.deployed();
  console.log(token);
  console.log(await token.allowTransfer(args[0]));
};
