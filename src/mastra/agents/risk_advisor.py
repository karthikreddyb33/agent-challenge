from typing import Dict, Any

async def advise_risk(token_forensics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Consumes forensic features and returns risk_score, reason, and recommended next steps.
    """
    # Aggregate risk scores
    scores = [t.get("risk_score", 0) for t in token_forensics.values()]
    avg_score = sum(scores) / len(scores) if scores else 0
    # Risk rating
    if avg_score > 70:
        rating = "High"
        advice = "Consider withdrawing liquidity, monitor for rug pattern."
        reason = "Multiple tokens flagged as high risk."
    elif avg_score > 40:
        rating = "Medium"
        advice = "Monitor wallet and avoid new deposits."
        reason = "Some tokens show moderate risk features."
    else:
        rating = "Low"
        advice = "No urgent action needed."
        reason = "No major risk factors detected."
    return {
        "risk_score": int(avg_score),
        "risk_reason": reason,
        "recommended_next_steps": advice,
        "overall_risk": rating
    }
