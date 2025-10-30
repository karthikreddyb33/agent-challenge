from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

active_connections: List[WebSocket] = []

@router.websocket("/api/subscribe_alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or handle ping/pong if needed
    except WebSocketDisconnect:
        active_connections.remove(websocket)

# Utility to broadcast alert to all clients
async def broadcast_alert(alert: dict):
    for ws in active_connections:
        try:
            await ws.send_json(alert)
        except Exception:
            pass
