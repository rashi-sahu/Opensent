pragma solidity ^0.4.11;

contract CanteenContract {
  uint256 canteenBalance;
  uint256 personBalance;
  uint256 governmentBalance;

  mapping (bytes32 => uint8) public menu;

  function CanteenContract(){
    canteenBalance = 0;
    personBalance = 0;
    governmentBalance = 0;
  }

}
