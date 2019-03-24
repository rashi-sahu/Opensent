const fs = require('fs');
const web3 = require('./web3Client.js');
const code = fs.readFileSync('CanteenContract.sol').toString();
const solc = require('solc');
const compiledCode = solc.compile(code);
const abiDefinition = JSON.parse(compiledCode.contracts[':CanteenContract'].interface);
const CanteenContract = web3.eth.contract(abiDefinition);
const byteCode = compiledCode.contracts[':CanteenContract'].bytecode;
//const deployedCanteenContract = CanteenContract.new({ data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });
var contractClone;
const deploy = async (CanteeContract, byteCode) => {
  const gas = await CanteeContract.deploy({data: byteCode}).estimateGas();
  const response = await CanteenContract.deploy({data: byteCode}).send({
    from: '0xDCd592372C4DB3199671455B12768F407eFF8685',
    gas: gas + 1
  });

  console.log('Contract deployed to:', response.address);
  console.log('Contract deployed to:', response.options.address);

  return response;
};

deploy(CanteenContract, byteCode).then((contractClone) => {
  console.log('CLONED-CONTRACT: ', contractClone);
  module.exports = contractClone;
}).catch(console.log);

