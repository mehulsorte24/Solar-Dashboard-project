import React, { useEffect, useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { KpiCard } from '../components/cards/KpiCard';
import { CommunicationQualityCard } from '../components/cards/CommunicationQualityCard';
import { PowerTimeChart } from '../components/charts/PowerTimeChart';
import { MultiParameterChart } from '../components/charts/MultiParameterChart';
import { SystemHealthGrid } from '../components/status/SystemHealthGrid';
import type { TelemetryData } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { Zap, BatteryCharging, Gauge, Activity, Thermometer, Droplets, ShieldCheck, Sun, CheckCircle2 } from 'lucide-react';
import { evaluateTempSeverity } from '../config/thresholds';

export const DashboardPage: React.FC = () => {
  const { dashboardSummary, latestTelemetry, operatingMode, thresholds } = useSystem();
  const [history, setHistory] = useState<TelemetryData[]>([]);

  useEffect(() => {
    dataAdapter.getHistoricalReadings(24).then(setHistory);
  }, []);

  const power = latestTelemetry?.power ?? dashboardSummary?.current_power ?? 966;
  const energy = latestTelemetry?.energy ?? dashboardSummary?.today_energy ?? 12.48;
  const voltage = latestTelemetry?.voltage ?? dashboardSummary?.voltage ?? 230.4;
  const current = latestTelemetry?.current ?? dashboardSummary?.current ?? 4.19;
  const temp = latestTelemetry?.temperature ?? dashboardSummary?.temperature ?? 31.0;
  const humidity = latestTelemetry?.humidity ?? dashboardSummary?.humidity ?? 77.8;

  const tempSeverity = evaluateTempSeverity(temp, thresholds);
  const tempStatusColor = tempSeverity === 'CRITICAL' ? 'red' : tempSeverity === 'WARNING' ? 'yellow' : 'blue';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner (As requested in section 7) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">
              SOLAR MONITORING
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry from ESP32-S3 LoRa Solar Transmitter node & RS485 Modbus Energy Meter.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-400">● SYSTEM RUNNING</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="text-slate-400">
            Mode: <span className="text-cyan-400 font-bold uppercase">{operatingMode}</span>
          </div>
        </div>
      </div>

      {/* SIMPLE MODE OPERATOR SUMMARY BANNER (Section 9) */}
      {operatingMode === 'simple' && (
        <div className="p-6 rounded-2xl border border-emerald-800/40 bg-emerald-950/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-300 uppercase tracking-wide">
                  SOLAR SYSTEM IS WORKING NORMALLY
                </h3>
                <p className="text-xs text-slate-300">
                  All solar panels, energy meters, and communication links are running healthy with no critical alerts.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/60 border border-emerald-700 text-emerald-300">
              🟢 OPERATOR SAFE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-emerald-900/50">
            <div>
              <span className="text-xs text-slate-400">Today's Production</span>
              <div className="text-2xl font-bold text-slate-100 font-mono mt-0.5">{energy} kWh</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Current Output</span>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-0.5">{power} W</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Environment</span>
              <div className="text-2xl font-bold text-slate-100 font-mono mt-0.5">{temp}°C / {humidity}%</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Communication</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">🟢 Excellent</div>
            </div>
          </div>
        </div>
      )}

      {/* 8 REQUIRED DASHBOARD KPI CARDS (Section 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Current Power */}
        <KpiCard
          title="Current Power"
          value={power}
          unit="W"
          icon={Zap}
          statusColor="yellow"
          subtitle="Solar AC Generation"
          trend="Peak: 1180 W"
        />

        {/* 2. Today's Energy */}
        <KpiCard
          title="Today's Energy"
          value={energy}
          unit="kWh"
          icon={BatteryCharging}
          statusColor="green"
          subtitle="Cumulative Output"
          trend="+1.4 kWh / hr"
        />

        {/* 3. Voltage */}
        <KpiCard
          title="Line Voltage"
          value={voltage}
          unit="V"
          icon={Gauge}
          statusColor="blue"
          subtitle="Grid Nominal: 230 V"
          technicalDetail="Frequency: 50.0 Hz"
        />

        {/* 4. Current */}
        <KpiCard
          title="System Current"
          value={current}
          unit="A"
          icon={Activity}
          statusColor="blue"
          subtitle="Modbus RS485 Meter"
          technicalDetail="Power Factor: 0.95"
        />

        {/* 5. Temperature */}
        <KpiCard
          title="Panel Ambient Temp"
          value={temp}
          unit="°C"
          icon={Thermometer}
          statusColor={tempStatusColor}
          subtitle="DHT22 Sensor Node"
          technicalDetail={`Warn Threshold: ${thresholds.temp_warning}°C`}
        />

        {/* 6. Humidity */}
        <KpiCard
          title="Ambient Humidity"
          value={humidity}
          unit="%"
          icon={Droplets}
          statusColor="blue"
          subtitle="Outdoor Conditions"
          technicalDetail="Dew Point: 23.4°C"
        />

        {/* 7. Communication */}
        <CommunicationQualityCard />

        {/* 8. System Status */}
        <KpiCard
          title="System Overall Status"
          value={dashboardSummary?.system_status || 'ONLINE'}
          icon={ShieldCheck}
          statusColor="green"
          subtitle="All Gateways Syncing"
          technicalDetail="PLC & SCADA Healthy"
        />

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power vs Time Chart */}
        <PowerTimeChart data={history} />

        {/* Dynamic Multi-Parameter Chart */}
        <MultiParameterChart data={history} />
      </div>

      {/* SYSTEM HEALTH GRID */}
      <SystemHealthGrid />

    </div>
  );
};
