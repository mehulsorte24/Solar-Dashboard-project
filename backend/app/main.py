from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

from app.config import settings
from app.database import Base, engine
from app.seed_data import seed_database
from app.websocket_manager import manager
from app.mqtt_client import start_mqtt_client

from app.routers import dashboard, readings, devices, alerts, analytics, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print("[INIT] Creating database tables & seeding initial IIoT telemetry...")
    seed_database()
    
    print("[INIT] Starting MQTT Subscriber client...")
    start_mqtt_client()

    yield
    print("[SHUTDOWN] Backend shutting down cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend & Real-Time WebSocket/MQTT Engine for IIoT Solar Energy Monitoring System (PLC & SCADA integrated)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard.router)
app.include_router(readings.router)
app.include_router(devices.router)
app.include_router(alerts.router)
app.include_router(analytics.router)
app.include_router(reports.router)

# Live WebSocket endpoint
@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep-alive listener loop
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)

@app.get("/")
def root_info():
    return {
        "system": settings.PROJECT_NAME,
        "status": "ONLINE",
        "docs_url": "/docs",
        "websocket_url": "/ws/live",
        "mqtt_topic": "solar/+/telemetry"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
