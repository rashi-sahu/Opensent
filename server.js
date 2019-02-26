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

app.listen(3000, function () {
  console.log('App ready and listening on port 3000!')
});