pragma solidity ^0.4.11;

contract CanteenContract {
  uint256 canteenBalance;
  uint256 personBalance;
  uint256 governmentBalance;

  mapping (bytes32 => uint256) public menu;

  function CanteenContract(){
    canteenBalance = 0;
    personBalance = 0;
    governmentBalance = 0;
    menu["Maggi"] = 20;
    menu["Burger"] = 40;
    menu["Paratha"] = 30;
    menu["Pasta"] = 80;
  }

  function buyItem(bytes32 item) {
    if(validItem(item)==false) throw;
    uint256 price = menu[item];
    uint256 totalPrice = price+5;
    canteenBalance += price;
    governmentBalance += 5;
    personBalance -= totalPrice;
  }

  function getGovernmentBalance() returns (uint256){
    return governmentBalance;
  }
  function getCanteenBalance() returns (uint256){
    return canteenBalance;
  }
  function getPersonBalance() returns (uint256){
    return personBalance;
  }

  function validItem(bytes32 item) returns (bool){
    if(item == "Maggi" || item == "Burger" || item == "Paratha" || item == "Pasta")
      return true;
    return false;
  }

}
