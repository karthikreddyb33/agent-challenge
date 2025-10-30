import sys
import os
import asyncio

# Add the src directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(current_dir, 'src')
if src_dir not in sys.path:
    sys.path.append(src_dir)

async def test():
    try:
        from mastra.agents.coordinator_agent import coordinator_agent
        from mastra.tools.solana_data_fetcher import get_wallet_tokens, get_wallet_activity, get_token_metadata
        print("All imports successful!")
        
        # Test get_wallet_tokens
        print("\nTesting get_wallet_tokens...")
        tokens = await get_wallet_tokens("Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE")
        print(f"Found {len(tokens.get('tokens', []))} tokens")
        
        # Test coordinator_agent
        print("\nTesting coordinator_agent...")
        result = await coordinator_agent("Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE")
        print("coordinator_agent result:", result)
        
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}\n")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
