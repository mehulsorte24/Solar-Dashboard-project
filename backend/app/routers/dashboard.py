from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import SensorReading, Alert
from app.schemas import DashboardSummaryOut, SystemHealthSchema

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardSummaryOut)
def get_dashboard_summary(db: Session = Depends(get_db)):
    latest = db.query(SensorReading).order_by(SensorReading.timestamp.desc()).first()
    
    active_alerts = db.query(Alert).filter(Alert.resolved_at.is_(None)).count()
    
    if not latest:
        return DashboardSummaryOut(
            current_power=966.0,
            today_energy=12.48,
            voltage=230.4,
            current=4.19,
            temperature=31.0,
            humidity=77.8,
            comm_status="EXCELLENT",
            comm_rssi=-26.0,
            comm_snr=9.75,
            system_status="RUNNING",
            last_updated=datetime.utcnow(),
            active_alerts_count=active_alerts,
            health=SystemHealthSchema()
        )

    return DashboardSummaryOut(
        current_power=latest.power or 0.0,
        today_energy=latest.energy or 0.0,
        voltage=latest.voltage or 0.0,
        current=latest.current or 0.0,
        temperature=latest.temperature or 0.0,
        humidity=latest.humidity or 0.0,
        comm_status="EXCELLENT" if (latest.rssi or -26) > -85 else "STABLE",
        comm_rssi=latest.rssi or -26.0,
        comm_snr=latest.snr or 9.75,
        system_status="RUNNING",
        last_updated=latest.timestamp,
        active_alerts_count=active_alerts,
        health=SystemHealthSchema()
    )
