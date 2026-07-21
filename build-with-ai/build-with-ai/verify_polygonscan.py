
import os
import requests
import time
from eth_abi import encode as eth_encode

def verify():
    api_key = '49345BB1V8P2594QGHZCYBTQA7CDNXS4AWCAN'
    addr = 'REDACTED_SECRET'
    url = 'https://api.etherscan.io/v2/api'

    # 1. Read Source Code
    with open('contracts/MarzToken.sol', 'r') as f:
        source_code = f.read()

    # 2. Encode Constructor Arguments
    # (Name, Symbol, Supply, Treasury)
    args = ['MARZ NeoSphere Token', 'MARZ', 1_000_000_000 * 10**18, 'REDACTED_SECRET']
    enc = eth_encode(['string', 'string', 'uint256', 'address'], args).hex()[2:]

    # 3. Construct V2 Payload
    # Note: V2 requires 'chainid' as an integer (137), not a string
    payload = {
        'chainid': 137,
        'module': 'contract',
        'action': 'verifysourcecode',
        'apikey': api_key,
        'contractaddress': addr,
        'sourceCode': source_code,
        'contractname': 'MarzToken',
        'compilerversion': 'v0.8.20+commit.a1b79de6',
        'optimizationUsed': 1,
        'runs': 200,
        'constructorArguments': enc
    }

    print('Submitting to Etherscan V2 API...')
    try:
        r = requests.post(url, data=payload).json()
        
        if 'result' in r and r['result'].startswith('GUID'):
            guid = r['result']
            print(f'Submission Started (GUID: {guid})')
            print('Waiting for Polygonscan to process...')
            time.sleep(15) # Initial buffer
            
            while True:
                status_req = requests.post(url, data={
                    'chainid': 137,
                    'module': 'contract',
                    'action': 'checkverifystatus',
                    'apikey': api_key,
                    'guid': guid
                }).json()
                
                result = status_req.get('result', '')
                if 'Pass' in result:
                    print('VERIFICATION SUCCESSFUL!')
                    print(f'View Contract: https://polygonscan.com/address/{addr}')
                    break
                elif 'Pending' in result:
                    time.sleep(5)
                else:
                    print(f'Verification Failed: {result}')
                    break
        else:
            print(f'API Error: {r}')
            
    except Exception as e:
        print(f'Network Error: {e}')

if __name__ == "__main__":
    verify()
