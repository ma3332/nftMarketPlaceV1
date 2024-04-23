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

// Proxy Admin Contract
const proxy_admin_address = "0x8dCBddD8d68FF6B1da634141D64b2cA74146F34B";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// MarketPlace Contract
const address_market = "0xE8303C3C80ABB33414Dd843A9a3531ecB23C6318";
const contract_market = new ethers.Contract(
  address_market,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy MarketPlace
const proxy_address = "0xf5B99eDBE9F7382770D659454E1aac12F303e8E3";
const contract_proxy = new ethers.Contract(
  proxy_address,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// NFT Contract
const NFT_address = "0x1090B435c89C6752DC971b2Fa7Be3cA0D2bD3fe6";
const contract_NFT = new ethers.Contract(
  NFT_address,
  NFT["contracts"]["NFT.sol"]["NFT"]["abi"],
  provider
);

const marketPlaceV2_address = "0x4a67edc5140ccE413695a3b5534ad56F96F8BE59";

// Create NFT test
const tokenURI = "https://fidec.io/underwear1";
const nftTxUnsigned = await contract_NFT.populateTransaction.mintNftToken(
  tokenURI
);
nftTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
nftTxUnsigned.gasLimit = 2100000;
nftTxUnsigned.gasPrice = await provider.getGasPrice();
nftTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const nftTxSigned = await wallet.signTransaction(nftTxUnsigned);
const submittednftTx = await provider.sendTransaction(nftTxSigned);
console.log(submittednftTx);

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

