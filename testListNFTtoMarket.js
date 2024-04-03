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

// MarketPlace V1 Test
const listingTxUnsigned =
  await contract_proxy.populateTransaction.listNftToMarket(
    NFT_address,
    1,
    ethers.utils.parseEther("100000"), // 100,000 VND
    "0x4649415400000000000000000000000000000000000000000000000000000000" // Fiat
  );
listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
listingTxUnsigned.gasLimit = 2100000;
listingTxUnsigned.value = ethers.utils.parseEther("0");
listingTxUnsigned.gasPrice = await provider.getGasPrice();
listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
console.log(submittedlistingTx);

// Check
const MarketNftItem = await contract_proxy._NftIDtoMarketNftItem(1);
console.log(MarketNftItem);