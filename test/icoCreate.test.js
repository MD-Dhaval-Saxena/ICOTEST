const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const wei_convert = (num) => hre.ethers.utils.parseEther(num.toString());
const convert_wei = (num) => hre.ethers.utils.formatEther(num);