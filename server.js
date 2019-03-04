const express = require('express');
const contractInstance = require('./deployContract.js');
const web3 = require('./web3Client.js');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + 'public/index.html'));
});

app.post('/buy', function (req, res) {
  try {
    const itemName = req.body.itemName.trim();
    contractInstance.buyItem(itemName, { from: web3.eth.accounts[0] }, function(result) {
      const personBalance = contractInstance.getPersonBalance.call({ from: web3.eth.accounts[0] }).toString();
      const canteenBalance = contractInstance.getCanteenBalance.call({ from: web3.eth.accounts[0] }).toString();
      const governmentBalance = contractInstance.getGovernmentBalance.call({ from: web3.eth.accounts[0] }).toString();
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
        const personBalance = contractInstance.getPersonBalance.call({ from: web3.eth.accounts[0] }).toString();
        const canteenBalance = contractInstance.getCanteenBalance.call({ from: web3.eth.accounts[0] }).toString();
        const governmentBalance = contractInstance.getGovernmentBalance.call({ from: web3.eth.accounts[0] }).toString();
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
    const rechargeAmount = res.rechargeAmount;
    const updatedBalance = contractInstance.updatePersonWallet(rechargeAmount, { from: web3.eth.accounts[0] }).toString();
    res.send({updatedBalance : updatedBalance});
  } catch(e){
    res.status('400').send(`Failed! ${e}`)
  }
});

app.listen(3000, function () {
  console.log('App ready and listening on port 3000!')
});