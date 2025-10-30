import asyncio
from typing import Dict, Any, List
from src.mastra.tools.contract_scanner import analyze_contract
from src.mastra.tools.liquidity_checker import get_liquidity, is_lp_locked

async def analyze_tokens(tokens: List[Dict[str, Any]], token_metas: Dict[str, Any]) -> Dict[str, Any]:
    """
    For each token, uses contract_scanner and liquidity_checker to compute risk features.
    Optionally calls LLM to interpret features.
    """
    results = {}
    for t in tokens:
        addr = t.get("tokenAddress") or t.get("token_address")
        if not addr:
            continue
        contract = await analyze_contract(addr)
        liquidity = await get_liquidity(addr)
        lp_lock = await is_lp_locked(addr)
        meta = token_metas.get(addr, {}).get("meta", {})
        # Compute risk features
        top_holder_pct = contract.get("top_holder_pct", 0)
        liquidity_usd = liquidity.get("liquidity_usd", 0)
        mint_authority = contract.get("mint_authority", "unknown")
        suspicious_flags = contract.get("suspicious_flags", [])
        token_name = meta.get("name", "")
        # Heuristic risk score
        risk = 0
        if top_holder_pct > 40: risk += 40
        if liquidity_usd < 1000: risk += 30
        if mint_authority == "renounced": risk += 10
        if not lp_lock.get("is_lp_locked", False): risk += 15
        if any(flag in suspicious_flags for flag in ["High holder concentration", "Suspicious name"]): risk += 20
        # Clamp risk
        risk = min(100, risk)
        results[addr] = {
            "symbol": meta.get("symbol", "?"),
            "risk_score": risk,
            "reason": ", ".join(suspicious_flags) or "No major flags.",
            "liquidity_usd": liquidity_usd,
            "top_holder_pct": top_holder_pct,
            "mint_authority": mint_authority,
            "is_lp_locked": lp_lock.get("is_lp_locked", False),
            "token_name": token_name,
            "solscan_link": f"https://solscan.io/token/{addr}",
        }
    return results
