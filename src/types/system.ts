// Core TypeScript Definitions for Solar IIoT System

export type OperatingMode = 'simple' | 'technical';
export type DataSourceMode = 'mock' | 'api';
export type SystemStatusType = 'RUNNING' | 'WARNING' | 'FAULT' | 'OFFLINE';
export type CommStatusType = 'EXCELLENT' | 'STABLE' | 'WEAK' | 'DISCONNECTED';
export type SeverityType = 'INFO' | 'WARNING' | 'CRITICAL';

export interface TelemetryData {
  device_id: string;
  timestamp: string;
  temperature: number; // °C
  humidity: number;    // %
  voltage: number;     // V
  current: number;     // A
  power: number;       // W
  energy: number;      // kWh
  rssi?: number;       // dBm (LoRa RSSI)
  snr?: number;        // dB (LoRa SNR)
  packet_sent?: number;
  packet_received?: number;
  packet_loss?: number; // %
}

export interface SystemHealthState {
  sensor_dht22: boolean;
  energy_meter: boolean;
  lora_tx: boolean;
  lora_rx: boolean;
  raspberry_pi: boolean;
  mqtt_broker: boolean;
  postgresql_db: boolean;
  plc: boolean;
  scada: boolean;
}

export interface ThresholdConfig {
  temp_warning: number;
  temp_critical: number;
  voltage_min: number;
  voltage_max: number;
  current_max: number;
  rssi_warning: number;
  rssi_critical: number;
}

export interface DashboardSummary {
  current_power: number;
  today_energy: number;
  voltage: number;
  current: number;
  temperature: number;
  humidity: number;
  comm_status: CommStatusType;
  comm_rssi: number;
  comm_snr: number;
  system_status: SystemStatusType;
  last_updated: string;
  active_alerts_count: number;
  health: SystemHealthState;
}

export interface AlertItem {
  alert_id: string;
  device_id: string;
  alert_type: string;
  severity: SeverityType;
  message: string;
  value: number;
  threshold: number;
  created_at: string;
  acknowledged: boolean;
  resolved_at?: string;
}

export interface DeviceInfo {
  device_id: string;
  device_name: string;
  device_type: 'TRANSMITTER' | 'RECEIVER' | 'GATEWAY' | 'PLC' | 'SCADA' | 'ENERGY_METER' | 'DHT22';
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  ip_address?: string;
  mac_address?: string;
  firmware_version?: string;
  created_at: string;
  last_seen: string;
  metrics?: {
    rssi?: number;
    snr?: number;
    cpu_temp?: number;
    cpu_usage?: number;
    memory_usage?: number;
    uptime_hours?: number;
    packet_loss?: number;
  };
}

export interface AnalyticsFilter {
  timeRange: 'today' | 'yesterday' | '7d' | '30d' | 'custom';
  startDate?: string;
  endDate?: string;
  parameters: Array<'power' | 'energy' | 'voltage' | 'current' | 'temperature' | 'humidity'>;
  deviceId?: string;
}

export interface AnalyticsSummary {
  min_power: number;
  max_power: number;
  avg_power: number;
  total_energy: number;
  peak_power_timestamp: string;
  avg_temp: number;
  max_temp: number;
  avg_voltage: number;
  avg_current: number;
  comm_success_rate: number;
  sample_count: number;
  has_sufficient_data: boolean;
  timeseries: TelemetryData[];
}
