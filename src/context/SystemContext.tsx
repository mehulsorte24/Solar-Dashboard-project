import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { OperatingMode, DataSourceMode, TelemetryData, DashboardSummary, ThresholdConfig } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';

export type PageId = 'dashboard' | 'live' | 'analytics' | 'alerts' | 'devices' | 'reports';

interface ToastMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
}

interface SystemContextType {
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  dataSource: DataSourceMode;
  setDataSourceMode: (source: DataSourceMode) => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  latestTelemetry: TelemetryData | null;
  dashboardSummary: DashboardSummary | null;
  thresholds: ThresholdConfig;
  updateThresholds: (newThresholds: Partial<ThresholdConfig>) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshDashboard: () => Promise<void>;
  isLoading: boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operatingMode, setOperatingModeState] = useState<OperatingMode>('technical');
  const [dataSource, setDataSourceState] = useState<DataSourceMode>(dataAdapter.getDataSource());
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryData | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set operating mode
  const setOperatingMode = (mode: OperatingMode) => {
    setOperatingModeState(mode);
    addToast({
      type: 'info',
      title: `Switched to ${mode === 'simple' ? 'Simple Mode (Operator)' : 'Technical Mode (Engineer)'}`,
      message: mode === 'simple' ? 'Simplified views enabled with high-level health indicators.' : 'Exposing detailed LoRa RSSI/SNR, PLC & SCADA telemetry.'
    });
  };

  // Set data source mode (mock vs api)
  const setDataSourceMode = (source: DataSourceMode) => {
    dataAdapter.setDataSource(source);
    setDataSourceState(source);
    addToast({
      type: source === 'api' ? 'warning' : 'info',
      title: `Data Source: ${source === 'api' ? 'LIVE BACKEND API' : 'DEMO / MOCK DATA'}`,
      message: source === 'api' ? 'Connecting to FastAPI backend & WebSocket service...' : 'Using simulated IIoT sensor telemetry layer.'
    });
    refreshDashboard();
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateThresholds = (newThresholds: Partial<ThresholdConfig>) => {
    setThresholds(prev => ({ ...prev, ...newThresholds }));
    addToast({
      type: 'success',
      title: 'Thresholds Updated',
      message: 'System alert thresholds updated successfully.'
    });
  };

  const refreshDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const summary = await dataAdapter.getDashboardSummary();
      const latest = await dataAdapter.getLatestReading();
      setDashboardSummary(summary);
      setLatestTelemetry(latest);
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  // Initial load & stream subscription
  useEffect(() => {
    refreshDashboard();

    const unsubscribe = dataAdapter.subscribeLiveStream((reading) => {
      setLatestTelemetry(reading);
      setDashboardSummary(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          current_power: reading.power,
          today_energy: reading.energy,
          voltage: reading.voltage,
          current: reading.current,
          temperature: reading.temperature,
          humidity: reading.humidity,
          comm_rssi: reading.rssi ?? prev.comm_rssi,
          comm_snr: reading.snr ?? prev.comm_snr,
          last_updated: reading.timestamp
        };
      });
    });

    return () => {
      unsubscribe();
    };
  }, [refreshDashboard, dataSource]);

  return (
    <SystemContext.Provider value={{
      operatingMode,
      setOperatingMode,
      dataSource,
      setDataSourceMode,
      activePage,
      setActivePage,
      latestTelemetry,
      dashboardSummary,
      thresholds,
      updateThresholds,
      toasts,
      addToast,
      removeToast,
      refreshDashboard,
      isLoading
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
