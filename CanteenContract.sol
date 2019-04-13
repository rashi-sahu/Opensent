pragma solidity ^0.4.11;

contract CanteenContract {
    uint256 canteenBalance;
    uint256 personBalance;
    uint256 governmentBalance;

    struct Order{
        address canteenAddress;
        address personAddres;
        bytes32 itemName;
        uint256 itemPrice;
        uint256 status;
        /*
        0 denotes success
        1 denotes cancellation request pending
        2 cancellation accepted & amount refunded
        */
    }
    mapping (bytes32 => uint256) public menu;
    mapping(address => uint256) canteens;
    mapping(address => uint256) persons;
    Order[] public orders;

    function CanteenContract() public{
        canteenBalance = 0;
        personBalance = 5000;
        governmentBalance = 0;
        menu["Maggi"] = 20;
        menu["Burger"] = 40;
        menu["Paratha"] = 30;
        menu["Pasta"] = 80;
        canteens[0xAC6474E46f5E87bAf69EEE2c05b73cBD3b8b403f] = 100;
        canteens[0x4c471A18A164F39540Fd0E9AccC0926DBee42d96] = 150;
        canteens[0x0f9223193016114aA33C35Ee74060b1b5d954f31] = 50;
        persons[0xa45E358D48C6890f5e8D3C6AD4aBB6Ce8D730de4] = 1000;
        persons[0xFBFa8ABa3d7A429C47EDa7f0Ea3fB5890a775225] = 1000;
        persons[0x95Ee97078a54716146E3546508be5694aF43caa8] = 1000;
        Order memory dummyOrder = Order(0xAC6474E46f5E87bAf69EEE2c05b73cBD3b8b403f,
                                0xa45E358D48C6890f5e8D3C6AD4aBB6Ce8D730de4,
                                "Maggi", 20, 0);
        orders.push(dummyOrder);
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
    function getCanteenBalance(address _address) public returns (uint256){
        return canteens[_address];
    }
    function getPersonBalance(address _address) public returns (uint256){
        return persons[_address];
    }

    function validItem(bytes32 item) public returns (bool){
        if(item == "Maggi" || item == "Burger" || item == "Paratha" || item == "Pasta")
          return true;
        return false;
    }

    function updatePersonWallet(uint256 rechargeAmount) public{
        personBalance += rechargeAmount;
    }

    function getOrdersOfCanteen(address _canteenAddress) public
        returns (address[], address[], bytes32[], uint256[], uint256[]){
            uint256[] memory indexes = new uint256[](100);
            uint256 count = 0;
            for (uint256 i = 0; i < orders.length; i++){
                if(orders[i].canteenAddress == _canteenAddress){
                    indexes[count] = i;
                    count++;
                }
            }
            address[] memory canteenAddresses = new address[](indexes.length);
            address[] memory personAddresses = new address[](indexes.length);
            bytes32[] memory itemNames = new bytes32[](indexes.length);
            uint256[] memory prices = new uint256[](indexes.length);
            uint256[] memory statusArray = new uint256[](indexes.length);

            for (i = 0; i < indexes.length; i++) {
                Order storage order = orders[indexes[i]];
                canteenAddresses[i] = order.canteenAddress;
                personAddresses[i] = order.personAddres;
                itemNames[i] = order.itemName;
                prices[i] = order.itemPrice;
                statusArray[i] = order.status;
            }
    }
}
