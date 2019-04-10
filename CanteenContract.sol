pragma solidity ^0.4.11;

contract CanteenContract {
    uint256 canteenBalance;
    uint256 personBalance;
    uint256 governmentBalance;

    mapping (bytes32 => uint256) public menu;
    mapping(address => uint256) canteens;
    mapping(address => uint256) persons;

    function CanteenContract() public{
        canteenBalance = 0;
        personBalance = 5000;
        governmentBalance = 0;
        menu["Maggi"] = 20;
        menu["Burger"] = 40;
        menu["Paratha"] = 30;
        menu["Pasta"] = 80;
        canteens[0x18F99CA73C14072Eba00dcd072434aF88af56Ef3] = 100;
        canteens[0xe61bd37De6fd7Ef33D42C0F3a679e91D3352DD2c] = 150;
        canteens[0x551E3fb72BffD415f7b1c1e65e5feAD76c132753] = 50;
        persons[0xDCd592372C4DB3199671455B12768F407eFF8685] = 1000;
        persons[0x7ed63514b00b106aAEAFD517042140Ce4Ba91d2a] = 1000;
        persons[0x7357B1250fd5e04761D0FE4Ed1a684f988dC256A] = 1000;

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
