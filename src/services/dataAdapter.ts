import type { TelemetryData, DashboardSummary, DeviceInfo, AlertItem, AnalyticsSummary, AnalyticsFilter, DataSourceMode, CommStatusType } from '../types/system';
import { generateMockTelemetry, generateMockHistoricalData, MOCK_DEVICES, MOCK_ALERTS } from './mockData';
import * as apiService from './api';
import { RealtimeWebSocketService } from './websocket';
import { evaluateCommStatus } from '../config/thresholds';

class SystemDataAdapter {
  private dataSource: DataSourceMode = 'mock';
  private wsService: RealtimeWebSocketService | null = null;

  constructor() {
    // Read initial data source setting from environment or local storage
    const stored = localStorage.getItem('SOLAR_DATA_SOURCE') as DataSourceMode | null;
    if (stored === 'mock' || stored === 'api') {
      this.dataSource = stored;
    } else {
      this.dataSource = (import.meta.env.VITE_DATA_SOURCE as DataSourceMode) || 'mock';
    }
  }

  public getDataSource(): DataSourceMode {
    return this.dataSource;
  }

  public setDataSource(mode: DataSourceMode): void {
    this.dataSource = mode;
    localStorage.setItem('SOLAR_DATA_SOURCE', mode);
    if (mode === 'mock' && this.wsService) {
      this.wsService.disconnect();
      this.wsService = null;
    }
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    if (this.dataSource === 'api') {
      try {
        return await apiService.fetchDashboardSummary();
      } catch (err) {
        console.warn('Backend API unavailable, falling back to mock dashboard summary:', err);
      }
    }

    const latest = generateMockTelemetry();
    const commStatus: CommStatusType = evaluateCommStatus(latest.rssi ?? -26, latest.snr ?? 9.75);

    return {
      current_power: latest.power,
      today_energy: latest.energy,
      voltage: latest.voltage,
      current: latest.current,
      temperature: latest.temperature,
      humidity: latest.humidity,
      comm_status: commStatus,
      comm_rssi: latest.rssi ?? -26,
      comm_snr: latest.snr ?? 9.75,
      system_status: 'RUNNING',
      last_updated: new Date().toISOString(),
      active_alerts_count: MOCK_ALERTS.filter(a => !a.resolved_at).length,
      health: {
        sensor_dht22: true,
        energy_meter: true,
        lora_tx: true,
        lora_rx: true,
        raspberry_pi: true,
        mqtt_broker: true,
        postgresql_db: true,
        plc: true,
        scada: true
      }
    };
  }

  public async getLatestReading(): Promise<TelemetryData> {
    if (this.dataSource === 'api') {
      try {
        return await apiService.fetchLatestReading();
      } catch (e) {
        console.warn('API fetch failed, returning mock reading:', e);
      }
    }
    return generateMockTelemetry();
  }

  public async getHistoricalReadings(hours: number = 24): Promise<TelemetryData[]> {
    if (this.dataSource === 'api') {
      try {
        return await apiService.fetchHistoricalReadings(hours);
      } catch (e) {
        console.warn('API fetch failed, returning mock historical data:', e);
      }
    }
    return generateMockHistoricalData(hours);
  }

  public async getDevices(): Promise<DeviceInfo[]> {
    if (this.dataSource === 'api') {
      try {
        return await apiService.fetchDevices();
      } catch (e) {
        console.warn('API fetch failed, returning mock devices:', e);
      }
    }
    return MOCK_DEVICES;
  }

  public async getAlerts(): Promise<AlertItem[]> {
    if (this.dataSource === 'api') {
      try {
        return await apiService.fetchAlerts();
      } catch (e) {
        console.warn('API fetch failed, returning mock alerts:', e);
      }
    }
    return MOCK_ALERTS;
  }

  public async getAnalytics(filter: AnalyticsFilter): Promise<AnalyticsSummary> {
    if (this.dataSource === 'api') {
      try {
        return await apiService.fetchAnalyticsData(filter);
      } catch (e) {
        console.warn('API fetch failed, returning mock analytics:', e);
      }
    }

    const hoursMap: Record<string, number> = {
      today: 12,
      yesterday: 24,
      '7d': 168,
      '30d': 720,
      custom: 24
    };

    const data = generateMockHistoricalData(hoursMap[filter.timeRange] || 24);
    if (data.length === 0) {
      return {
        min_power: 0,
        max_power: 0,
        avg_power: 0,
        total_energy: 0,
        peak_power_timestamp: '',
        avg_temp: 0,
        max_temp: 0,
        avg_voltage: 0,
        avg_current: 0,
        comm_success_rate: 0,
        sample_count: 0,
        has_sufficient_data: false,
        timeseries: []
      };
    }

    const powers = data.map(d => d.power);
    const temps = data.map(d => d.temperature);
    const voltages = data.map(d => d.voltage);
    const currents = data.map(d => d.current);

    const maxPower = Math.max(...powers);
    const maxPowerItem = data.find(d => d.power === maxPower);

    const sumPower = powers.reduce((a, b) => a + b, 0);
    const sumTemp = temps.reduce((a, b) => a + b, 0);
    const sumVolt = voltages.reduce((a, b) => a + b, 0);
    const sumCurr = currents.reduce((a, b) => a + b, 0);

    return {
      min_power: Math.min(...powers),
      max_power: maxPower,
      avg_power: Math.round(sumPower / powers.length),
      total_energy: data[data.length - 1]?.energy || 12.48,
      peak_power_timestamp: maxPowerItem?.timestamp || new Date().toISOString(),
      avg_temp: parseFloat((sumTemp / temps.length).toFixed(1)),
      max_temp: Math.max(...temps),
      avg_voltage: parseFloat((sumVolt / voltages.length).toFixed(1)),
      avg_current: parseFloat((sumCurr / currents.length).toFixed(2)),
      comm_success_rate: 99.8,
      sample_count: data.length,
      has_sufficient_data: true,
      timeseries: data
    };
  }

  public subscribeLiveStream(onData: (reading: TelemetryData) => void): () => void {
    if (this.dataSource === 'api') {
      if (!this.wsService) {
        this.wsService = new RealtimeWebSocketService();
        this.wsService.connect();
      }
      return this.wsService.onMessage(onData);
    } else {
      // Controlled mock live tick (every 3 seconds)
      const interval = setInterval(() => {
        onData(generateMockTelemetry());
      }, 3000);

      // Trigger initial tick immediately
      onData(generateMockTelemetry());

      return () => clearInterval(interval);
    }
  }
}

export const dataAdapter = new SystemDataAdapter();
