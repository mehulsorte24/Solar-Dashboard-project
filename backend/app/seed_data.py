import math
from datetime import datetime, timedelta
from app.database import SessionLocal, Base, engine
from app.models import Device, SensorReading, Alert, CommunicationLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed Devices
    existing_devices = db.query(Device).count()
    if existing_devices == 0:
        devices = [
            Device(
                device_id="TX001",
                device_name="Solar Node ESP32-S3 (TX)",
                device_type="TRANSMITTER",
                location="Rooftop Solar Array - Substation A",
                status="ONLINE",
                ip_address="192.168.1.105",
                mac_address="48:E7:29:A2:14:8B",
                firmware_version="v2.4.1-lora"
            ),
            Device(
                device_id="RX001",
                device_name="LoRa Gateway ESP32-S3 (RX)",
                device_type="RECEIVER",
                location="Control Room Gateway Stand",
                status="ONLINE",
                ip_address="192.168.1.106",
                mac_address="48:E7:29:B5:99:3C",
                firmware_version="v2.4.1-lora"
            ),
            Device(
                device_id="RPI01",
                device_name="Raspberry Pi 4 Gateway",
                device_type="GATEWAY",
                location="Main SCADA Cabinet",
                status="ONLINE",
                ip_address="192.168.1.100",
                mac_address="DC:A6:32:88:F1:02",
                firmware_version="Debian 12 (Bookworm)"
            ),
            Device(
                device_id="PLC01",
                device_name="Siemens S7-1200 Industrial PLC",
                device_type="PLC",
                location="Industrial Automation Rack 01",
                status="ONLINE",
                ip_address="192.168.1.200",
                firmware_version="v4.5.2"
            ),
            Device(
                device_id="SCADA01",
                device_name="WinCC / SCADA Master Station",
                device_type="SCADA",
                location="Central Control Station",
                status="ONLINE",
                ip_address="192.168.1.250",
                firmware_version="WinCC RT v7.5"
            ),
            Device(
                device_id="EM001",
                device_name="RS485 Modbus Energy Meter",
                device_type="ENERGY_METER",
                location="AC Inverter Junction Box",
                status="ONLINE"
            ),
            Device(
                device_id="DHT001",
                device_name="DHT22 Temp & Humidity Sensor",
                device_type="DHT22",
                location="Solar Panel Array Weather Shelter",
                status="ONLINE"
            )
        ]
        db.add_all(devices)
        db.commit()
        print("[SEED] Devices seeded successfully.")

    # Seed Sensor Readings (24 hours of 5-minute telemetry)
    existing_readings = db.query(SensorReading).count()
    if existing_readings == 0:
        now = datetime.utcnow()
        readings = []
        total_points = 288 # 24 hours * 12 points/hour

        for i in range(total_points, -1, -1):
            time = now - timedelta(minutes=i * 5)
            hour = time.hour + time.minute / 60.0

            solar_factor = 0.0
            if 6.0 <= hour <= 18.0:
                solar_factor = math.sin(((hour - 6.0) / 12.0) * math.pi)

            voltage = round(228.0 + math.sin(i / 10.0) * 3.5, 1)
            power = max(0.0, round(solar_factor * 1200.0, 1))
            current = round(power / (voltage * 0.95), 2) if voltage > 0 else 0.0
            temp = round(27.0 + solar_factor * 7.5, 1)
            humidity = round(80.0 - solar_factor * 14.0, 1)
            energy = round(((total_points - i) / total_points) * 14.2, 2)

            readings.append(
                SensorReading(
                    device_id="TX001",
                    timestamp=time,
                    temperature=temp,
                    humidity=humidity,
                    voltage=voltage,
                    current=current,
                    power=power,
                    energy=energy,
                    rssi=-26.0,
                    snr=9.75,
                    packet_loss=0.14
                )
            )
        
        db.add_all(readings)
        db.commit()
        print(f"[SEED] Seeded {len(readings)} historical sensor readings into DB.")

    # Seed Initial Alert
    existing_alerts = db.query(Alert).count()
    if existing_alerts == 0:
        alert = Alert(
            alert_id="ALT-1003",
            device_id="TX001",
            alert_type="HIGH TEMPERATURE",
            severity="WARNING",
            message="Solar Panel Ambient Temp reached 41.2°C (Warning Threshold: 40.0°C)",
            value=41.2,
            threshold=40.0,
            created_at=datetime.utcnow() - timedelta(minutes=45),
            acknowledged=True
        )
        db.add(alert)
        db.commit()
        print("[SEED] Initial alerts seeded.")

    db.close()

if __name__ == "__main__":
    seed_database()
