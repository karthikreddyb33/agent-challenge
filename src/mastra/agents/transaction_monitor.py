import asyncio
from typing import Dict, Any

async def analyze_transactions(activity_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes wallet activity timeline for suspicious patterns.
    Emits events if suspicious tx detected.
    """
    activity = activity_result.get("activity", [])
    suspicious = False
    summary = "No suspicious activity detected."
    for tx in activity:
        # Example: flag large outgoing transfer
        if tx.get("change", 0) < -100:  # Replace with real SOL threshold
            suspicious = True
            summary = f"Large outgoing transfer: {tx.get('change')} SOL in tx {tx.get('signature')}"
            # In production: emit event to alert channel
            break
    return {
        "suspicious": suspicious,
        "summary": summary,
        "checked_txs": len(activity)
    }
