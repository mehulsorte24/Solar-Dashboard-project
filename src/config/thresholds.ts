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
      return 'text-[#3B724D] bg-[#EBF4EE] border-[#B7DFC0]';
    case 'STABLE':
      return 'text-[#5C4D40] bg-[#F4EFEA] border-[#AD9C8E]';
    case 'WEAK':
      return 'text-[#916212] bg-[#FDF6E7] border-[#E8D59E]';
    case 'DISCONNECTED':
      return 'text-[#A64B42] bg-[#FBF0EE] border-[#D9BBB0]';
    default:
      return 'text-[#6E645B] bg-[#F4EFEA] border-[#D9CEBF]';
  }
}
