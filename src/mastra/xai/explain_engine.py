from typing import Dict

def generate_confidence(analysis_text: str) -> float:
    """
    Simple heuristic for confidence based on length and certainty words.
    """
    if any(w in analysis_text.lower() for w in ["likely", "probable", "almost certainly"]):
        return 0.9
    if any(w in analysis_text.lower() for w in ["maybe", "possibly", "unclear"]):
        return 0.5
    if len(analysis_text) > 200:
        return 0.7
    return 0.8

def make_trace(specialty: str, results: Dict) -> str:
    """
    Returns 2–3 supporting sentences for 'Explain' view.
    """
    if specialty == "transaction_monitor":
        if results.get("suspicious"):
            return "Unusual transaction volume detected. Large transfer flagged."
        return "No suspicious transaction patterns found in recent history."
    if specialty == "token_forensics":
        if results.get("risk_score", 0) > 70:
            return "Token shows high risk: high holder concentration, low liquidity, and/or suspicious metadata."
        return "Token passes most safety checks."
    if specialty == "risk_advisor":
        return f"Overall risk score: {results.get('risk_score', '?')}. {results.get('risk_reason', '')}"
    return "No additional trace available."
