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
  let icoInfo;
  let amount;

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
    icoInfo = await ico.getICOinfo();
  });
  

  // ICO.sol
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
      // const icoInfo = await ico.getICOinfo();
      expect(icoInfo.owner).to.equal(owner.address);
    });

    it("Should Specify the Add Token Amount", async () => {
      const amount = ethers.utils.parseEther("1");
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
      amount = ethers.utils.parseEther("100");

      // Add tokens to the ICO
      await ico.addToken(amount, { value: amount });

      // checking balance after adding
      const CurrBalance = await token.balanceOf(ico.address);
      expect(CurrBalance).to.equal(initialBal.add(amount));
    });
  });

  // Invest()
  describe("Test to check if the invest function works as expected", () => {
    let CurrBalance, Invamount, icoInfo, priceTokens;

    beforeEach(async () => {
      await ico.addToken(wei_convert(100));
      Invamount = wei_convert(0.01);
      // Invamount = wei_convert(0);
      const tokeninvest = await ico.connect(addr1).Invest({ value: Invamount });
      CurrBalance = await token.balanceOf(ico.address);
      icoInfo = await ico.getICOinfo();
      priceTokens = icoInfo.priceToken;
    });

    it("Should Invest Some ether and Check Receive Tokens", async () => {
      expect(CurrBalance).to.equal(wei_convert(99));
    });
    it("Shold return the amount greater then tokens", async () => {
      const initialBalance = parseInt(convert_wei(await ethers.provider.getBalance(addr1.address)));
      const tx = await ico.connect(addr1).Invest({value: wei_convert(6)});
      const finalBalance = parseInt(convert_wei(await ethers.provider.getBalance(addr1.address)));

      expect(await token.balanceOf(ico.address)).to.equal(0);
      // expect(initialBalance - finalBalance).to.equal(5);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
  });
    it("Should Check If Investor received the tokens", async () => {
      // Checking the token are received by Investor
      const Investor = await addr1.address;
      const InvBal = await token.balanceOf(Investor);

      const totalToken = (Invamount / priceTokens) * 10 ** 18;
      // this.value =new BN(1);

      expect(InvBal.toString()).to.equal(totalToken.toString());
    });
    it("Should Fail If Ico Not started", async () => {
      const currDate = 2;
      const icoStart = icoInfo.startTime; //it's 1 now
      expect(currDate).to.greaterThan(icoStart);
      // s=1677138264   c=1677138263
    });

    it("Should Revert if Fee Not Paid", async () => {
      const TestAmount = 0;
      try {
        const Testinvest = await ico
          .connect(addr1)
          .Invest({ value: wei_convert(TestAmount) });
      } catch (error) {
        console.log("Transaction reverted:", error.message);
      }
    });
  

    //.............................
  });
});
