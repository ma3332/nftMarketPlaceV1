import marketPlaceV1 from "./compiled_Marketplace.json" assert { type: "json" };
import marketPlaceV2 from "./compiled_Marketplace_V2.json" assert { type: "json" };
import TransparentProxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import NFT from "./compiled_NFT.json" assert { type: "json" };
import Proxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import proxyAdmin from "./compiled_ProxyAdmin.json" assert { type: "json" };
import erc20 from "./compiled_ERC20Sample.json" assert { type: "json" };
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545"); // Ganache UI;

const privateKey_1 = process.env.PRIVATE_KEY;
const privateKey_2 = process.env.PRIVATE_KEY_2;

const wallet = new ethers.Wallet(privateKey_1, provider);
const wallet2 = new ethers.Wallet(privateKey_2, provider);

// Proxy Admin Contract
const proxy_admin_address = "0x8dCBddD8d68FF6B1da634141D64b2cA74146F34B";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// MarketPlace Contract
const address_market = "0xd7e82B23071F60b06026BCC7569d14Ed1C82c60D";
const contract_market = new ethers.Contract(
  address_market,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy MarketPlace
const proxy_address = "0x1c11bdEb542EA4990212d72fA5B6CE3b85963d4e";
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

// ERC20 Contract
const erc20_address = "0x9854cB2099286B88cFB9B8A8E6807457c49b1dF5";
const contract_erc20 = new ethers.Contract(
  erc20_address,
  erc20["contracts"]["ERC20Sample.sol"]["ERC20Sample"]["abi"],
  provider
);

const marketPlaceV2_address = "0x4a67edc5140ccE413695a3b5534ad56F96F8BE59";

// // --------- Create NFT test ----------
// const tokenURI = "https://fidec.io/underwear1";
// const nftTxUnsigned = await contract_NFT.populateTransaction.mintNftToken(
//   tokenURI
// );
// nftTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// nftTxUnsigned.gasLimit = 2100000;
// nftTxUnsigned.gasPrice = await provider.getGasPrice();
// nftTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const nftTxSigned = await wallet.signTransaction(nftTxUnsigned);
// const submittednftTx = await provider.sendTransaction(nftTxSigned);
// console.log(submittednftTx);

// console.log(await contract_NFT.ownerOf(28));

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

// // -------- Proxy Admin Set Up -------------
// const proxySetUpTxUnsigned =
//   await contract_proxy_admin.populateTransaction.setUpProxy(proxy_address);
// proxySetUpTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// proxySetUpTxUnsigned.gasLimit = 2100000;
// proxySetUpTxUnsigned.gasPrice = await provider.getGasPrice();
// proxySetUpTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const proxySetUpTxSigned = await wallet.signTransaction(proxySetUpTxUnsigned);
// provider.sendTransaction(proxySetUpTxSigned);

// // ---------- Set up Proxy for MarketPlace -----------
// const proxySetUpTxUnsigned =
//   await contract_proxy.populateTransaction.updateProxy(proxy_address);
// proxySetUpTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// proxySetUpTxUnsigned.gasLimit = 2100000;
// proxySetUpTxUnsigned.gasPrice = await provider.getGasPrice();
// proxySetUpTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const proxySetUpTxSigned = await wallet.signTransaction(proxySetUpTxUnsigned);
// provider.sendTransaction(proxySetUpTxSigned);

// // -------- Listing NFT with ETH in MarketPlace V1 ---------
// const listingTxUnsigned =
//   await contract_proxy.populateTransaction.listNftToMarket(
//     NFT_address,
//     18,
//     ethers.utils.parseEther("0.1"), // 0.1 ETH
//     "0x4554480000000000000000000000000000000000000000000000000000000000" // ETH
//   );
// listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingTxUnsigned.gasLimit = 2100000;
// listingTxUnsigned.value = ethers.utils.parseEther("0");
// listingTxUnsigned.gasPrice = await provider.getGasPrice();
// listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
// const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
// console.log(submittedlistingTx);

// // ---------- Check Listing ------------
// const MarketNftItem = await contract_proxy._NftIDtoMarketNftItem(1);
// console.log(MarketNftItem);

// // ----------- Cancel Listed NFT ----------
// const cancelNFTUnsigned = await contract_proxy.populateTransaction.cancelNftItem(
//   NFT_address,
//   3
// );
// cancelNFTUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// cancelNFTUnsigned.gasLimit = 2100000;
// cancelNFTUnsigned.value = ethers.utils.parseEther("0");
// cancelNFTUnsigned.gasPrice = await provider.getGasPrice();
// cancelNFTUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const cancelNFTSigned = await wallet.signTransaction(cancelNFTUnsigned);
// const submittedBuyingTx = await provider.sendTransaction(cancelNFTSigned);
// console.log(submittedBuyingTx);

// // ----------- Buy Listed NFT with ETH ----------
// const buyNFTUnsigned = await contract_proxy.populateTransaction.purchaseNftETH(
//   NFT_address,
//   1,
//   "0x4554480000000000000000000000000000000000000000000000000000000000"
// );
// buyNFTUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// buyNFTUnsigned.gasLimit = 2100000;
// buyNFTUnsigned.value = ethers.utils.parseEther("0.1"); // 0.1 ETH according to listing Price
// buyNFTUnsigned.gasPrice = await provider.getGasPrice();
// buyNFTUnsigned.nonce = await provider.getTransactionCount(wallet2.address);
// const buyNFTSigned = await wallet2.signTransaction(buyNFTUnsigned);
// const submittedBuyingTx = await provider.sendTransaction(buyNFTSigned);
// console.log(submittedBuyingTx);

// // ---------- check after buying NFT -----------
// console.log(await contract_NFT.ownerOf(4));
// console.log(await contract_NFT.ownerOf(5));
// console.log(await contract_NFT.ownerOf(6));
// console.log(await contract_NFT.ownerOf(7));

// // -------- Listing Batch NFT with ETH in MarketPlace V1 ---------
// const listToken = [5, 6, 7];
// const listPrice = [
//   ethers.utils.parseEther("0.1"),
//   ethers.utils.parseEther("0.2"),
//   ethers.utils.parseEther("0.3"),
// ];
// const listingBatchTxUnsigned =
//   await contract_proxy.populateTransaction.listBatchNftToMarket(
//     NFT_address,
//     listToken,
//     listPrice,
//     "0x4554480000000000000000000000000000000000000000000000000000000000" // ETH
//   );
// listingBatchTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingBatchTxUnsigned.gasLimit = 2100000;
// listingBatchTxUnsigned.value = ethers.utils.parseEther("0");
// listingBatchTxUnsigned.gasPrice = await provider.getGasPrice();
// listingBatchTxUnsigned.nonce = await provider.getTransactionCount(
//   wallet.address
// );
// const listingBatchTxSigned = await wallet.signTransaction(
//   listingBatchTxUnsigned
// );
// const submittedlistingTx = await provider.sendTransaction(listingBatchTxSigned);
// console.log(submittedlistingTx);

// // ------- Check Balance ERC20 -----------
// console.log(await contract_erc20.balanceOf(wallet2.address));

// // ------- Set Up ERC20 Currency in accept list --------
// const erc20_bytes32 =
//   "0x4552433230000000000000000000000000000000000000000000000000000000";
// const updateCurrencyUnsigned =
//   await contract_proxy.populateTransaction.setUpCurrency(
//     erc20_bytes32,
//     erc20_address
//   );
// updateCurrencyUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// updateCurrencyUnsigned.gasLimit = 2100000;
// updateCurrencyUnsigned.value = ethers.utils.parseEther("0"); // 0.1 ETH according to listing Price
// updateCurrencyUnsigned.gasPrice = await provider.getGasPrice();
// updateCurrencyUnsigned.nonce = await provider.getTransactionCount(
//   wallet.address
// );
// const updateCurrencySigned = await wallet.signTransaction(
//   updateCurrencyUnsigned
// );
// const submittedBuyingTx = await provider.sendTransaction(updateCurrencySigned);
// console.log(submittedBuyingTx);
// console.log(
//   await contract_proxy.currency(
//     "0x4552433230000000000000000000000000000000000000000000000000000000"
//   )
// );

// // -------- Listing NFT with ERC20 in MarketPlace V1 ---------
// const listingTxUnsigned =
//   await contract_proxy.populateTransaction.listNftToMarket(
//     NFT_address,
//     28,
//     ethers.utils.parseEther("100"), // 10 ERC20Sample
//     "0x4552433230000000000000000000000000000000000000000000000000000000" // ERC20
//   );
// listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingTxUnsigned.gasLimit = 2100000;
// listingTxUnsigned.value = ethers.utils.parseEther("0");
// listingTxUnsigned.gasPrice = await provider.getGasPrice();
// listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
// const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
// console.log(submittedlistingTx);
// console.log(await contract_proxy._NftIDtoMarketNftItem(1));

// // ----------- Buy Listed NFT with ERC20 ----------
// const approveERC20Unsigned = await contract_erc20.populateTransaction.approve(
//   contract_proxy.address,
//   ethers.utils.parseEther("100")
// );
// approveERC20Unsigned.chainId = 1337; // chainId 1337 for Ganache UI
// approveERC20Unsigned.gasLimit = 2100000;
// approveERC20Unsigned.value = ethers.utils.parseEther("0");
// approveERC20Unsigned.gasPrice = await provider.getGasPrice();
// approveERC20Unsigned.nonce = await provider.getTransactionCount(
//   wallet2.address
// );
// const approveERC20Signed = await wallet2.signTransaction(approveERC20Unsigned);
// provider.sendTransaction(approveERC20Signed);

// const buyNFTUnsigned = await contract_proxy.populateTransaction.purchaseNft(
//   NFT_address,
//   1,
//   "0x4552433230000000000000000000000000000000000000000000000000000000"
// );
// buyNFTUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// buyNFTUnsigned.gasLimit = 2100000;
// buyNFTUnsigned.value = ethers.utils.parseEther("0");
// buyNFTUnsigned.gasPrice = await provider.getGasPrice();
// buyNFTUnsigned.nonce = await provider.getTransactionCount(wallet2.address);
// const buyNFTSigned = await wallet2.signTransaction(buyNFTUnsigned);
// const submittedBuyingTx = await provider.sendTransaction(buyNFTSigned);
// console.log(submittedBuyingTx);


// // ------------ withdraw ERC20 to owner -------------
// const withdrawUnsigned = await contract_proxy.populateTransaction.withdrawERC20(
//   "0x4552433230000000000000000000000000000000000000000000000000000000"
// );
// withdrawUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// withdrawUnsigned.gasLimit = 2100000;
// withdrawUnsigned.value = ethers.utils.parseEther("0");
// withdrawUnsigned.gasPrice = await provider.getGasPrice();
// withdrawUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const withdrawSigned = await wallet.signTransaction(withdrawUnsigned);
// const submittedBuyingTx = await provider.sendTransaction(withdrawSigned);
// console.log(submittedBuyingTx);