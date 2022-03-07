const Web3 = require('web3');

// Variables definition
const addressFrom = '0x716546D57B93791e2A1e9Ea82317BB53C5Ee253c';
const addressTo = '0x6BE34e10683044ab3e53E8383B2d52f1a8996408';
const web3 = new Web3('http://localhost:7545');

// Balance call
const balances = async () => {
   const balanceFrom = web3.utils.fromWei(
      await web3.eth.getBalance(addressFrom),
      'ether'
   );
   const balanceTo = await web3.utils.fromWei(
      await web3.eth.getBalance(addressTo),
      'ether'
   );

   console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH.`);
   console.log(`The balance of ${addressTo} is: ${balanceTo} ETH.`);
};

balances();