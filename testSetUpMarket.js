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
const NFT_address = "0x80218FCbef5ca5A03BC46407c19f9F9288396cBf";
const contract_NFT = new ethers.Contract(
  NFT_address,
  NFT["contracts"]["NFT.sol"]["NFT"]["abi"],
  provider
);

// Proxy MarketPlace
const proxy_address = "0x38A5c2bb204A96a284b77157Ace6C16c85A35b42";
const contract_proxy = new ethers.Contract(
  proxy_address,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy Admin Contract
const proxy_admin_address = "0x6Ad9C87e36C3d1C1364d1E359d720D0505e3e89a";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// Set up Owner for MarketPlace at 1st
const setOwnerTxUnsigned =
  await contract_proxy.populateTransaction.setUpInitialOwner();
setOwnerTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
setOwnerTxUnsigned.gasLimit = 2100000;
setOwnerTxUnsigned.gasPrice = await provider.getGasPrice();
setOwnerTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const setOwnerTxSigned = await wallet.signTransaction(setOwnerTxUnsigned);
await provider.sendTransaction(setOwnerTxSigned);
const ownerCheck = await contract_proxy._owner();
console.log(ownerCheck);