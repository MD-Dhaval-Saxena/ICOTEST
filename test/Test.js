const { expect } = require("chai");
const { ethers } = require("hardhat");

  
describe("Simple contract", function() {
    let simple;
    let owner;
    
    beforeEach(async function() {
      [owner] = await ethers.getSigners();
      const Simple = await ethers.getContractFactory("Simple");
      simple = await Simple.deploy();
      await simple.deployed();
    });
  
    it("initial count should be 0", async function() {
      const count = await simple.count();
      expect(count).to.equal(0);
    });
  
    it("initial name should be 'user'", async function() {
      const name = await simple.Name();
      expect(name).to.equal("user");
    });
  
    it("setCount function should update count to 10", async function() {
      await simple.setCount();
      const count = await simple.count();
      expect(count).to.equal(10);
    });
  
    it("incrementCount function should increment count by 1", async function() {
      await simple.IncrementCount();
      const count = await simple.count();
      expect(count).to.equal(1);
    });
  });