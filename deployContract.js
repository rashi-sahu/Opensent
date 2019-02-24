const fs = require('fs');
const web3 = require('./web3Client.js');
const code = fs.readFileSync('CanteenContract.sol').toString();
const solc = require('solc');
const compiledCode = solc.compile(code);
const abiDefinition = JSON.parse(compiledCode.contracts[':CanteenContract'].interface);
const CanteenContract = web3.eth.contract(abiDefinition);
const byteCode = compiledCode.contracts[':CanteenContract'].byteCode;
const deployedCanteenContract = CanteenContract.new({ data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });

module.exports = deployedCanteenContract;
