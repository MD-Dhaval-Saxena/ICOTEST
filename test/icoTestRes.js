// it("Should be Owner of Ico", async () => {
//     const icoInfo = await ico.getICOinfo();
//     // const testOwner = 0x5b38da6a701c568545dcfcb03fcb875f56beddc4;
//     // expect(icoInfo.owner).to.equal(ethers.utils.getAddress(testOwner));
//     // expect(icoInfo.owner).to.equal(ethers.utils.getAddress(testOwner));


//     //   try {
//     //     const testOwner = 0x5b38da6a701c568545dcfcb03fcb875f56beddc4;
//     //     expect(icoInfo.owner).to.equal(ethers.utils.getAddress(testOwner));
//     //   } catch (error) {
//     //     assert.include(error.message,"Owner address not match")
//     //   }
//   });

//    //   describe("Ico creation testing", () => {
//   //     it("should deploy and create ICO contract", async function () {
//   //       const startTime = 1000;
//   //       const endTime = 2000;
//   //       const priceToken = 10;

//   //       await icoCreate.deploy_ico(token.address, startTime, endTime, priceToken);

//   //       const icoAddress1 = await icoCreate.icoAddress;
//   //       const ico = await ethers.getContractFactory("ICO", icoAddress1.icoAddress);

//   //       const owneraddress = await ico.owner;
//   //       const startTime_Out = await ico.startTime;
//   //       const endTime_Out = await ico.endTime;
//   //       const priceToken_Out = await ico.priceToken;

//   //       expect(owneraddress).to.equal(owner.address);
//   //       expect(startTime_Out.toNumber()).to.equal(startTime);
//   //       expect(endTime_Out.toNumber()).to.equal(endTime);
//   //       expect(priceToken_Out.toNumber()).to.equal(priceToken);
//   //     });
//   //   });


//   it("Should Revert if Fee Not Paid", async () => {
//     await ico.connect(addr1).Invest({ value: Invamount });
//     // const a=0;
//     // if(a==0){
//     //   // throw new Error('Fees not paid');
//     //   expect(ico.Invest()).to.be.revertedWith('reverted Fees not paid ')
//     // }
//     //  expect(ico.Invest()).to.be.revertedWith('the string that is the second argument to the require statement in. your solidity code');
   
    
//     // expect(a).to.greaterThan(0).revertedWith('Fees Not paid');
    
//   });

//     // it("Should Check If Ico Owner received Payment", async () => {
//     // const own = await icoInfo.owner;
//     // const ownBal=await ethers.provider.getBalance(own);
//     // console.log(convert_wei(ownBal));

//     // });


//       // it("Should Check If Owner received the Payment of Tokens", async () => {
//     //   // Checking the token are received by Investor
//     //   const icoInfo = await ico.getICOinfo();

//     //   const own = await icoInfo.owner;
//     //   const ownBal = await ethers.provider.getBalance(own);
//     //   console.log(`ownBal:${convert_wei(ownBal)}`);

//     //   const priceTokens=icoInfo.priceToken;
//     //   // const totalToken=(Invamount / priceTokens) * 10 **18;
//     //   let total=ownBal.add(Invamount);
//     //   console.log(`Invamount :${total}`);

//     //   // expect(ownBal).to.increase(totalToken);
//     //   // expect(convert_wei(ownBal)).to.equal(convert_wei(totalToken));

//     // });

