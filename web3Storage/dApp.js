const Web3 = require('web3')

const getWeb3 = async () => {
    const url = 'http://127.0.0.1:7545'
    return new Web3(url)
}

const getContract = async (web3) => {
    const abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "sayHello",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "memory",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "calldata",
                    "type": "string"
                }
            ],
            "name": "updateGreeting",
            "outputs": [
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    const netId = await web3.eth.net.getId()
    console.log(netId)
    const deployedNetwork = '0x49438Acad80003db8cC9D7A6422b365345Dd710f'
    const greeting = new web3.eth.Contract(
      abi,
      deployedNetwork //&& deployedNetwork.address
    )
    return greeting;
}
  
const displayGreeting = async (greeting, contract) => {
    greeting = await contract.methods.sayHello().call()
    console.log(greeting)
}

const updateGreeting = async (greeting, contract, accounts) => {
    let input = 'hahahsd  hasdhashahda'
    const test = await contract.methods
        .updateGreeting(input)
        .send({ from: accounts[0], gas: 40000 })
      displayGreeting(greeting, contract)
    console.log(test)
}

async function greetingApp() {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const contract = await getContract(web3)
    let greeting
    displayGreeting(greeting, contract)
    updateGreeting(greeting, contract, accounts)
}

greetingApp()
  