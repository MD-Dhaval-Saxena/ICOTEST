const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const wei_convert = (num) => hre.ethers.utils.parseEther(num.toString());
const convert_wei = (num) => hre.ethers.utils.formatEther(num);

describe("IcoCreate", () => {
  let IcoCreate, icoCreate, Token, token;

  beforeEach(async function () {
    [Creator] = await ethers.getSigners();

    Token = await ethers.getContractFactory("Winner");
    token = await Token.deploy();
    await token.deployed();

    IcoCreate = await hre.ethers.getContractFactory("IcoCreate");
    icoCreate = await IcoCreate.deploy();
    await icoCreate.deployed();
  });

  describe("Test IcoCreate With Proper parameter", () => {
    let event_log, cnt_ico, beforCnt, afterCnt;
    beforeEach(async () => {
      const createIco = await icoCreate.deploy_ico(
        token.address,
        1,
        2,
        wei_convert(0.01)
      );

      const tx_data = await createIco.wait();
      // console.log(tx_data);
      event_log = await tx_data.events;
    });

    it("Should Check Event emitted for ICoCreated", async () => {
      expect(event_log[0].event).to.equal("CreateICO");
    });

    it("Should Check ICO is created By Owner’s address or not", async () => {
      const ico_Add = event_log[0].args.icoAddress;
      const ico = await ethers.getContractAt("ICO", ico_Add);
      await ico.deployed();
      const icoInfo = await ico.getICOinfo();
      expect(icoInfo.owner).to.equal(Creator.address);
    });

    it("Check the counter has increment", async () => {
      const cnt_ico = await icoCreate.counter();
      expect(event_log[0].args.icoNumber).to.equal(cnt_ico);
    });
    // it("Check if the mapping has the deployed contract address.", async () => {
    //     await icoCreate.deploy_ico(
    //         token.address,
    //         1,
    //         2,
    //         wei_convert(0.01)
    //       );
    //     const icoAdd =await icoCreate.icoAddress[0];
    //     console.log(icoAdd);
    // });
    //   .....
  });
});
