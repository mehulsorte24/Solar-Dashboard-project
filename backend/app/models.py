from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Device(Base):
    __tablename__ = "devices"

    device_id = Column(String(50), primary_key=True, index=True)
    device_name = Column(String(100), nullable=False)
    device_type = Column(String(50), nullable=False)  # TRANSMITTER, RECEIVER, GATEWAY, PLC, SCADA, ENERGY_METER, DHT22
    location = Column(String(150))
    status = Column(String(20), default="ONLINE")      # ONLINE, OFFLINE, DEGRADED
    ip_address = Column(String(45), nullable=True)
    mac_address = Column(String(17), nullable=True)
    firmware_version = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    readings = relationship("SensorReading", back_populates="device", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="device", cascade="all, delete-orphan")
    comm_logs = relationship("CommunicationLog", back_populates="device", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    reading_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(50), ForeignKey("devices.device_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    voltage = Column(Float, nullable=True)
    current = Column(Float, nullable=True)
    power = Column(Float, nullable=True)
    energy = Column(Float, nullable=True)
    rssi = Column(Float, nullable=True)
    snr = Column(Float, nullable=True)
    packet_loss = Column(Float, nullable=True)

    device = relationship("Device", back_populates="readings")


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(String(50), primary_key=True, index=True)
    device_id = Column(String(50), ForeignKey("devices.device_id"), nullable=False, index=True)
    alert_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)  # INFO, WARNING, CRITICAL
    message = Column(Text, nullable=False)
    value = Column(Float, nullable=True)
    threshold = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    acknowledged = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)

    device = relationship("Device", back_populates="alerts")


class CommunicationLog(Base):
    __tablename__ = "communication_logs"

    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(50), ForeignKey("devices.device_id"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    rssi = Column(Float, nullable=True)
    snr = Column(Float, nullable=True)
    packet_sent = Column(Integer, default=0)
    packet_received = Column(Integer, default=0)
    packet_loss = Column(Float, default=0.0)

    device = relationship("Device", back_populates="comm_logs")
