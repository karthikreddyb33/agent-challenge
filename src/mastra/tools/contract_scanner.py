import os
import aiohttp
from typing import Any, Dict, List

SOLSCAN_API_URL = "https://api.solscan.io"

async def analyze_contract(token_address: str) -> Dict[str, Any]:
    """
    Gathers token holder distribution, mint authority, and suspicious flags from Solscan.
    Returns structured data for risk analysis.
    """
    headers = {"accept": "application/json"}
    url = f"{SOLSCAN_API_URL}/token/holders?tokenAddress={token_address}&offset=0&limit=10"
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, headers=headers, timeout=10) as resp:
                if resp.status == 200:
                    holders = await resp.json()
                    if isinstance(holders, list):
                        total = sum(h.get("amount", 0) for h in holders)
                        top_holder_pct = holders[0]["amount"] / total * 100 if total > 0 else 0
                    else:
                        top_holder_pct = 0
                else:
                    top_holder_pct = 0
        except Exception as e:
            top_holder_pct = 0
    # Mint authority and suspicious flags (mocked for now)
    # TODO: Replace with real Solscan/Metaplex queries
    mint_authority = "renounced" if token_address.endswith("A") else "active"
    suspicious_flags = []
    if top_holder_pct > 50:
        suspicious_flags.append("High holder concentration")
    if "pump" in token_address.lower() or "moon" in token_address.lower():
        suspicious_flags.append("Suspicious name")
    return {
        "top_holder_pct": top_holder_pct,
        "mint_authority": mint_authority,
        "suspicious_flags": suspicious_flags,
        "note": "Contract analysis partially mocked. Replace with full logic."
    }
