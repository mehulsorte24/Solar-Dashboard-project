from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SensorReadingBase(BaseModel):
    device_id: str
    temperature: float
    humidity: float
    voltage: float
    current: float
    power: float
    energy: float
    rssi: Optional[float] = -26.0
    snr: Optional[float] = 9.75
    packet_loss: Optional[float] = 0.0

class SensorReadingCreate(SensorReadingBase):
    pass

class SensorReadingOut(SensorReadingBase):
    reading_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class DeviceBase(BaseModel):
    device_id: str
    device_name: str
    device_type: str
    location: str
    status: str = "ONLINE"
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    firmware_version: Optional[str] = None

class DeviceOut(DeviceBase):
    created_at: datetime
    last_seen: datetime

    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    alert_id: str
    device_id: str
    alert_type: str
    severity: str
    message: str
    value: Optional[float] = None
    threshold: Optional[float] = None
    created_at: datetime
    acknowledged: bool = False
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SystemHealthSchema(BaseModel):
    sensor_dht22: bool = True
    energy_meter: bool = True
    lora_tx: bool = True
    lora_rx: bool = True
    raspberry_pi: bool = True
    mqtt_broker: bool = True
    postgresql_db: bool = True
    plc: bool = True
    scada: bool = True

class DashboardSummaryOut(BaseModel):
    current_power: float
    today_energy: float
    voltage: float
    current: float
    temperature: float
    humidity: float
    comm_status: str
    comm_rssi: float
    comm_snr: float
    system_status: str
    last_updated: datetime
    active_alerts_count: int
    health: SystemHealthSchema

class AnalyticsSummaryOut(BaseModel):
    min_power: float
    max_power: float
    avg_power: float
    total_energy: float
    peak_power_timestamp: datetime
    avg_temp: float
    max_temp: float
    avg_voltage: float
    avg_current: float
    comm_success_rate: float
    sample_count: int
    has_sufficient_data: bool
    timeseries: List[SensorReadingOut]
