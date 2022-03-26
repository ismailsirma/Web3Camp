const { ethers } = require("hardhat");
const fs = require('fs');


// Deploy the contract to Ethereum test network - Ropsten
const provider = ethers.providers.getDefaultProvider('ropsten')

// Use your wallet's private key to deploy the contract
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const wallet = new ethers.Wallet(privateKey, provider)

let baseNonce = ethers.provider.getTransactionCount(wallet.getAddress());
let nonceOffset = 0;

async function getNonce(){
    return baseNonce.then((nonce) => (nonce + (nonceOffset++)));
}

async function main(){

    const [deployer] = await ethers.getSigners();
    console.log("1.Deploying contracts with the account: ", deployer.address);

    let prevAliceBalance = await deployer.getBalance()
    console.log("2.Account balance: ", prevAliceBalance);

    const price = ethers.utils.formatUnits(await provider.getGasPrice(), 'gwei')
    const gasPrice = ethers.utils.parseUnits(price, 'gwei')
    console.log('gas price: '+gasPrice)
    const options = {address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', name: 'Ethereum', symbol: 'ETH'}

    //const block = await ethers.provider.getBlock()
    //console.log(block)
    
    // deposit
    const alice_deposit_amt = 2 * 10**8
    console.log('Deposit amount: ' + alice_deposit_amt)


    const metadataWETH = JSON.parse(fs.readFileSync('artifacts/interfaces/IWETH.sol/IWETH.json').toString())
    var weth = await new ethers.Contract(options.address,metadataWETH.abi,deployer)

    const metadataCErc20 = JSON.parse(fs.readFileSync('artifacts/interfaces/ICErc20.sol/ICErc20.json').toString())
    var cweth = await new ethers.Contract(weth.address,metadataCErc20.abi, deployer)


    console.log('3.deploying contract ....')
    const factory = await ethers.getContractFactory("SafeBox")
    const SafeBoxETH = await new ethers.Contract(cweth.address, factory.interface, deployer)

    console.log('4.calling deposit....')
    const nonceFirst = await getNonce()
    SafeBoxETH.deposit(alice_deposit_amt, {nonce: nonceFirst, gasPrice: 875000000, gasLimit: 805000000})
    
    console.log('5.alice balance: ' + await deployer.getBalance())
    console.log('6.contact addresss: ' + SafeBoxETH.address)
    console.log('7.deposit amount of alice: ' + alice_deposit_amt)
    //console.log('8.safebox eth balance of alice: ' + JSON.stringify(await weth.balanceOf(deployer.address, {nonce: getNonce(), gasPrice: 875000000, gasLimit: 805000000})))

    await new Promise(resolve => setTimeout(resolve, 1000))

    // withdraw
    const alice_withdraw_amt = 2 * 10**8
    console.log('9.previous balance of alice before withdrawal: ' + prevAliceBalance)
    const currentNonce = await getNonce()
    SafeBoxETH.withdraw(alice_withdraw_amt, {from: wallet.address, nonce: currentNonce, gasPrice: 875000000, gasLimit: 805000000})
    console.log('10.alice balance: ' + await deployer.getBalance())
    console.log('11.difference of alice deposit and withdraw amount: ' + (prevAliceBalance - await deployer.getBalance()))
    
}

main()  
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
});