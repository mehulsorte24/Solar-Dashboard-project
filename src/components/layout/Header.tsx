import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { Search, Bell, ChevronDown, UserCheck, Database, Sun } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-[#0a1122]/95 backdrop-blur-md border-b border-[#162238] px-4 lg:px-6 py-3 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wide text-slate-100">
                  SolarMonitor
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono">
                  IIoT SCADA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">IIoT Energy Monitoring System</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-[#070c18] border border-[#162238] rounded-xl px-3 py-1.5 w-64 text-xs text-slate-400">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search devices, sensors..."
              className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-xs w-full"
            />
          </div>
        </div>

        {/* Center: Plant Selector & Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Plant Selector */}
          <div className="flex items-center gap-2 bg-[#070c18] border border-[#162238] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Plant:</span>
            <select className="bg-transparent text-slate-200 font-semibold outline-none cursor-pointer">
              <option value="plant1" className="bg-slate-900 text-slate-200">Solar Plant 1 (Substation A)</option>
              <option value="plant2" className="bg-slate-900 text-slate-200">Solar Plant 2 (Substation B)</option>
            </select>
          </div>

          {/* Mode Switcher (Simple vs Technical) */}
          <div className="flex items-center gap-1 bg-[#070c18] p-1 rounded-xl border border-[#162238]">
            <button
              onClick={() => setOperatingMode('simple')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                operatingMode === 'simple'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setOperatingMode('technical')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                operatingMode === 'technical'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Technical
            </button>
          </div>

          {/* Data Source Switcher (Demo vs API) */}
          <button
            onClick={() => setDataSourceMode(dataSource === 'mock' ? 'api' : 'mock')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition ${
              dataSource === 'mock'
                ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{dataSource === 'mock' ? 'DEMO MOCK' : 'LIVE FASTAPI'}</span>
          </button>
        </div>

        {/* Right: System Status & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* System Online Status */}
          <div className="hidden sm:flex items-center gap-2 bg-[#070c18] px-3 py-1.5 rounded-xl border border-[#162238] text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold">System Online</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-[11px]">{timeStr || '10:42:31 AM'}</span>
          </div>

          {/* Notification Alert Bell */}
          <button
            onClick={() => setActivePage('alerts')}
            className="relative p-2 rounded-xl bg-[#070c18] hover:bg-slate-800 border border-[#162238] text-slate-300 transition"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {activeAlerts}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 bg-[#070c18] border border-[#162238] px-2.5 py-1.5 rounded-xl text-xs text-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold hidden sm:inline">Operator</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>

        </div>

      </div>
    </header>
  );
};
