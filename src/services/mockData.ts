import type { TelemetryData, DeviceInfo, AlertItem } from '../types/system';

// Generating realistic solar curve telemetry
export function generateMockTelemetry(): TelemetryData {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  
  // Solar output curve based on time of day (peak at 1:00 PM)
  let solarFactor = 0;
  if (hour >= 6 && hour <= 18) {
    solarFactor = Math.sin(((hour - 6) / 12) * Math.PI);
  }
  
  const baseVoltage = 230.4 + (Math.random() * 2.4 - 1.2);
  const basePower = Math.round(solarFactor * 1150 + (Math.random() * 30 - 15));
  const current = parseFloat((basePower / (baseVoltage * 0.95)).toFixed(2));
  const temp = parseFloat((28.5 + solarFactor * 8.0 + (Math.random() * 0.8 - 0.4)).toFixed(1));
  const humidity = parseFloat((78.0 - solarFactor * 12.0 + (Math.random() * 1.5 - 0.75)).toFixed(1));
  
  // Calculate today's cumulative energy (approx 12.48 kWh peak)
  const todayEnergy = parseFloat((8.5 + solarFactor * 4.2).toFixed(2));

  return {
    device_id: 'TX001',
    timestamp: now.toISOString(),
    temperature: temp,
    humidity: humidity,
    voltage: parseFloat(baseVoltage.toFixed(1)),
    current: Math.max(0, current),
    power: Math.max(0, basePower),
    energy: todayEnergy,
    rssi: -24 - Math.floor(Math.random() * 8),
    snr: parseFloat((9.5 + (Math.random() * 0.5 - 0.25)).toFixed(2)),
    packet_sent: 1420,
    packet_received: 1418,
    packet_loss: 0.14
  };
}

export function generateMockHistoricalData(hours: number = 24): TelemetryData[] {
  const list: TelemetryData[] = [];
  const now = new Date();
  const totalPoints = hours * 12; // 5 minute intervals

  for (let i = totalPoints; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    const hour = time.getHours() + time.getMinutes() / 60;

    let solarFactor = 0;
    if (hour >= 6 && hour <= 18) {
      solarFactor = Math.sin(((hour - 6) / 12) * Math.PI);
    }

    const voltage = parseFloat((228.0 + Math.sin(i / 10) * 3.5 + Math.random()).toFixed(1));
    const power = Math.max(0, Math.round(solarFactor * 1200 + (Math.random() * 40 - 20)));
    const current = parseFloat((power / (voltage * 0.95)).toFixed(2));
    const temp = parseFloat((27.0 + solarFactor * 7.5 + Math.random() * 0.5).toFixed(1));
    const humidity = parseFloat((80.0 - solarFactor * 14.0 + Math.random()).toFixed(1));
    const energy = parseFloat((((totalPoints - i) / totalPoints) * 14.2).toFixed(2));

    list.push({
      device_id: 'TX001',
      timestamp: time.toISOString(),
      temperature: temp,
      humidity: humidity,
      voltage: voltage,
      current: Math.max(0, current),
      power: power,
      energy: energy,
      rssi: -22 - Math.floor(Math.random() * 10),
      snr: parseFloat((9.2 + Math.random() * 0.6).toFixed(2)),
      packet_sent: 2000 - i,
      packet_received: 1996 - i,
      packet_loss: 0.2
    });
  }

  return list;
}

export const MOCK_DEVICES: DeviceInfo[] = [
  {
    device_id: 'TX001',
    device_name: 'Solar Node ESP32-S3 (TX)',
    device_type: 'TRANSMITTER',
    location: 'Rooftop Solar Array - Substation A',
    status: 'ONLINE',
    ip_address: '192.168.1.105',
    mac_address: '48:E7:29:A2:14:8B',
    firmware_version: 'v2.4.1-lora',
    created_at: '2026-01-15T08:00:00Z',
    last_seen: new Date().toISOString(),
    metrics: {
      rssi: -26,
      snr: 9.75,
      cpu_temp: 36.4,
      uptime_hours: 342,
      packet_loss: 0.0
    }
  },
  {
    device_id: 'RX001',
    device_name: 'LoRa Gateway ESP32-S3 (RX)',
    device_type: 'RECEIVER',
    location: 'Control Room Gateway Stand',
    status: 'ONLINE',
    ip_address: '192.168.1.106',
    mac_address: '48:E7:29:B5:99:3C',
    firmware_version: 'v2.4.1-lora',
    created_at: '2026-01-15T08:00:00Z',
    last_seen: new Date().toISOString(),
    metrics: {
      rssi: -26,
      snr: 9.75,
      cpu_temp: 34.2,
      uptime_hours: 342,
      packet_loss: 0.0
    }
  },
  {
    device_id: 'RPI01',
    device_name: 'Raspberry Pi 4 Gateway',
    device_type: 'GATEWAY',
    location: 'Main SCADA Cabinet',
    status: 'ONLINE',
    ip_address: '192.168.1.100',
    mac_address: 'DC:A6:32:88:F1:02',
    firmware_version: 'Debian 12 (Bookworm)',
    created_at: '2026-01-10T08:00:00Z',
    last_seen: new Date().toISOString(),
    metrics: {
      cpu_usage: 14.5,
      memory_usage: 32.8,
      cpu_temp: 42.1,
      uptime_hours: 1250,
      packet_loss: 0.0
    }
  },
  {
    device_id: 'PLC01',
    device_name: 'Siemens S7-1200 Industrial PLC',
    device_type: 'PLC',
    location: 'Industrial Automation Rack 01',
    status: 'ONLINE',
    ip_address: '192.168.1.200',
    firmware_version: 'v4.5.2',
    created_at: '2026-01-10T08:00:00Z',
    last_seen: new Date().toISOString(),
    metrics: {
      uptime_hours: 2400
    }
  },
  {
    device_id: 'SCADA01',
    device_name: 'WinCC / SCADA Master Station',
    device_type: 'SCADA',
    location: 'Central Control Station',
    status: 'ONLINE',
    ip_address: '192.168.1.250',
    firmware_version: 'WinCC RT v7.5',
    created_at: '2026-01-10T08:00:00Z',
    last_seen: new Date().toISOString(),
    metrics: {
      uptime_hours: 2400
    }
  },
  {
    device_id: 'EM001',
    device_name: 'RS485 Modbus Energy Meter',
    device_type: 'ENERGY_METER',
    location: 'AC Inverter Junction Box',
    status: 'ONLINE',
    created_at: '2026-01-15T08:00:00Z',
    last_seen: new Date().toISOString()
  },
  {
    device_id: 'DHT001',
    device_name: 'DHT22 Temp & Humidity Sensor',
    device_type: 'DHT22',
    location: 'Solar Panel Array Weather Shelter',
    status: 'ONLINE',
    created_at: '2026-01-15T08:00:00Z',
    last_seen: new Date().toISOString()
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    alert_id: 'ALT-1003',
    device_id: 'TX001',
    alert_type: 'HIGH TEMPERATURE',
    severity: 'WARNING',
    message: 'Solar Panel Ambient Temp reached 41.2°C (Warning Threshold: 40.0°C)',
    value: 41.2,
    threshold: 40.0,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    acknowledged: true
  },
  {
    alert_id: 'ALT-1002',
    device_id: 'TX001',
    alert_type: 'LOW COMMUNICATION QUALITY',
    severity: 'INFO',
    message: 'SX1278 LoRa RSSI degraded to -88 dBm temporarily due to atmospheric interference',
    value: -88,
    threshold: -85,
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    acknowledged: true,
    resolved_at: new Date(Date.now() - 175 * 60 * 1000).toISOString()
  },
  {
    alert_id: 'ALT-1001',
    device_id: 'RPI01',
    alert_type: 'SYSTEM RECOVERED',
    severity: 'INFO',
    message: 'MQTT Broker reconnected smoothly after gateway network interface refresh',
    value: 1,
    threshold: 1,
    created_at: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    acknowledged: true,
    resolved_at: new Date(Date.now() - 360 * 60 * 1000).toISOString()
  }
];
