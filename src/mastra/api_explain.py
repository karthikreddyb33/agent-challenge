from fastapi import APIRouter, Request
from pydantic import BaseModel
from src.mastra.xai.explain_engine import make_trace

router = APIRouter()

class ExplainRequest(BaseModel):
    specialty: str
    results: dict

@router.post("/api/explain")
async def explain(request: Request):
    body = await request.json()
    specialty = body.get("specialty", "")
    results = body.get("results", {})
    trace = make_trace(specialty, results)
    return {"explanation": trace}
