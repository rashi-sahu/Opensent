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
const Tx = require('ethereumjs-tx');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var defaultAddress = '0xa45E358D48C6890f5e8D3C6AD4aBB6Ce8D730de4';

const deploy = async (CanteeContract, byteCode) => {
  const gas = await CanteeContract.deploy({ data: byteCode }).estimateGas();
  const response = await CanteenContract.deploy({ data: byteCode }).send({
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

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'public/index.html'));
  });

  app.post('/buy', function (req, res) {
    const itemName = req.body.itemName.trim();
    var privateKey = req.body.privateKey.trim();
    var encodedABI = contractInstance.methods.buyItem(web3.utils.asciiToHex(itemName)).encodeABI();
    web3.eth.getTransactionCount(defaultAddress)
      .then((result) => {
        var nonce = result;
        var tx = {
          nonce: nonce,
          from: defaultAddress,
          to: contractInstance.options.address,
          gas: 2000000,
          data: encodedABI,
        };
        privateKey = new Buffer(privateKey, 'hex');
        const transaction = new Tx(tx);
        transaction.sign(privateKey);
        const serializedTx = transaction.serialize();
        web3.eth.accounts.signTransaction(tx, privateKey)
          .then(signed => {
            var tran = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
            tran.on('transactionHash', hash => {
              res.send('Success');
            });
            tran.on('error', console.error);
          })
          .catch((e) => {
            console.log('reject' + e);
            res.status('400').send(`Failed! ${e}`);
          });
      });
  });

  app.get('/balances', function (req, res) {
    var stakeholders = ['Person', 'Canteen', 'Government'];
    try {
      stakeholders.map(function () {
        var personBalance = 5, canteenBalance = 10, governmentBalance = 15;
        contractInstance.methods.getPersonBalance().call({ from: defaultAddress })
          .then((result) => {
            personBalance = result;
            contractInstance.methods.getCanteenBalance().call({ from: defaultAddress })
              .then((result) => {
                canteenBalance = result;
                contractInstance.methods.getGovernmentBalance().call({ from: defaultAddress })
                  .then((result) => {
                    governmentBalance = result;
                  })
                  .then(() => {
                    let balances = { personBalance, canteenBalance, governmentBalance };
                    res.send({ balances: balances });
                  })
                  .catch(() => {
                    console.log('Failed to get balances...');
                  });
              });
          });
      });
    } catch (e) {
      res.status('400').send(`Failed! ${e}`);
    }
  });

  app.get('/recharge', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/rechargeWallet.html'));
  });

  app.post('/recharge', function (req, res) {
    try {
      const rechargeAmount = req.body.rechargeAmount.trim();
      contractInstance.methods.updatePersonWallet(rechargeAmount, { from: defaultAddress }, function (result) {
        const updatedBalance = contractInstance.methods.getPersonBalance.call({ from: defaultAddress }).toString();
        res.send({ personUpdatedBalance: updatedBalance });
      });
    } catch (e) {
      res.status('400').send(`Failed! ${e}`);
    }
  });
}).catch(console.log);

