import proxyAdmin from "./compiled_ProxyAdmin.json" assert { type: "json" };
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545"); // Ganache UI;

const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);
const wallet2 = new ethers.Wallet(
  "0x7bd26eba66d5f68098164d199e2b6806881fdb5dcf39d3ec4bee6694c3471dff",
  provider
);

// Proxy Admin Contract
const proxy_admin_address = "0x28ac0d45a070B5af3e7ff10B6D5B0f49642AB6e0";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// Proxy Admin Set Up
const proxySetUpTxUnsigned =
  await contract_proxy_admin.populateTransaction.setUpProxy(
    "0xC088790d077648892b2bE62Ddf661603c8D54A0c"
  );
proxySetUpTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
proxySetUpTxUnsigned.gasLimit = 2100000;
proxySetUpTxUnsigned.gasPrice = await provider.getGasPrice();
proxySetUpTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const proxySetUpTxSigned = await wallet.signTransaction(proxySetUpTxUnsigned);
const submittednftTx = await provider.sendTransaction(proxySetUpTxSigned);
console.log(submittednftTx);

console.log(await contract_proxy_admin.owner());

// // Update to MarketplaceV2
// const marketV2_address = "0x7fAe468e76639222c13CDf61B157E71C88995492";
// const upgradeTxUnsigned =
//   contract_proxy_admin.populateTransaction.setUpProxy(marketV2_address);
// upgradeTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// upgradeTxUnsigned.gasLimit = 2100000;
// upgradeTxUnsigned.gasPrice = await provider.getGasPrice();
// upgradeTxUnsigned.nonce = await provider.getTransactionCount(wallet2.address);
// const upgradeTxSigned = await wallet2.signTransaction(upgradeTxUnsigned);
// const tx = await provider.sendTransaction(upgradeTxSigned);
