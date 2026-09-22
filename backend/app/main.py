import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router, engine
from app.websocket.connection_manager import manager

app = FastAPI(
    title="BharatNav Autonomous Vehicle Decision Support & Path Planning Engine",
    description="SIH 26037 - Adaptive Path Planning & Collision Avoidance for Unstructured Indian Roads",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Step simulation if running
            if engine.is_running:
                state = engine.step()
                await websocket.send_json({"type": "SIMULATION_STEP", "data": state})
            else:
                await websocket.send_json({"type": "SIMULATION_STATE", "data": engine.get_state()})
            await asyncio.sleep(0.05)  # 20 Hz tick
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@app.get("/")
def read_root():
    return {
        "app": "BharatNav Autonomous Vehicle Platform",
        "status": "ONLINE",
        "sih_problem_statement": "26037",
        "organization": "MathWorks"
    }
