
import os
import time
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

# 📍 Polygon Constants
CONTRACT_ADDR = "REDACTED_SECRET"
QUICKSWAP_ROUTER = "REDACTED_SECRET"
WETH_ADDR = "REDACTED_SECRET"
RPC_URL = "https://polygon.drpc.org"
CHAIN_ID = 137

# 💰 Liquidity Parameters (Adjust as needed)
MARZ_AMOUNT = 500_000 * 10**18  # 500k MARZ
POL_AMOUNT = 5 * 10**18         # 5 POL

# Minimal ABIs for QuickSwap V2 Router
APPROVE_ABI = [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
ADD_LIQ_ABI = [{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"}]

def add_quickswap_liquidity():
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        print("❌ Set PRIVATE_KEY in .env")
        return

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print("❌ RPC Connection failed")
        return

    account = Account.from_key(private_key)
    print(f"👤 Operator: {account.address}")
    print(f"💰 Seeding QuickSwap with {MARZ_AMOUNT/10**18:.0f} $MARZ + {POL_AMOUNT/10**18} POL")

    # 1. Approve Token
    token_contract = w3.eth.contract(address=CONTRACT_ADDR, abi=APPROVE_ABI)
    nonce = w3.eth.get_transaction_count(account.address)
    tx_approve = token_contract.functions.approve(QUICKSWAP_ROUTER, w3.to_wei(1, 'ether')).build_transaction({
        'from': account.address, 'nonce': nonce, 'gasPrice': w3.eth.gas_price, 'chainId': CHAIN_ID
    })
    print("🔓 Step 1: Approving $MARZ for QuickSwap...")
    signed_approve = account.sign_transaction(tx_approve)
    w3.eth.send_raw_transaction(signed_approve.raw_transaction)
    w3.eth.wait_for_transaction_receipt(w3.eth.get_transaction(signed_approve.hash))
    print("✅ Approval confirmed")
    time.sleep(2)

    # 2. Wrap POL → WETH
    wrap_tx = {
        'to': WETH_ADDR, 'from': account.address, 'value': POL_AMOUNT,
        'gas': 50000, 'gasPrice': w3.eth.gas_price, 'nonce': nonce + 1, 'chainId': CHAIN_ID, 'data': '0xd0e30db0'
    }
    print("🔄 Step 2: Wrapping POL → WETH...")
    signed_wrap = account.sign_transaction(wrap_tx)
    w3.eth.send_raw_transaction(signed_wrap.raw_transaction)
    w3.eth.wait_for_transaction_receipt(w3.eth.get_transaction(signed_wrap.hash))
    print("✅ WETH wrapped")
    time.sleep(2)

    # 3. Add Liquidity
    router_contract = w3.eth.contract(address=QUICKSWAP_ROUTER, abi=ADD_LIQ_ABI)
    deadline = int(time.time()) + 600  # 10 min expiry
    tx_liq = router_contract.functions.addLiquidityETH(
        CONTRACT_ADDR, MARZ_AMOUNT, MARZ_AMOUNT // 100, POL_AMOUNT // 100, # 1% slippage buffer
        account.address, deadline
    ).build_transaction({
        'from': account.address, 'nonce': nonce + 2, 'gasPrice': w3.eth.gas_price,
        'value': POL_AMOUNT, 'chainId': CHAIN_ID
    })
    print("🌊 Step 3: Adding Liquidity to QuickSwap...")
    signed_liq = account.sign_transaction(tx_liq)
    tx_hash = w3.eth.send_raw_transaction(signed_liq.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

    if receipt.status == 1:
        print("✅ LIQUIDITY INJECTED SUCCESSFULLY!")
        print(f"🔗 Tx Hash: {tx_hash.hex()}")
        print(f"📍 View Pair: https://quickswap.exchange/#/add/{CONTRACT_ADDR}/{WETH_ADDR}")
    else:
        print("❌ Liquidity transaction failed. Check gas/slippage.")

if __name__ == "__main__":
    add_quickswap_liquidity()
