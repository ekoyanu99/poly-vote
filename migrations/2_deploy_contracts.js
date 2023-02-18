const Election = artifacts.require("Election");
const PolyVote = artifacts.require("PolyVote");

module.exports = function(deployer) {
  deployer.deploy(Election, {overwrite: false});
  deployer.deploy(PolyVote, {overwrite: false});
};