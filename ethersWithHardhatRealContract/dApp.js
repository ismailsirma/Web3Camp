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

    console.log("2.Account balance: ", (await deployer.getBalance()).toString());


    // Read the contract artifact, which was generated by Remix
    const metadataSafeBoxETH = JSON.parse(fs.readFileSync('artifacts/contracts/SafeBoxETH.sol/SafeBoxETH.json').toString())

    const price = ethers.utils.formatUnits(await provider.getGasPrice(), 'gwei')
    const gasPrice = ethers.utils.parseUnits(price, 'gwei')
    console.log('price'+gasPrice)
    const options = {address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', name: 'Ethereum', symbol: 'ETH'}

    //const block = await ethers.provider.getBlock()
    //console.log(block)
    
    // deposit
    const alice_deposit_amt = 2 * 10**8
    console.log(alice_deposit_amt)
    let prevAliceBalance = await deployer.getBalance()


    const metadataWETH = JSON.parse(fs.readFileSync('artifacts/interfaces/IWETH.sol/IWETH.json').toString())
    var weth = await new ethers.Contract(options.address,metadataWETH.abi,deployer)

    const metadataCErc20 = JSON.parse(fs.readFileSync('artifacts/interfaces/ICErc20.sol/ICErc20.json').toString())
    var cweth = await new ethers.Contract(weth.address,metadataCErc20.abi, deployer)


    console.log('3.deploying contract ....')
    const factory = await ethers.getContractFactory("SafeBoxETH")
    const SafeBoxETH = await new ethers.Contract(cweth.address, factory.interface, deployer)

    console.log('4.calling deposit....')
    SafeBoxETH.deposit({nonce: getNonce(), gasPrice: 875000000, gasLimit: 805000000})
    
    console.log('5.alice balance: ' + await deployer.getBalance())
    console.log('6.contact addresss: ' + SafeBoxETH.address)
    console.log('7.deposit amount of alice: ' + alice_deposit_amt)
    console.log('8.safebox eth balance of alice: ' + await weth.balanceOf(deployer.address, {nonce: getNonce(), gasPrice: 875000000, gasLimit: 805000000}))

    // withdraw
    const alice_withdraw_amt = 2 * 10**8
    console.log('9.previous balance of alice before withdrawal: ' + prevAliceBalance)
    SafeBoxETH.withdraw(alice_withdraw_amt, {'from': wallet.address, gasPrice: 875000000, gasLimit: 805000000})
    console.log('10.alice balance: ' + await deployer.getBalance())
    console.log('11.difference of alice deposit and withdraw amount: ' + (alice_deposit_amt - alice_withdraw_amt))
    
}

main()  
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
});