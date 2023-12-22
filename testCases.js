import marketPlaceV1 from "./compiled_Marketplace.json" assert { type: "json" };
import marketPlaceV2 from "./compiled_Marketplace_V2.json" assert { type: "json" };
import NFT from "./compiled_NFT.json" assert { type: "json" };
import Proxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import proxyAdmin from "./compiled_ProxyAdmin.json" assert { type: "json" };
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"); // Ganache UI;

const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

// NFT Contract
const NFT_address = "0x28F8252753c0DC00fC853Bc6AA0Fd8B0B52eA8B3";
const contract_NFT = new ethers.Contract(
  NFT_address,
  NFT["contracts"]["NFT.sol"]["NFT"]["abi"],
  provider
);

// Proxy Contract
const proxy_address = "0xAf4FB3906068dF08451D12606e8753b556Ac1dc4";
const contract_proxy = new ethers.Contract(
  proxy_address,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy Admin Contract
const proxy_admin_address = "0xcBFBCeb4F70663C1b56ADE96d67C37cf3072C7dE";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// Create NFT test
const tokenURI = "https://fidec.io/underwear1";
const nftTxUnsigned = await contract_NFT.populateTransaction.mintToken(
  tokenURI
);
nftTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
nftTxUnsigned.gasLimit = 2100000;
nftTxUnsigned.gasPrice = await provider.getGasPrice();
nftTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const nftTxSigned = await wallet.signTransaction(nftTxUnsigned);
const submittednftTx = await provider.sendTransaction(nftTxSigned);

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

// Set up Listing Fee via Proxy
const setFeeTxUnsigned =
  await contract_proxy.populateTransaction.setUpListingFee(
    ethers.utils.parseEther("0.045")
  );
setFeeTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
setFeeTxUnsigned.gasLimit = 2100000;
setFeeTxUnsigned.gasPrice = await provider.getGasPrice();
setFeeTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const setFeeTxSigned = await wallet.signTransaction(setFeeTxUnsigned);
await provider.sendTransaction(setFeeTxSigned);
const listingFee = await contract_proxy.getListingFee();
console.log(listingFee);

// MarketPlace V1 Test
const listingTxUnsigned =
  await contract_proxy.populateTransaction.createMarketItem(
    NFT_address,
    1,
    ethers.utils.parseEther("1.5")
  );
listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
listingTxUnsigned.gasLimit = 2100000;
listingTxUnsigned.value = ethers.utils.parseEther("0.045");
listingTxUnsigned.gasPrice = await provider.getGasPrice();
listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
console.log(submittedlistingTx);

// Update to MarketplaceV2
const marketV2_address = "0x6252638e016FD829e761b7554dB65D570b0c6C18";
const upgradeTxUnsigned = contract_proxy_admin.populateTransaction.upgrade(
  contract_proxy.address,
  marketV2_address
);
upgradeTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
upgradeTxUnsigned.gasLimit = 2100000;
upgradeTxUnsigned.gasPrice = await provider.getGasPrice();
upgradeTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
const upgradeTxSigned = await wallet.signTransaction(upgradeTxUnsigned);
await provider.sendTransaction(upgradeTxSigned);

// Proxy Contract After Update V2
const contract_proxy_v2 = new ethers.Contract(
  proxy_address,
  marketPlaceV2["contracts"]["MarketplaceV2.sol"]["MarketplaceV2"]["abi"],
  provider
);

const testV2res = await contract_proxy_v2.testForFun();
console.log(testV2res);
