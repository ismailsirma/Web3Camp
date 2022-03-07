const Web3 = require('web3');

// Variables definition
const privKey =
 '5e2c3799a812df9168526bfed7c5374715a64ac161de2b82b1123e38f1eb2f44'; // Receiver (from) addresses private key
const addressFrom = '0x716546D57B93791e2A1e9Ea82317BB53C5Ee253c';
const addressTo = '0x6BE34e10683044ab3e53E8383B2d52f1a8996408';
const web3 = new Web3('http://localhost:7545');

// Create transaction
const deploy = async () => {
    console.log(
       `Attempting to make transaction from ${addressFrom} to ${addressTo}`
    );
 
    const createTransaction = await web3.eth.accounts.signTransaction(
       {
          from: addressFrom,
          to: addressTo,
          value: web3.utils.toWei('100', 'ether'),
          gas: '21000',
       },
       privKey
    );

// Deploy transaction
const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
 );
 console.log(
    `Transaction successful with hash: ${createReceipt.transactionHash}`
 );
};

deploy();