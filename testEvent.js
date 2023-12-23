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

// NFT Contract
const NFT_address = "0x41B7B4dad70cE984c46E10aa6EF5c1f718D309EF";
const contract_NFT = new ethers.Contract(
  NFT_address,
  NFT["contracts"]["NFT.sol"]["NFT"]["abi"],
  provider
);

// Proxy MarketPlace
const proxy_address = "0x88899A4eb93820003687eE2B6eFba9142bBD0368";
const contract_proxy = new ethers.Contract(
  proxy_address,
  marketPlaceV1["contracts"]["Marketplace.sol"]["Marketplace"]["abi"],
  provider
);

// Proxy Admin Contract
const proxy_admin_address = "0x5a9f469cC34E173EFa7dCd12048E26013C73Fd38";
const contract_proxy_admin = new ethers.Contract(
  proxy_admin_address,
  proxyAdmin["contracts"]["ProxyAdmin.sol"]["ProxyAdmin"]["abi"],
  provider
);

// Proxy MarketPlace
const contract_TransparentProxy = new ethers.Contract(
  proxy_address,
  ["event Upgraded(address indexed implementation)"],
  provider
);

contract_TransparentProxy.on("Upgraded", (implementation) => {
  console.log(implementation);
});
