pragma solidity ^0.4.11;

contract CanteenContract {
    struct Person {
        bytes32 name;
        uint256 balance;
        bytes32 password;
        bytes32 email;
    }

    uint256 canteenBalance;
    uint256 personBalance;
    uint256 governmentBalance;

    mapping (bytes32 => uint256) public menu;

    function CanteenContract() public{
        canteenBalance = 0;
        personBalance = 5000;
        governmentBalance = 0;
        menu["Maggi"] = 20;
        menu["Burger"] = 40;
        menu["Paratha"] = 30;
        menu["Pasta"] = 80;
    }

    function buyItem(bytes32 item) public{
        // if(validItem(item)==false) throw;
        uint256 price = menu[item];
        uint256 totalPrice = price+5;
        canteenBalance += price;
        governmentBalance += 5;
        personBalance -= totalPrice;
    }

    function getGovernmentBalance() public returns (uint256){
        return governmentBalance;
    }
    function getCanteenBalance() public returns (uint256){
        return canteenBalance;
    }
    function getPersonBalance() public returns (uint256){
        return personBalance;
    }

    function validItem(bytes32 item) public returns (bool){
        if(item == "Maggi" || item == "Burger" || item == "Paratha" || item == "Pasta")
          return true;
        return false;
    }

    function updatePersonWallet(uint256 rechargeAmount) public{
        personBalance += rechargeAmount;
    }

}
