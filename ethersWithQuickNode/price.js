var ethers = require('ethers')
var url = 'HTTP://127.0.0.1:7545' // ADD_YOUR_ETHEREUM_NODE_URL QUICKNODE ETC
var provider = new ethers.providers.JsonRpcProvider(url)
var address  =  '0x5374d086585AC32009C8d7754a6D732d31a5ED39' // CONTRACT_ADDRESS_FROM_REMIX
var abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
var contract = new ethers.Contract(address,abi,provider)

// Getting the accounts
const signer0 = provider.getSigner(0);
const signer1 = provider.getSigner(1);

contract.getLatestPrice().then((result) =>{
  console.log("$" +result.toNumber()/100000000);
})