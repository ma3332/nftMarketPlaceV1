import marketPlaceV1 from "./compiled_Marketplace.json" assert { type: "json" };
import marketPlaceV2 from "./compiled_Marketplace_V2.json" assert { type: "json" };
import TransparentProxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import ERC1155 from "./compiled_NFT1155.json" assert { type: "json" };
import Proxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import proxyAdmin from "./compiled_ProxyAdmin.json" assert { type: "json" };
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import * as fs from "fs";
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
const proxy_admin_address = "0x8dCBddD8d68FF6B1da634141D64b2cA74146F34B";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// MarketPlace Contract
const address_market = "0x099401ca4937920E7BbAcF1037A67E879296984f";
const contract_market = new ethers.Contract(
  address_market,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy MarketPlace
const proxy_address = "0x77A78eC330B5604d82C352929656A84c5E50aBd9";
const contract_proxy = new ethers.Contract(
  proxy_address,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// 1155 Contract
const ERC1155_address = "0x0Be56947f7bD953425B88290F8e363d7a62cf55a";
const contract_ERC1155 = new ethers.Contract(
  ERC1155_address,
  ERC1155["contracts"]["NFT1155.sol"]["NFT1155"]["abi"],
  provider
);

// // ----- Create 1155 test -----
// const amtToken = 100;
// const data = "0x";
// const nftTxUnsigned = await contract_ERC1155.populateTransaction.mint1155Token(
//   amtToken,
//   data
// );
// nftTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// nftTxUnsigned.gasLimit = 2100000;
// nftTxUnsigned.gasPrice = await provider.getGasPrice();
// nftTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const nftTxSigned = await wallet.signTransaction(nftTxUnsigned);
// const submittednftTx = await provider.sendTransaction(nftTxSigned);
// console.log(submittednftTx);

// const testRes = await contract_ERC1155.viewCurrentTokenID();
// console.log(testRes);
// const balanceRes = await contract_ERC1155.balanceOf(process.env.ADDRESS, 1);
// console.log(balanceRes);

// // ------- Set up Owner for MarketPlace at 1st ---------
// const setOwnerTxUnsigned =
//   await contract_proxy.populateTransaction.setUpInitialOwner();
// setOwnerTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// setOwnerTxUnsigned.gasLimit = 2100000;
// setOwnerTxUnsigned.gasPrice = await provider.getGasPrice();
// setOwnerTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const setOwnerTxSigned = await wallet.signTransaction(setOwnerTxUnsigned);
// await provider.sendTransaction(setOwnerTxSigned);
// const ownerCheck = await contract_proxy._owner();
// console.log(ownerCheck);

// // ------- Set up Proxy for MarketPlace at 2nd ---------
// const setProxyTxUnsigned =
//   await contract_proxy.populateTransaction.updateProxy(proxy_address);
// setProxyTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// setProxyTxUnsigned.gasLimit = 2100000;
// setProxyTxUnsigned.gasPrice = await provider.getGasPrice();
// setProxyTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const setProxyTxSigned = await wallet.signTransaction(setProxyTxUnsigned);
// const submittedTx = await provider.sendTransaction(setProxyTxSigned);
// console.log(submittedTx);

// ------ MarketPlace V1 list 1155 test -------
const listingTxUnsigned =
  await contract_proxy.populateTransaction.list1155ToMarket(
    ERC1155_address,
    1,
    10,
    ethers.utils.parseEther("0.1"),
    "0x4554480000000000000000000000000000000000000000000000000000000000", // ETH
    "0x" // data
  );
listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
listingTxUnsigned.gasLimit = 2100000;
listingTxUnsigned.value = 0;
listingTxUnsigned.gasPrice = await provider.getGasPrice();
listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
console.log(submittedlistingTx);

// // ----------- MarketPlace V1 list batch 1155 test --------------
// const listTokenId = [2, 3];
// const listAmt = [10, 20];
// const listPriceEachItem = [
//   ethers.utils.parseEther("0.1"),
//   ethers.utils.parseEther("0.2"),
// ];
// const listingTxUnsigned =
//   await contract_proxy.populateTransaction.listBatch1155ToMarket(
//     ERC1155_address,
//     listTokenId,
//     listAmt,
//     listPriceEachItem,
//     "0x4554480000000000000000000000000000000000000000000000000000000000", // ETH
//     "0x" // data
//   );
// listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingTxUnsigned.gasLimit = 2100000;
// listingTxUnsigned.value = ethers.utils.parseEther("0");
// listingTxUnsigned.gasPrice = await provider.getGasPrice();
// listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
// const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
// console.log(submittedlistingTx);
