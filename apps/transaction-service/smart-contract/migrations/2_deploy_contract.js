const TeachMeContract = artifacts.require('TeachMeContract');

module.exports = function (deployer) {
    deployer.deploy(TeachMeContract, { gas: 6000000 });
};
