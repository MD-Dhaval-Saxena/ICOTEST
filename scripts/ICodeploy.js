const hre = require("hardhat");

async function main() {
  const IcoCreate = await hre.ethers.getContractFactory("IcoCreate");
  const icoCreate = await IcoCreate.deploy();
  await icoCreate.deployed();

  const ICO = await hre.ethers.getContractFactory("ICO");
  const ico = await ICO.deploy();
  await ico.deployed();

  const Winner = await hre.ethers.getContractFactory("Winner");
  const winner = await Winner.deploy();
  await winner.deployed();

  console.log(`Contract address: ${ico.address}`);
}
