import marketPlaceV1 from "./compiled_Marketplace.json" assert { type: "json" };
import marketPlaceV2 from "./compiled_Marketplace_V2.json" assert { type: "json" };
import TransparentProxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import NFT from "./compiled_NFT.json" assert { type: "json" };
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

// NFT Contract
const NFT_address = "0x5beF2390889A393f7F58174ac9573cbe40A13b52";
const contract_NFT = new ethers.Contract(
  NFT_address,
  NFT["contracts"]["NFT.sol"]["NFT"]["abi"],
  provider
);

// Proxy MarketPlace
const proxy_address = "0x2A817AfeFcA226EF50fC85CFE5516BDd87714E2F";
const contract_proxy = new ethers.Contract(
  proxy_address,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy Admin Contract
const proxy_admin_address = "0xa50427Dfcf99b50CFDe390D7f151774b65bDD041";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

const marketPlaceV2_address = "0x2a2f1cdB13f8A7Eb9D90811778812BA75234C8aF";

// // Create NFT test
// const tokenURI = "https://fidec.io/underwear1";
// const nftTxUnsigned = await contract_NFT.populateTransaction.mintToken(
//   tokenURI
// );
// nftTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// nftTxUnsigned.gasLimit = 2100000;
// nftTxUnsigned.gasPrice = await provider.getGasPrice();
// nftTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const nftTxSigned = await wallet.signTransaction(nftTxUnsigned);
// const submittednftTx = await provider.sendTransaction(nftTxSigned);
// console.log(submittednftTx);

// // Set up Owner for MarketPlace at 1st
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

// // Set up Listing Fee via Proxy
// const setFeeTxUnsigned =
//   await contract_proxy.populateTransaction.setUpListingFee(
//     ethers.utils.parseEther("0.045")
//   );
// setFeeTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// setFeeTxUnsigned.gasLimit = 2100000;
// setFeeTxUnsigned.gasPrice = await provider.getGasPrice();
// setFeeTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const setFeeTxSigned = await wallet.signTransaction(setFeeTxUnsigned);
// await provider.sendTransaction(setFeeTxSigned);
// const listingFee = await contract_proxy.getListingFee();
// console.log(listingFee);

// // MarketPlace V1 Test
// const listingTxUnsigned =
//   await contract_proxy.populateTransaction.createMarketItem(
//     NFT_address,
//     1,
//     ethers.utils.parseEther("1.5")
//   );
// listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingTxUnsigned.gasLimit = 2100000;
// listingTxUnsigned.value = ethers.utils.parseEther("0.045");
// listingTxUnsigned.gasPrice = await provider.getGasPrice();
// listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
// const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
// console.log(submittedlistingTx);

// // Proxy Admin Set Up & upgradeToNewVersion
// // const proxySetUpTxUnsigned =
// //   await contract_proxy_admin.populateTransaction.setUpProxy(proxy_address);
// const proxySetUpTxUnsigned =
//   await contract_proxy_admin.populateTransaction.upgradeToNewVersion(marketPlaceV2_address);
// proxySetUpTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// proxySetUpTxUnsigned.gasLimit = 2100000;
// proxySetUpTxUnsigned.gasPrice = await provider.getGasPrice();
// proxySetUpTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const proxySetUpTxSigned = await wallet.signTransaction(proxySetUpTxUnsigned);
// const submittednftTx = await provider.sendTransaction(proxySetUpTxSigned);
// console.log(submittednftTx);

const contract_proxy_v2 = new ethers.Contract(
  proxy_address,
  marketPlaceV2["contracts"]["MarketplaceV2.sol"]["MarketplaceV2"]["abi"],
  provider
);

const testV2res = await contract_proxy_v2.testForFun();
console.log(testV2res);
