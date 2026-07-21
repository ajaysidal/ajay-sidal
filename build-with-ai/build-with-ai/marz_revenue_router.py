
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

# 📍 Configuration
CONTRACT_ADDR = "REDACTED_SECRET"
RPC_URL = "https://polygon.drpc.org"
ABI = [
    {"inputs":[],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"treasuryAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
]

def marz_revenue_router():
    # 🔑 Setup Web3
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        print("❌ Set PRIVATE_KEY in your .env")
        return

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print("❌ RPC Connection failed")
        return

    account = Account.from_key(private_key)
    contract = w3.eth.contract(address=CONTRACT_ADDR, abi=ABI)

    # 📊 Read State
    treasury_addr = contract.functions.treasuryAddress().call()
    treasury_rewards = contract.functions.rewards(treasury_addr).call()
    current_balance = w3.eth.get_balance(treasury_addr)
    
    print(f"🏛️ Treasury Wallet: {treasury_addr}")
    print(f"💰 POL Balance: {current_balance / 10**18:.6f} POL")
    print(f"📈 Pending MARZ Rewards: {treasury_rewards / 10**18:.6f} MARZ")

    # 💸 Execute Claim
    if treasury_rewards > 0:
        print("\n🚀 Initiating AI-Driven Revenue Claim...")
        try:
            tx = contract.functions.claimReward().build_transaction({
                'from': account.address,
                'nonce': w3.eth.get_transaction_count(account.address),
                'gasPrice': w3.eth.gas_price,
            })
            
            signed_tx = account.sign_transaction(tx)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            
            print(f"⏳ Broadcasting Tx: {tx_hash.hex()}")
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            if receipt.status == 1:
                print("✅ REVENUE ROUTED SUCCESSFULLY!")
                print(f"💸 Rewards added to treasury balance. Tx: {tx_hash.hex()}")
            else:
                print("❌ Transaction failed on-chain.")
                
        except Exception as e:
            print(f"💥 Error during claim: {e}")
    else:
        print("\n⏳ No rewards ready to claim yet. Staking activity required.")

if __name__ == "__main__":
    marz_revenue_router()
