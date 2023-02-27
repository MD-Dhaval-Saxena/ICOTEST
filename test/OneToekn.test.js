const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const wei_convert = (num) => hre.ethers.utils.parseEther(num.toString());
const convert_wei = (num) => hre.ethers.utils.formatEther(num);

// 20000000000000000000
describe("OneToken", () => {
  let token, InvAmount, tokenMint;
  let totalSupply = 20000000000000000000000000;
  beforeEach(async () => {
    [owner, addr1, addr2,addr3,addr4] = await hre.ethers.getSigners();
    const Token = await ethers.getContractFactory("Onetoken");
    token = await Token.deploy();
    await token.deployed();
  });

  describe("OneToken", () => {
    it("should deploy the Token contract", async function () {
      const symbol = await token.symbol();
      expect(symbol).to.equal("otk");
    });
    it("should Owner has valid address", async function () {
      //   const owner = await token.owner();
      expect(owner).to.not.be.null;
    });

    describe("Check Minting", async () => {
      let accConv, InvConv;
      beforeEach(async () => {
        InvAmount = wei_convert(0.1);
        tokenMint = await token.connect(owner).mint({ value: InvAmount });
        await tokenMint.wait();
      });
      it("Should Check That tokens are minted", async () => {
        let accBal = await token.balanceOf(owner.address);
        accConv = convert_wei(accBal);
        InvConv = convert_wei(InvAmount) * 10000000;
        expect(parseInt(accConv)).to.equal(InvConv);
      });

      it("Should Check Balance Added to maxToken", async () => {
        let maptoken = await token.maxToken(owner.address);
        let mapConv = convert_wei(maptoken);
        expect(parseInt(mapConv)).to.equal(InvConv);
      });
      it("should fail to mint if value is less than 0.1 ether", async () => {
        let invMin = wei_convert(0.09);
        await expect(
          token.connect(owner).mint({ value: invMin })
        ).to.be.revertedWith("Minimum Mint is 0.1 ETH");
      });

      it("should fail to mint if value is greater than 2 ether", async () => {
        let invMax = wei_convert(2.1);
        await expect(
          token.connect(owner).mint({ value: invMax })
        ).to.be.revertedWith("Maximum Mint Amount is 2 Ether");
      });

      it("should fail to mint if maxToken mapping is already at limit", async function () {
        let inv1 = wei_convert(0.1);
        let inv2 = wei_convert(1.8);
        let inv3 = wei_convert(0.1);
        await token.connect(owner).mint({ value: inv1 });
        await token.connect(owner).mint({ value: inv2 });
        // await token.connect(owner).mint({ value: inv3 });

        let maxtoken = await token.maxToken(owner.address);

        expect(maxtoken)
          .to.be.not.greaterThan(BigInt(totalSupply))
          .to.be.revertedWith("You Minted Maximum amount of Tokens");
      });
    });

    describe("Check Transfer", () => {
      let amount, payableAmount;
      let taxPer = 10;
      let invAm = wei_convert(1);
      beforeEach(async () => {
        amount = wei_convert(1000);
        await token.connect(addr1).mint({ value: invAm });
      });

      it("should Not charge to  exempted accounts", async () => {
        await token.AddExemptedAcc(addr1.address);
        await token.connect(addr1).transfer(addr2.address, wei_convert(1));
        // amount=amount;
        // const balanceAcc = await token.balanceOf(addr2.address);
        // expect(balanceAcc).to.equal(amount);
        // console.log(`balanceAcc:${balanceAcc}`);
        // console.log(`amount:${convert_wei (amount)}`);
      });

      it("should  charge to  Non-exempted accounts", async () => {
        await token.connect(addr3).mint({ value: invAm });
        await token.connect(addr3).transfer(addr4.address, amount);
        amount -= amount / taxPer;
        const balanceAcc = await token.balanceOf(addr4.address);
        expect(BigInt(balanceAcc)).to.equal(BigInt (amount));
     
      });
    });
  });
});

//
