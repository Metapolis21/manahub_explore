const { ethers } = require("ethers");
// 2. Define network configurations
const providerRPC = {
    bsc: {
        name: "bsc",
        rpc: "https://bsc-dataseed1.binance.org/",
        chainId: 56,
    },
}
// 3. Create ethers provider
const provider = new ethers.providers.StaticJsonRpcProvider(
    providerRPC.bsc.rpc,
    {
        chainId: providerRPC.bsc.chainId,
        name: providerRPC.bsc.name,
    }
)
module.exports = provider;