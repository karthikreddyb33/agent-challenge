from fastapi import APIRouter
from src.mastra.tools.solana_data_fetcher import get_wallet_activity

router = APIRouter()

@router.get("/api/wallet_activity/{wallet}")
async def wallet_activity(wallet: str):
    result = await get_wallet_activity(wallet)
    return result
