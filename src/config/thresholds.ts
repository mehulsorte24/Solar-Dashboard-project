import type { ThresholdConfig, SeverityType, CommStatusType } from '../types/system';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  temp_warning: 40.0,
  temp_critical: 55.0,
  voltage_min: 190.0,
  voltage_max: 250.0,
  current_max: 10.0,
  rssi_warning: -85,
  rssi_critical: -110,
};

export function evaluateTempSeverity(temp: number, config: ThresholdConfig = DEFAULT_THRESHOLDS): SeverityType {
  if (temp >= config.temp_critical) return 'CRITICAL';
  if (temp >= config.temp_warning) return 'WARNING';
  return 'INFO';
}

export function evaluateCommStatus(rssi: number, snr: number): CommStatusType {
  if (rssi === undefined || rssi < -115) return 'DISCONNECTED';
  if (rssi > -60 && snr > 8) return 'EXCELLENT';
  if (rssi > -90 && snr > 4) return 'STABLE';
  return 'WEAK';
}

export function getCommStatusColor(status: CommStatusType): string {
  switch (status) {
    case 'EXCELLENT':
      return 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
    case 'STABLE':
      return 'text-cyan-400 bg-cyan-950/50 border-cyan-800';
    case 'WEAK':
      return 'text-amber-400 bg-amber-950/50 border-amber-800';
    case 'DISCONNECTED':
      return 'text-rose-400 bg-rose-950/50 border-rose-800';
    default:
      return 'text-slate-400 bg-slate-900 border-slate-700';
  }
}
