const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const wei_convert = (num) => hre.ethers.utils.parseEther(num.toString());
const convert_wei = (num) => hre.ethers.utils.formatEther(num);

describe("ICO", function () {
  let ICO;
  let ico;
  let token;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Winner");
    token = await Token.deploy();
    await token.deployed();

    ICO = await ethers.getContractFactory("ICO");
    ico = await ICO.deploy(
      token.address,
      owner.address,
      1,
      2,
      wei_convert(0.01)
    );
    await ico.deployed();

    await token.approve(ico.address, wei_convert(10000));
  });

  describe("Test to check if the contract is deployed successfully:", async function () {
    it("should deploy the ICO contract", async function () {
      const symbol = await token.symbol();
      expect(symbol).to.equal("win");
    });

    it("should Owner has valid address", async function () {
      const owner = await token.owner();
      expect(owner).to.not.be.null;
    });
  });
  describe("Test to check if the contract is deployed successfully:", async function () {
    it("Deploy the ICO contract with valid parameters and check if it is successfully deployed.", async function () {
      const icoInfo = await ico.getICOinfo();

      const owneraddress = await icoInfo.owner;
      const startTime_Out = await icoInfo.startTime;
      const endTime_Out = await icoInfo.endTime;
      const priceToken_Out = await icoInfo.priceToken;

      expect(owneraddress).to.equal(owner.address);
      expect(startTime_Out.toNumber()).to.equal(1);
      expect(endTime_Out.toNumber()).to.equal(2);
      expect(priceToken_Out).to.equal(wei_convert(0.01));
    });
  });

  describe("Test to check if the addToken function works as expected", () => {
    it("Should be Owner of Ico", async () => {
      const icoInfo = await ico.getICOinfo();
      expect(icoInfo.owner).to.equal(owner.address);
    });

    it("Should Specify the Add Token Amount", async () => {
      const amount = ethers.utils.parseEther("10");
      await ico.addToken(amount, { value: amount });
      expect(amount).to.greaterThan(0);
    });

    it("Should be Allowance to add Tokens", async () => {
      const allowance = await token.allowance(owner.address, ico.address);

      expect(allowance).to.equal(wei_convert(10000));
    });

    it("should allow adding tokens to the ICO", async () => {
      // checking balance
      const initialBal = await token.balanceOf(ico.address);
      const amount = ethers.utils.parseEther("0");

      // Add tokens to the ICO
      await ico.addToken(amount, { value: amount });

      // checking balance after adding
      const CurrBalance = await token.balanceOf(ico.address);
      expect(CurrBalance).to.equal(initialBal.add(amount));
    });
  });

  // Invest()
  describe("Test to check if the invest function works as expected", () => {
    beforeEach(async () => {
      await ico.addToken(wei_convert(100));
    });

    it("Should Invest Some ether and Receive Tokens", async () => {
      const initialBal= await token.balanceOf(ico.address);
      const tokeninvest = await ico.connect(addr1).Invest({ value: wei_convert(0.1) });
      const CurrBalance= await token.balanceOf(ico.address);

      expect(CurrBalance).to.equal(wei_convert(90));

    });
  });
});
