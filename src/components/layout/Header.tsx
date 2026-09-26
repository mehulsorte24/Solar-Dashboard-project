import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { Sun, Activity, Bell, Database } from 'lucide-react';

export const Header: React.FC = () => {
  const { operatingMode, setOperatingMode, dataSource, setDataSourceMode, dashboardSummary, latestTelemetry, setActivePage } = useSystem();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const date = latestTelemetry?.timestamp ? new Date(latestTelemetry.timestamp) : new Date();
      setTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [latestTelemetry]);

  const activeAlerts = dashboardSummary?.active_alerts_count || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
            <Sun className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-wider text-slate-100 uppercase">
                IIoT Solar Monitoring
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border bg-cyan-950/70 border-cyan-800 text-cyan-400">
                PLC & SCADA integrated
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>ESP32-S3 + LoRa + RPi Gateway</span>
              <span>•</span>
              <span className="text-slate-500 font-mono text-[11px]">Substation Alpha</span>
            </p>
          </div>
        </div>

        {/* Center: System Live Status & Last Updated */}
        <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-xl px-3.5 py-1.5 self-start md:self-auto">
          {/* Status Dot */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wide text-emerald-400 uppercase">
              {dashboardSummary?.system_status || 'SYSTEM RUNNING'}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Time */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Last Updated:</span>
            <span className="font-semibold text-slate-200">{timeStr || '10:42:31 AM'}</span>
          </div>
        </div>

        {/* Right Controls: Mode Toggle, Data Source Switcher, Alerts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Data Source Toggle (Mock vs API) */}
          <button
            onClick={() => setDataSourceMode(dataSource === 'mock' ? 'api' : 'mock')}
            title="Toggle Data Source (Demo Mock vs Live Backend API)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              dataSource === 'mock'
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{dataSource === 'mock' ? 'DEMO (MOCK)' : 'LIVE (FASTAPI)'}</span>
          </button>

          {/* Operating Mode Toggle (Simple Operator vs Technical Engineer) */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setOperatingMode('simple')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                operatingMode === 'simple'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setOperatingMode('technical')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                operatingMode === 'technical'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Technical
            </button>
          </div>

          {/* Alert Bell Button */}
          <button
            onClick={() => setActivePage('alerts')}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="View Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                {activeAlerts}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
