const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const web3 = require('./web3Client.js');
const code = fs.readFileSync('CanteenContract.sol').toString();
const solc = require('solc');
const compiledCode = solc.compile(code);
const abiDefinition = JSON.parse(compiledCode.contracts[':CanteenContract'].interface);
const CanteenContract = new web3.eth.Contract(abiDefinition);
const byteCode = compiledCode.contracts[':CanteenContract'].bytecode;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var defaultAddress = '0xDCd592372C4DB3199671455B12768F407eFF8685';

const deploy = async (CanteeContract, byteCode) => {
  const gas = await CanteeContract.deploy({data: byteCode}).estimateGas();
  const response = await CanteenContract.deploy({data: byteCode}).send({
    from: defaultAddress,
    gas: gas + 1
  });
  console.log('Contract deployed to:', response.options.address);
  return response;
};

deploy(CanteenContract, byteCode).then((contractInstance) => {
  app.listen(3000, function () {
    console.log('App ready and listening on port 3000!');
  });

  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + 'public/index.html'));
  });

  app.post('/buy', function (req, res) {
    try {
      const itemName = req.body.itemName.trim();
      contractInstance.methods.buyItem(itemName, { from: defaultAddress }, function(result) {
        var personBalance;
        contractInstance.methods.getPersonBalance().call({ from: defaultAddress }).then((result) => console.log(result));
        const canteenBalance = contractInstance.methods.getCanteenBalance().call({ from: defaultAddress }).toString();
        const governmentBalance = contractInstance.methods.getGovernmentBalance().call({ from: defaultAddress }).toString();
        res.send({ personBalance: personBalance, canteenBalance: canteenBalance, governmentBalance: governmentBalance});
      });
    } catch (e) {
      res.status('400').send(`Failed! ${e}`);
    }
  });

  app.get('/balances', function(req, res) {
    var stakeholders = ['Person', 'Canteen', 'Government'];
    try {
      const stakeholderBalances = stakeholders.map(function(stakeholders) {
        //const personBalance = contractInstance.methods.getPersonBalance.call({ from: defaultAddress }).toString();
        var personBalance=5;
        contractInstance.methods.getPersonBalance().call({ from: defaultAddress }).then((result) => console.log(result));
        const canteenBalance = contractInstance.methods.getCanteenBalance().call({ from: defaultAddress }).toString();
        const governmentBalance = contractInstance.methods.getGovernmentBalance().call({ from: defaultAddress }).toString();
        balances = {personBalance, canteenBalance, governmentBalance};
        console.log(balances);
      });
      res.send({ balances: balances });
    } catch (e) {
      res.status('400').send(`Failed! ${e}`);
    }
  });

  app.get('/recharge', function(req, res){
    res.sendFile(path.join(__dirname + '/public/rechargeWallet.html'));
  });

  app.post('/recharge', function(req, res){
    try{
      const rechargeAmount = req.body.rechargeAmount.trim();
      contractInstance.methods.updatePersonWallet(rechargeAmount, { from: defaultAddress }, function(result) {
        const updatedBalance = contractInstance.methods.getPersonBalance.call({ from: defaultAddress }).toString();
        res.send({ personUpdatedBalance : updatedBalance});
      });
    } catch(e){
      res.status('400').send(`Failed! ${e}`);
    }
  });
}).catch(console.log);

