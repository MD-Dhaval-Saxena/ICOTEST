// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


contract Simple{
   uint256 public count=0; 
   string public Name;
    constructor () {
        count=0;
        Name="user";
    }
    function setCount() public returns(uint){
        count=10;
        return count;
    }

   function IncrementCount() public{
       count= count + 1;
   }
}