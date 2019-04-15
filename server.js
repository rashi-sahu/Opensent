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
const util = require('ethereumjs-util');
var sessions = require('express-session');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(sessions({
  secret: '*7(7987*@#&$%(*&#)(*$',
  resave: false,
  saveUninitialized: true
}));
app.set('view-engine', 'ejs');
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
    if (req.session.personLoggedIn==true){
      res.redirect('/person');
    }
    else if (req.session.canteenLoggedIn==true){
      res.redirect('/canteen');
    }
    else{
      res.render('../public/index.ejs');
    }
  });

  app.get('/person', function (req, res) {
    if (req.session.personLoggedIn==true) {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('../public/person/home.ejs', {address : req.session.address, 
                                                balance: req.session.balance,
                                                catalogueItemIds: req.session.itemIds,
                                                catalogueCanteenAddress: req.session.catalogueCanteenAddress,
                                                catalogueItemName: req.session.catalogueItemName,
                                                catalogueItemPrice: req.session.catalogueItemPrice
                                              });
    }
    else{
      res.redirect('/');
    }
  });

  app.get('/canteen', function (req, res) {
    if (req.session.canteenLoggedIn==true) {
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('../public/canteen/home.ejs', {address : req.session.address, 
                                                balance: req.session.balance, 
                                                customerAddress: req.session.pastOrdersCustomerAddress,
                                                itemNames: req.session.pastOrdersItemNames,
                                                itemPrices: req.session.pastOrdersItemPrices,
                                                status: req.session.pastOrdersStatus
                                              });
    }
    else{
      res.redirect('/');
    }
  });

  app.post('/person/login', function(req, res){
    console.log(req.body);
    const privateKey = req.body.privateKey.trim();
    const address = util.bufferToHex(util.privateToAddress('0x'+privateKey));
    contractInstance.methods.getPersonBalance(address).call({ from: address })
      .then(result => {
        req.session.privateKey = privateKey;
        req.session.address = address;
        req.session.personLoggedIn = true;
        req.session.canteenLoggedIn = false;
        req.session.balance = result;
        contractInstance.methods.getItems().call({ from: address }).then((result)=>{
          result = JSON.stringify(result);
          result = JSON.parse(result);
          for(var i=0; i<result["0"].length; i++){
            result["0"][i] = web3.utils.toUtf8(result["0"][i]);
          }
          req.session.itemIds = result[0];
          req.session.catalogueCanteenAddress = result["1"];
          for(var i=0; i<result["2"].length; i++){
            result["2"][i] = web3.utils.toUtf8(result["2"][i]);
          }
          req.session.catalogueItemName = result["2"];
          req.session.catalogueItemPrice = result["3"];
          res.redirect('/person');
        })
        .catch((err) => {
          console.log(err)
        })
      })
      .catch((err) => {
        console.log('Some error occured in Login' + err);
        res.redirect('/');
      })
  })

  app.post('/canteen/login', function(req, res){
    const privateKey = req.body.privateKey.trim();
    const address = util.bufferToHex(util.privateToAddress('0x'+privateKey));
    contractInstance.methods.getCanteenBalance(address).call({ from: address })
      .then(result => {
        req.session.privateKey = privateKey;
        req.session.address = address;
        req.session.canteenLoggedIn = true;
        req.session.personLoggedIn = false;
        req.session.balance = result;
        contractInstance.methods.getOrdersOfCanteen(address).call({ from: address }).then((result)=>{
          result = JSON.stringify(result);
          result = JSON.parse(result);
          req.session.pastOrdersCustomerAddress = result["1"];
          for(var i=0; i<result["2"].length; i++){
            result["2"][i] = web3.utils.toUtf8(result["2"][i]);        
          }
          req.session.pastOrdersItemNames = result["2"];
          req.session.pastOrdersItemPrices = result["3"];
          req.session.pastOrdersStatus = result["4"];
          res.redirect('/canteen');
        })
        .catch((err)=>{
          console.log(err);
        })
      })
      .catch((err) => {
        console.log('Some error occured in canteen login' + err);
        res.redirect('/');
      })
  })

  app.get('/person/logout', function(req, res){
    delete req.session.address;
    delete req.session.personLoggedIn;
    res.redirect('/');
  })

  app.get('/canteen/logout', function(req, res){
    delete req.session.address;
    delete req.session.canteenLoggedIn;
    res.redirect('/');
  })

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

  app.get('/person/recharge', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/person/rechargeWallet.html'));
  });

  app.post('/person/recharge', function (req, res) {
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

