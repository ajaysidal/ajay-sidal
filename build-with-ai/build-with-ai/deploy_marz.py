#!/usr/bin/env python3
import os
from web3 import Web3
from eth_account import Account
import solcx
from dotenv import load_dotenv
from web3.exceptions import ContractLogicError

load_dotenv()

def get_working_rpc():
    urls = [
        "https://polygon.llamarpc.com",
        "https://polygon-rpc.publicnode.com",
        "https://polygon.drpc.org",
        "https://polygon.blockpi.network/v1/rpc/public"
    ]
    print("🌐 Testing Polygon RPCs...")
    for url in urls:
        try:
            w3 = Web3(Web3.HTTPProvider(url, request_kwargs={'timeout': 10}))
            if w3.is_connected():
                print(f"✅ Connected to: {url}")
                return w3
        except:
            continue
    raise ConnectionError("❌ No working RPC found.")

def deploy_marz():
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        raise ValueError("❌ Set PRIVATE_KEY in .env")

    w3 = get_working_rpc()
    account = Account.from_key(private_key)
    print(f"👤 Deploying from: {account.address}")

    print("🔨 Compiling MarzToken.sol...")
    solcx.install_solc("0.8.20")
    compiled = solcx.compile_files(
        "contracts/MarzToken.sol",
        solc_version="0.8.20",
        output_values=["abi", "bin"],
        import_remappings=["@openzeppelin=node_modules/@openzeppelin"]
    )
    cid = "contracts/MarzToken.sol:MarzToken"
    if cid not in compiled:
        raise Exception(f"❌ Compilation failed. Found: {list(compiled.keys())}")

    contract = w3.eth.contract(abi=compiled[cid]["abi"], bytecode=compiled[cid]["bin"])

    # Pre-calculate supply in Python to avoid Solidity constructor math issues
    initial_supply_wei = 1_000_000_000 * (10 ** 18)

    tx = contract.constructor(
        "MARZ NeoSphere Token",
        "MARZ",
        initial_supply_wei,
        account.address
    ).build_transaction({
        "chainId": 137,
        "gasPrice": int(w3.eth.gas_price * 1.1),
        "nonce": w3.eth.get_transaction_count(account.address),
        "from": account.address  # Explicitly required in web3.py v6+
    })

    signed_tx = account.sign_transaction(tx)
    print("📡 Broadcasting to Polygon...")
    try:
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        print(f"⏳ Waiting for confirmation... (Tx: {tx_hash.hex()})")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)

        if receipt.status == 1:
            print("✅ DEPLOYMENT SUCCESSFUL!")
            print(f"📍 Contract Address: {receipt.contractAddress}")
            print(f"🔗 Tx Hash: {tx_hash.hex()}")
            print(f"💸 Gas Used: {receipt.gasUsed}")
        else:
            print("❌ Transaction failed on-chain.")
    except ContractLogicError as e:
        print(f"💥 Contract Revert: {e}")
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    deploy_marz()
