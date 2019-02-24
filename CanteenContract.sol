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
    menu["Maggi"] = 20;
    menu["Burger"] = 40;
    menu["Paratha"] = 30;
    menu["Pasta"] = 80;
  }

  function buyItem(bytes32 item) {
    if(validItem(item)==false) throw;
    uint8 price = menu[item];
    uint8 totalPrice = price*1.05;
    canteenBalance += price;
    governmentBalance += price*0.05;
    personBalance -= totalPrice;
  }

  function validItem() returns (bool){
    if(item == "Maggi" || item == "Burger" || item == "Paratha" || item == "Pasta")
      return true;
    return false;
  }

}
