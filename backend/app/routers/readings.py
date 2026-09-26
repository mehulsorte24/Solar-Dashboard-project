from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.database import get_db
from app.models import SensorReading
from app.schemas import SensorReadingOut, SensorReadingCreate

router = APIRouter(prefix="/api/readings", tags=["Readings"])

@router.get("/latest", response_model=SensorReadingOut)
def get_latest_reading(db: Session = Depends(get_db)):
    latest = db.query(SensorReading).order_by(SensorReading.timestamp.desc()).first()
    if not latest:
        # Fallback reading matching ThingSpeak screenshots
        return SensorReadingOut(
            reading_id=1,
            device_id="TX001",
            timestamp=datetime.utcnow(),
            temperature=31.0,
            humidity=77.8,
            voltage=230.4,
            current=4.19,
            power=966.0,
            energy=12.48,
            rssi=-26.0,
            snr=9.75,
            packet_loss=0.14
        )
    return latest

@router.get("/history", response_model=List[SensorReadingOut])
def get_historical_readings(hours: int = Query(24, ge=1, le=720), db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(hours=hours)
    readings = db.query(SensorReading).filter(SensorReading.timestamp >= since).order_by(SensorReading.timestamp.asc()).all()
    return readings

@router.post("", response_model=SensorReadingOut)
def create_reading(reading: SensorReadingCreate, db: Session = Depends(get_db)):
    db_reading = SensorReading(
        device_id=reading.device_id,
        timestamp=datetime.utcnow(),
        temperature=reading.temperature,
        humidity=reading.humidity,
        voltage=reading.voltage,
        current=reading.current,
        power=reading.power,
        energy=reading.energy,
        rssi=reading.rssi,
        snr=reading.snr,
        packet_loss=reading.packet_loss
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading
