from solcx import compile_standard, install_solc
import json
import os
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

install_solc("0.8.17")

NFT1155 = open("NFT1155.sol", "r").read()

# Compile solidity code
compiled_NFT1155_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"NFT1155.sol": {"content": NFT1155}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
                }
            }
        },
    },
    solc_version="0.8.17",
)

# JSON file
with open("compiled_NFT1155.json", "w") as file:
    json.dump(compiled_NFT1155_sol, file)

# get bytecode from the evm (can be found from the compiled_code.json)
bytecode = compiled_NFT1155_sol["contracts"]["NFT1155.sol"]["NFT1155"]["evm"][
    "bytecode"
]["object"]

# get abi (can be found from the compiled_code.json)
abi = compiled_NFT1155_sol["contracts"]["NFT1155.sol"]["NFT1155"]["abi"]

# For connecting to ganache
w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:7545"))
print(w3.is_connected())
chain_id = 1337
my_address = os.getenv("ADDRESS")
private_key = os.getenv("PRIVATE_KEY")

# Create the contract in Python, which is based on the abi and bytecode of Test.Sol file
nft_contract = w3.eth.contract(abi=abi, bytecode=bytecode)

# Get the number of the latest transaction that a particular address has made (here this nonce is different from the nonce of POW)
nonce = w3.eth.get_transaction_count(my_address)

# change stage of a blockchain need a transaction
# 1. Generate a transaction to deploys the contract on the blockchain
# 2. Sign the transaction
# 3. Send the signed transaction to the blockchain

# 1. Generate a transaction to deploys the contract on the blockchain

uri = "https://fidec.io/abcxyz"
marketPlace_proxy = ""  # remember this is proxy of market place, not market place

transaction = nft_contract.constructor(
    uri, "Test", "T1"
).build_transaction(
    {
        "chainId": chain_id,
        "gasPrice": w3.eth.gas_price,
        "from": my_address,
        "nonce": nonce,
    }
)

# 2. Sign the transaction
signed_transaction = w3.eth.account.sign_transaction(
    transaction, private_key=private_key
)

# 3. Send the signed transaction to blockchain to create a contract and check ganache
tx_hash = w3.eth.send_raw_transaction(signed_transaction.rawTransaction)

# Wait for the transaction to be mined, and get the transaction receipt (hashed of transaction ID)
print("Waiting for transaction to finish...")
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(f"Done! NFT1155 Contract deployed to {tx_receipt.contractAddress}")
