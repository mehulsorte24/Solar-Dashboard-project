-- PostgreSQL Schema for IIoT Solar Energy Monitoring System
-- Project: IIoT Based Solar Energy Monitoring System Using PLC and SCADA

-- 1. Devices Table
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(50) PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- TRANSMITTER, RECEIVER, GATEWAY, PLC, SCADA, ENERGY_METER, DHT22
    location VARCHAR(150),
    status VARCHAR(20) DEFAULT 'ONLINE', -- ONLINE, OFFLINE, DEGRADED
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    firmware_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sensor Readings Table (Timeseries)
CREATE TABLE IF NOT EXISTS sensor_readings (
    reading_id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    temperature NUMERIC(5,2),
    humidity NUMERIC(5,2),
    voltage NUMERIC(6,2),
    current NUMERIC(6,2),
    power NUMERIC(8,2),
    energy NUMERIC(10,2),
    rssi NUMERIC(5,2),
    snr NUMERIC(5,2),
    packet_loss NUMERIC(5,2)
);

-- Index for rapid historical range queries
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_time ON sensor_readings(device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);

-- 3. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    alert_id VARCHAR(50) PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL, -- HIGH TEMPERATURE, LOW LORA RSSI, DEVICE OFFLINE
    severity VARCHAR(20) NOT NULL,    -- INFO, WARNING, CRITICAL
    message TEXT NOT NULL,
    value NUMERIC(10,2),
    threshold NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_alerts_device ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);

-- 4. Communication Logs Table
CREATE TABLE IF NOT EXISTS communication_logs (
    log_id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rssi NUMERIC(5,2),
    snr NUMERIC(5,2),
    packet_sent INTEGER DEFAULT 0,
    packet_received INTEGER DEFAULT 0,
    packet_loss NUMERIC(5,2) DEFAULT 0.0
);

CREATE INDEX IF NOT EXISTS idx_comm_logs_time ON communication_logs(timestamp DESC);
