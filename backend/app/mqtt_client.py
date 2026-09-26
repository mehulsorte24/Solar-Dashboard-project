import json
import asyncio
from datetime import datetime
import paho.mqtt.client as mqtt
from app.config import settings
from app.database import SessionLocal
from app.models import SensorReading, Device, Alert
from app.websocket_manager import manager

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"[MQTT] Connected successfully to broker {settings.MQTT_BROKER_HOST}:{settings.MQTT_BROKER_PORT}")
        client.subscribe("solar/+/telemetry")
        client.subscribe("solar/+/alerts")
        client.subscribe("solar/+/status")
    else:
        print(f"[MQTT] Connection failed with result code {rc}")

def process_telemetry_message(payload_str: str):
    db = SessionLocal()
    try:
        data = json.loads(payload_str)
        device_id = data.get("device_id", "TX001")
        
        # Ensure device exists
        device = db.query(Device).filter(Device.device_id == device_id).first()
        if not device:
            device = Device(
                device_id=device_id,
                device_name=f"Solar Node {device_id}",
                device_type="TRANSMITTER",
                location="Solar Array Substation",
                status="ONLINE"
            )
            db.add(device)
            db.commit()

        # Create sensor reading
        reading = SensorReading(
            device_id=device_id,
            timestamp=datetime.utcnow(),
            temperature=float(data.get("temperature", 31.0)),
            humidity=float(data.get("humidity", 73.0)),
            voltage=float(data.get("voltage", 230.4)),
            current=float(data.get("current", 4.19)),
            power=float(data.get("power", 966)),
            energy=float(data.get("energy", 12.48)),
            rssi=float(data.get("rssi", -26.0)),
            snr=float(data.get("snr", 9.75)),
            packet_loss=float(data.get("packet_loss", 0.0))
        )
        db.add(reading)

        # Threshold check: Temperature alert
        if reading.temperature >= 40.0:
            existing_alert = db.query(Alert).filter(
                Alert.device_id == device_id,
                Alert.alert_type == "HIGH TEMPERATURE",
                Alert.resolved_at.is_(None)
            ).first()
            if not existing_alert:
                new_alert = Alert(
                    alert_id=f"ALT-{int(datetime.utcnow().timestamp())}",
                    device_id=device_id,
                    alert_type="HIGH TEMPERATURE",
                    severity="WARNING" if reading.temperature < 55.0 else "CRITICAL",
                    message=f"Panel temperature reached {reading.temperature}°C",
                    value=reading.temperature,
                    threshold=40.0,
                    created_at=datetime.utcnow()
                )
                db.add(new_alert)

        device.last_seen = datetime.utcnow()
        db.commit()

        # Broadcast via WebSocket
        broadcast_payload = {
            "device_id": reading.device_id,
            "timestamp": reading.timestamp.isoformat(),
            "temperature": reading.temperature,
            "humidity": reading.humidity,
            "voltage": reading.voltage,
            "current": reading.current,
            "power": reading.power,
            "energy": reading.energy,
            "rssi": reading.rssi,
            "snr": reading.snr,
            "packet_loss": reading.packet_loss
        }
        
        # Schedule broadcast on event loop
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(manager.broadcast(broadcast_payload))
        except Exception as e:
            pass

    except Exception as e:
        print(f"[MQTT] Failed to process telemetry message: {e}")
        db.rollback()
    finally:
        db.close()

def on_message(client, userdata, msg):
    try:
        payload_str = msg.payload.decode('utf-8')
        process_telemetry_message(payload_str)
    except Exception as e:
        print(f"[MQTT] Error handling message on topic {msg.topic}: {e}")

def start_mqtt_client():
    client = mqtt.Client(client_id="fastapi_solar_backend")
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect(settings.MQTT_BROKER_HOST, settings.MQTT_BROKER_PORT, 60)
        client.loop_start()
        print(f"[MQTT] Background client loop started on {settings.MQTT_BROKER_HOST}:{settings.MQTT_BROKER_PORT}")
    except Exception as e:
        print(f"[MQTT] Warning: Could not connect to MQTT broker ({e}). System running in REST/WebSocket mode.")
