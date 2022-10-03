var Moralis = require("moralis/node");
var Web3 = require("web3");
var abi = require('ethereumjs-abi');
const constant = require("../constant");
var web3Js = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
const wrapper = require('../helpers/wrapper');
// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number, used to prevent replay attacks.
// contractAddress is used to prevent cross-contract replay attacks.
async function signPayment(address, amount, nonce, contractAddress) {
    const recipient = await web3Js.utils.toChecksumAddress(address)
    var hash = "0x" + abi.soliditySHA3(
        ["address", "uint256", "uint256", "address"],
        [recipient, amount, nonce, contractAddress]
    ).toString("hex");
    const privateKey = process.env.PRIVATE_KEY_OWNER;
    const signature = await web3Js.eth.accounts.sign(hash, privateKey);
    return signature;
}
const claimPaymentHandler = async (event, context) => {
    try{
        console.log("event: " + JSON.stringify(event, null, 4));
        const marketplaceAddr = constant.contracts.MARKETPLACE_ADDRESS;
        const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
        const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
        await Moralis.start({serverUrl, appId});
        const body = JSON.parse(event.body);
        const address = body.address.toLowerCase();
        const profile = Moralis.Object.extend("profile");
        const query = new Moralis.Query(profile);
        query.equalTo("address", address);
        const result = await query.first();
        if (result) {
            console.log(`Address ${address} is exist`);
            const rewards = result.attributes?.rewards
            if(rewards){
                console.log(`Rewards: ${rewards}`);
                const nonce = await web3Js.eth.getTransactionCount(marketplaceAddr);
                const signatureObj = await signPayment(address, rewards, nonce,  marketplaceAddr);
                return signatureObj;
            }
            else{
                throw new Error("No rewards found");
            }
        }else{
            throw new Error("No profile found");
        }
    }
    catch(error){
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}
exports.handler = async function(event, context) {
    try {
        const result = await claimPaymentHandler(event, context);
        return wrapper(200, result);
    } catch (error) {
        console.log(error);
        return wrapper(500, {error: error.message});
    }
}