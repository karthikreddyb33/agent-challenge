from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import asyncio
import os
import sys
import json
import traceback

# Add the src directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.dirname(current_dir)
if src_dir not in sys.path:
    sys.path.append(src_dir)

# Import local modules using absolute imports
from mastra.agents.coordinator_agent import coordinator_agent
from mastra.api_wallet_activity import router as wallet_activity_router
from mastra.api_explain import router as explain_router
from mastra.ws_alerts import router as ws_alerts_router

app = FastAPI()

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeWalletRequest(BaseModel):
    wallet: str

@app.get("/")
async def root():
    return {"message": "Nosana API is running", "docs": "/docs"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Service is running"}

@app.post("/api/analyze_wallet")
async def analyze_wallet(request: Request):
    try:
        # Parse the request body manually to avoid Pydantic validation issues
        body = await request.json()
        wallet = body.get('wallet')
        
        if not wallet:
            raise HTTPException(
                status_code=400,
                detail={"error": "Wallet address is required", "details": "No wallet address provided in the request body"}
            )
            
        print(f"[DEBUG] Received request to analyze wallet: {wallet}")
        result = await coordinator_agent(wallet)
        return result
    except json.JSONDecodeError as je:
        print(f"[ERROR] Invalid JSON in request: {str(je)}")
        raise HTTPException(
            status_code=400,
            detail={"error": "Invalid request", "details": "Request body must be valid JSON"}
        )
    except HTTPException as he:
        # Re-raise HTTP exceptions as-is
        raise he
    except Exception as e:
        import traceback
        error_msg = f"Error analyzing wallet: {str(e)}\n{traceback.format_exc()}"
        print(f"[ERROR] {error_msg}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to analyze wallet",
                "details": str(e),
                "type": type(e).__name__
            }
        )

app.include_router(wallet_activity_router)
app.include_router(explain_router)
app.include_router(ws_alerts_router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
