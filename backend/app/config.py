import os
from pydantic_settings import BaseSettings if os.path.exists("pydantic_settings") else object

class Settings:
    PROJECT_NAME: str = "IIoT Based Solar Energy Monitoring System"
    API_V1_STR: str = "/api"
    
    # Database: Default PostgreSQL, fallback to SQLite if PostgreSQL env not supplied
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "solardb")
    
    # Computed DB URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    )

    # MQTT Settings
    MQTT_BROKER_HOST: str = os.getenv("MQTT_BROKER_HOST", "localhost")
    MQTT_BROKER_PORT: int = int(os.getenv("MQTT_BROKER_PORT", "1883"))
    MQTT_TELEMETRY_TOPIC: str = "solar/+/telemetry"
    MQTT_ALERTS_TOPIC: str = "solar/+/alerts"
    MQTT_STATUS_TOPIC: str = "solar/+/status"

settings = Settings()
