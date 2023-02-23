const hre = require("hardhat");

async function main() {

  const Simple = await hre.ethers.getContractFactory("Simple");
  const simp = await Simple.deploy();
  await simp.deployed();

  console.log(`Contract address: ${simp.address}`);
}
