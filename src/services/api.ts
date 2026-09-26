import type { DashboardSummary, TelemetryData, DeviceInfo, AlertItem, AnalyticsSummary, AnalyticsFilter } from '../types/system';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/dashboard`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchLatestReading(): Promise<TelemetryData> {
  const res = await fetch(`${API_BASE_URL}/readings/latest`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchHistoricalReadings(hours: number = 24): Promise<TelemetryData[]> {
  const res = await fetch(`${API_BASE_URL}/readings/history?hours=${hours}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchDevices(): Promise<DeviceInfo[]> {
  const res = await fetch(`${API_BASE_URL}/devices`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE_URL}/alerts`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function acknowledgeAlertApi(alertId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/alerts/${alertId}/acknowledge`, { method: 'POST' });
  return res.ok;
}

export async function fetchAnalyticsData(filter: AnalyticsFilter): Promise<AnalyticsSummary> {
  const query = new URLSearchParams({
    range: filter.timeRange,
    params: filter.parameters.join(','),
  });
  if (filter.startDate) query.append('start', filter.startDate);
  if (filter.endDate) query.append('end', filter.endDate);

  const res = await fetch(`${API_BASE_URL}/analytics?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}
