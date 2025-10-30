import os
import aiohttp
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get environment variables
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL")
SOLSCAN_API_KEY = os.getenv("SOLSCAN_API_KEY")

async def test_solana_connection():
    if not SOLANA_RPC_URL:
        print("❌ SOLANA_RPC_URL not found in .env")
        return False
    
    try:
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getHealth"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(SOLANA_RPC_URL, json=payload) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    if 'result' in result and result['result'] == 'ok':
                        print("✅ Solana RPC connection successful!")
                        return True
                    else:
                        print(f"❌ Solana RPC error: {result.get('error', 'Unknown error')}")
                else:
                    print(f"❌ Solana RPC HTTP error: {resp.status}")
    except Exception as e:
        print(f"❌ Solana RPC connection failed: {str(e)}")
    return False

async def test_solscan_connection():
    if not SOLSCAN_API_KEY:
        print("❌ SOLSCAN_API_KEY not found in .env")
        return False
    
    try:
        headers = {
            "accept": "application/json",
            "token": SOLSCAN_API_KEY
        }
        
        # Test with a known Solana wallet (Solana Foundation)
        wallet_address = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"
        url = f"https://api.solscan.io/account/tokens?address={wallet_address}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, timeout=10) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    if 'data' in data:
                        print("✅ Solscan API connection successful!")
                        return True
                    else:
                        print(f"❌ Solscan API error: {data.get('message', 'Unknown error')}")
                else:
                    print(f"❌ Solscan API HTTP error: {resp.status}")
                    print(f"Response: {await resp.text()}")
    except Exception as e:
        print(f"❌ Solscan API connection failed: {str(e)}")
    return False

async def main():
    print("\n=== Testing Connections ===")
    print("1. Testing Solana RPC connection...")
    solana_ok = await test_solana_connection()
    
    print("\n2. Testing Solscan API connection...")
    solscan_ok = await test_solscan_connection()
    
    print("\n=== Test Results ===")
    print(f"Solana RPC: {'✅' if solana_ok else '❌'}")
    print(f"Solscan API: {'✅' if solscan_ok else '❌'}")
    
    if solana_ok and solscan_ok:
        print("\n✅ All connections successful! You can now run the application.")
    else:
        print("\n❌ Some tests failed. Please check the error messages above.")

if __name__ == "__main__":
    asyncio.run(main())
