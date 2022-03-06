var ethers = require('ethers')
var url = 'ADD_YOUR_ETHEREUM_NODE_URL' // QUICKNODE ETC
var provider = new ethers.providers.JsonRpcProvider(url)
var address  =  '0xCB3D1659fB352D24629C1aAdffa0DEe37c78811e' // CONTRACT_ADDRESS_FROM_REMIX
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

contract.getLatestPrice().then((result) =>{
  console.log("$" +result.toNumber()/100000000);
})