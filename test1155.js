import marketPlaceV1 from "./compiled_Marketplace.json" assert { type: "json" };
import marketPlaceV2 from "./compiled_Marketplace_V2.json" assert { type: "json" };
import TransparentProxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import ERC1155 from "./compiled_NFT1155.json" assert { type: "json" };
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

// 1155 Contract
const ERC1155_address = "0x0Be56947f7bD953425B88290F8e363d7a62cf55a";
const contract_ERC1155 = new ethers.Contract(
  ERC1155_address,
  ERC1155["contracts"]["NFT1155.sol"]["NFT1155"]["abi"],
  provider
);

// ERC20 Contract
const erc20_address = "0x9854cB2099286B88cFB9B8A8E6807457c49b1dF5";
const contract_erc20 = new ethers.Contract(
  erc20_address,
  erc20["contracts"]["ERC20Sample.sol"]["ERC20Sample"]["abi"],
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

// // ------ MarketPlace V1 list 1155 with ETH -------
// const listingTxUnsigned =
//   await contract_proxy.populateTransaction.list1155ToMarket(
//     ERC1155_address,
//     1,
//     10,
//     ethers.utils.parseEther("0.1"),
//     "0x4554480000000000000000000000000000000000000000000000000000000000", // ETH
//     "0x" // data
//   );
// listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingTxUnsigned.gasLimit = 2100000;
// listingTxUnsigned.value = 0;
// listingTxUnsigned.gasPrice = await provider.getGasPrice();
// listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
// const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
// console.log(submittedlistingTx);

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


// // ------ MarketPlace V1 list 1155 with ERC20 -------
// const listingTxUnsigned =
//   await contract_proxy.populateTransaction.list1155ToMarket(
//     ERC1155_address,
//     7,
//     100,
//     ethers.utils.parseEther("100"),
//     "0x4552433230000000000000000000000000000000000000000000000000000000", // ERC20
//     "0x" // data
//   );
// listingTxUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// listingTxUnsigned.gasLimit = 2100000;
// listingTxUnsigned.value = 0;
// listingTxUnsigned.gasPrice = await provider.getGasPrice();
// listingTxUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const listingTxSigned = await wallet.signTransaction(listingTxUnsigned);
// const submittedlistingTx = await provider.sendTransaction(listingTxSigned);
// console.log(submittedlistingTx);

// console.log(await contract_proxy._1155IDtoMarketNftItem(3))

// // ------ MarketPlace V1 buy 1155 with ERC20 -------
// const approveERC20Unsigned = await contract_erc20.populateTransaction.approve(
//   contract_proxy.address,
//   ethers.utils.parseEther("1000")
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

const buy1155Unsigned =
  await contract_proxy.populateTransaction.purchase1155(
    ERC1155_address,
    3,
    10,
    "0x4552433230000000000000000000000000000000000000000000000000000000", // ERC20
    "0x" // data
  );
buy1155Unsigned.chainId = 1337; // chainId 1337 for Ganache UI
buy1155Unsigned.gasLimit = 2100000;
buy1155Unsigned.value = 0;
buy1155Unsigned.gasPrice = await provider.getGasPrice();
buy1155Unsigned.nonce = await provider.getTransactionCount(wallet2.address);
const buy1155Signed = await wallet2.signTransaction(buy1155Unsigned);
const submittedlistingTx = await provider.sendTransaction(buy1155Signed);
console.log(submittedlistingTx);