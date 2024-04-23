import marketPlaceV1 from "./compiled_Marketplace.json" assert { type: "json" };
import marketPlaceV2 from "./compiled_Marketplace_V2.json" assert { type: "json" };
import TransparentProxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import NFT from "./compiled_NFT.json" assert { type: "json" };
import Proxy from "./compiled_TransparentUpgradeableProxy.json" assert { type: "json" };
import test from "./compiled_test.json" assert { type: "json" };
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
const test_address = "0x0D4215d46AFBCc4830c5cB5BB381aE97B07e41Af";
const contract_test = new ethers.Contract(
  test_address,
  test["contracts"]["Test.sol"]["Test"]["abi"],
  provider
);

// ------ ERC20 Contract ------
const erc20_address = "0x9854cB2099286B88cFB9B8A8E6807457c49b1dF5";
const contract_erc20 = new ethers.Contract(
  erc20_address,
  erc20["contracts"]["ERC20Sample.sol"]["ERC20Sample"]["abi"],
  provider
);

// NFT Contract
const NFT_address = "0x1090B435c89C6752DC971b2Fa7Be3cA0D2bD3fe6";
const contract_NFT = new ethers.Contract(
  NFT_address,
  NFT["contracts"]["NFT.sol"]["NFT"]["abi"],
  provider
);

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

console.log(await contract_NFT.ownerOf(12));

// // --------- send NFT to test smart contract ----------
// const tokenID = 12;
// const nftSendUnsigned = await contract_NFT.populateTransaction.transferFrom(
//   wallet.address,
//   contract_test.address,
//   tokenID
// );
// nftSendUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// nftSendUnsigned.gasLimit = 2100000;
// nftSendUnsigned.gasPrice = await provider.getGasPrice();
// nftSendUnsigned.nonce = await provider.getTransactionCount(wallet.address);
// const nftSendSigned = await wallet.signTransaction(nftSendUnsigned);
// const submittednftTx = await provider.sendTransaction(nftSendSigned);
// console.log(submittednftTx);

// // ------- Set Up ERC20 Currency in accept list --------
// const erc20_bytes32 =
//   "0x4552433230000000000000000000000000000000000000000000000000000000";
// const updateCurrencyUnsigned =
//   await contract_test.populateTransaction.setUpCurrency(
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

// // ------ Approve ------
// const approveERC20Unsigned = await contract_erc20.populateTransaction.approve(
//   contract_test.address,
//   ethers.utils.parseEther("10")
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

// // ------ Test Contract ------
// const payInvoiceUnsigned = await contract_test.populateTransaction.payInvoice(
//   ethers.utils.parseEther("10"),
//   "0x4552433230000000000000000000000000000000000000000000000000000000",
//   12,
//   contract_NFT.address,
//   "0x7268bEe5516b3159E2125De548eDfcA42f0C73CB",
//   "0x64A4BDd3A343fe97Af965db07e52F768Bc8a7932"
// );
// payInvoiceUnsigned.chainId = 1337; // chainId 1337 for Ganache UI
// payInvoiceUnsigned.gasLimit = 2100000;
// payInvoiceUnsigned.value = ethers.utils.parseEther("0");
// payInvoiceUnsigned.gasPrice = await provider.getGasPrice();
// payInvoiceUnsigned.nonce = await provider.getTransactionCount(wallet2.address);
// const payInvoiceSigned = await wallet2.signTransaction(payInvoiceUnsigned);
// const submittedBuyingTx = await provider.sendTransaction(payInvoiceSigned);
// console.log(submittedBuyingTx);

// console.log(
//   await contract_erc20.balanceOf("0x7268bEe5516b3159E2125De548eDfcA42f0C73CB")
// );

// console.log(
//   await contract_erc20.balanceOf("0x64A4BDd3A343fe97Af965db07e52F768Bc8a7932")
// );
