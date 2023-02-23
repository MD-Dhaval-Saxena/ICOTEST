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

    it("Should allow adding tokens to the ICO", async () => {
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
    let CurrBalance, Invamount;
    beforeEach(async () => {
      await ico.addToken(wei_convert(100));
      Invamount = wei_convert(0.1);
      console.log(`Invamount:${Invamount}`);
      const tokeninvest = await ico.connect(addr1).Invest({ value: Invamount });
      CurrBalance = await token.balanceOf(ico.address);
    });

    it("Should Invest Some ether and Check Receive Tokens", async () => {
      expect(CurrBalance).to.equal(wei_convert(90));
    });
    it("Should receive the tokens", async () => {
      // Checking the token are received by Investor
      const icoInfo = await ico.getICOinfo();

      const own = await addr1.address;
      const ownBal = await token.balanceOf(own);
      console.log(`ownBal:${ownBal}`);

      const totalToken=convert_wei(Invamount) * (icoInfo.priceToken);
      console.log(`totalToken:${totalToken}`);
      expect(ownBal).to.equal(totalToken);
    });

    it("Should Fail If Ico Not started", async () => {
      const icoInfo = await ico.getICOinfo();

      const currDate = 2;
      const icoStart = icoInfo.startTime; //it's 1 now
      expect(currDate).to.greaterThan(icoStart);
      // s=1677138264   c=1677138263
    });

    // it("Should Check If Ico Owner received Payment", async () => {
    // const own = await icoInfo.owner;
    // const ownBal=await ethers.provider.getBalance(own);
    // console.log(convert_wei(ownBal));

    // });
  });
});
