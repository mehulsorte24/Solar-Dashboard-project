# IIoT Based Solar Energy Monitoring System Using PLC and SCADA

A production-quality Industrial Internet of Things (IIoT) control room dashboard & telemetry platform engineered for solar power monitoring, integrated with ESP32-S3, SX1278 LoRa, Modbus RS485 Energy Meter, DHT22 sensors, Raspberry Pi 4 Gateway, MQTT, PostgreSQL, FastAPI, WebSockets, Siemens S7-1200 PLC, and WinCC SCADA.

---

## 🌟 Key System Features

- **Modern Industrial Control Room UI**: Designed with a dark control room visual hierarchy, clean contrast, crisp typography, and responsive grid system.
- **Dual Operating Modes**:
  - 🟢 **Simple Mode (Non-Technical Operator)**: Displays high-level system status, daily production (kWh), real-time power (W), environment metrics, and plain English communication health.
  - 🛠️ **Technical Mode (Engineer View)**: Exposes full electrical metrics, LoRa RF RSSI/SNR diagnostics, packet loss calculator, packet success rate, PLC registers, and SCADA connectivity.
- **Isolated Data Source Layer**:
  - `DATA_SOURCE=mock`: Built-in demo telemetry generator with realistic solar generation curves for standalone UI testing without backend dependencies.
  - `DATA_SOURCE=api`: Production mode querying the FastAPI REST endpoints and subscribing to real-time `/ws/live` WebSockets.
- **6 Core Dashboard Modules**:
  1. **Dashboard**: 8 KPI cards, Simple/Technical mode toggle, Power vs Time area chart, dynamic multi-parameter overlay chart (Voltage, Current, Power, Temp, Humidity), and 9-node system health grid.
  2. **Live Monitoring**: Real-time streaming buffer chart, packet counter, LoRa link diagnostics, and auto-scrolling telemetry console log.
  3. **Analytics**: Date range filtering (`Today`, `Yesterday`, `Last 7 Days`, `Last 30 Days`), statistical min/max/average aggregations, peak power timestamps, trend lines, and fallback for insufficient data.
  4. **Alerts**: Severity-coded fault engine (`INFO`, `WARNING`, `CRITICAL`), threshold breach evaluation, operator acknowledgement workflow, and runtime threshold configuration modal.
  5. **Devices & System Health**: Hardware status cards for ESP32 TX, ESP32 RX, Raspberry Pi Gateway, Siemens PLC, SCADA Station, Energy Meter, and DHT22.
  6. **Reports**: Operational report generator with CSV export and print-ready PDF formatting.

---

## 🏗️ Architecture Data Flow

```text
Solar System 
    ↓
Energy Meter (RS485 Modbus) + DHT22 (Ambient Sensor)
    ↓
ESP32-S3 Transmitter Node (TX001)
    ↓
SX1278 433MHz LoRa Link
    ↓
ESP32-S3 Receiver Node (RX001)
    ↓
USB Serial
    ↓
Raspberry Pi 4 Gateway (RPI01)
    ↓
MQTT Broker (Topic: solar/+/telemetry)
    ↓
FastAPI Backend & Alert Engine
    ↓
PostgreSQL Database (Historical Telemetry)
    ↓
WebSocket Broadcast (/ws/live)
    ↓
React + Vite + TypeScript Industrial Web App
```

**Industrial Automation Path:**
$$\text{Raspberry Pi} \longrightarrow \text{Siemens S7-1200 PLC} \longrightarrow \text{WinCC SCADA}$$

---

## 🚀 Quick Start Guide

### 1. Frontend Setup (React + Vite + TypeScript)

```bash
# Navigate to project root
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 2. Backend Setup (FastAPI + PostgreSQL + MQTT)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate  # On Linux/Raspberry Pi

# Install python dependencies
pip install -r requirements.txt

# Run FastAPI server (auto-creates & seeds database on startup)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

FastAPI Interactive API Docs will be available at: `http://localhost:8000/docs`

---

## 🗄️ Database Schema (PostgreSQL DDL)

The backend includes `backend/schema.sql` defining relational tables:
- `devices`: Primary inventory of hardware nodes & last-seen heartbeat.
- `sensor_readings`: Timeseries database of voltage, current, power, energy, temp, humidity, RSSI, SNR. Indexed on `(device_id, timestamp)`.
- `alerts`: Active/resolved warning & critical threshold alerts.
- `communication_logs`: RF link diagnostic logs (packets sent/received, loss rate).

---

## 📡 MQTT Telemetry Topic Specification

**Topic:** `solar/TX001/telemetry`

**Payload JSON:**
```json
{
  "device_id": "TX001",
  "temperature": 31.0,
  "humidity": 77.8,
  "voltage": 230.4,
  "current": 4.19,
  "power": 966,
  "energy": 12.48,
  "rssi": -26.0,
  "snr": 9.75,
  "packet_loss": 0.14,
  "timestamp": "2026-09-26T10:42:31Z"
}
```

---

## 📄 License & Final Year Project Metadata

- **Project Title:** IIoT Based Solar Energy Monitoring System Using PLC and SCADA
- **Target Deployment:** Raspberry Pi 4 / Local Substation Network / Central Control Room
