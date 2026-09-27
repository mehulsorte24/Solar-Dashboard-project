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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DFD3] px-4 lg:px-6 py-3 shadow-[0_2px_15px_-3px_rgba(173,156,142,0.12)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7E6CA] border border-[#E8D59E] text-[#785918] flex items-center justify-center shrink-0 shadow-xs">
              <Sun className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-[#181412]">
                  SolarMonitor
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#F7E6CA] border border-[#E8D59E] text-[#785918] font-mono">
                  IIoT SCADA
                </span>
              </div>
              <p className="text-[11px] text-[#3B322B] font-semibold">Quiet Luxury Telemetry System</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3 py-1.5 w-64 text-xs text-[#181412]">
            <Search className="w-3.5 h-3.5 text-[#3B322B] shrink-0" />
            <input
              type="text"
              placeholder="Search devices, sensors..."
              className="bg-transparent border-none outline-none text-[#181412] placeholder-[#5C4F44] text-xs font-medium w-full"
            />
          </div>
        </div>

        {/* Center: Plant Selector & Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Plant Selector */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8DFD3] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[#3B322B] font-bold">Plant:</span>
            <select className="bg-transparent text-[#181412] font-black outline-none cursor-pointer">
              <option value="plant1" className="bg-white text-[#181412]">Solar Plant 1 (Substation A)</option>
              <option value="plant2" className="bg-white text-[#181412]">Solar Plant 2 (Substation B)</option>
            </select>
          </div>

          {/* Mode Switcher (Simple vs Technical) */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DFD3]">
            <button
              onClick={() => setOperatingMode('simple')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                operatingMode === 'simple'
                  ? 'bg-[#E8D59E] text-[#181412] shadow-sm'
                  : 'text-[#3B322B] hover:text-[#181412]'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setOperatingMode('technical')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                operatingMode === 'technical'
                  ? 'bg-[#181412] text-white shadow-sm'
                  : 'text-[#3B322B] hover:text-[#181412]'
              }`}
            >
              Technical
            </button>
          </div>

          {/* Data Source Switcher (Demo vs API) */}
          <button
            onClick={() => setDataSourceMode(dataSource === 'mock' ? 'api' : 'mock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
              dataSource === 'mock'
                ? 'bg-[#F7E6CA] border-[#E8D59E] text-[#785918]'
                : 'bg-[#EBF4EE] border-[#B7DFC0] text-[#1E522F]'
            }`}
          >
            <Database className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{dataSource === 'mock' ? 'DEMO MOCK' : 'LIVE FASTAPI'}</span>
          </button>
        </div>

        {/* Right: System Status & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* System Online Status */}
          <div className="hidden sm:flex items-center gap-2 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E8DFD3] text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E522F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1E522F]"></span>
            </span>
            <span className="text-[#1E522F] font-black">System Online</span>
            <span className="text-[#3B322B]">•</span>
            <span className="text-[#3B322B] text-[11px] font-bold">{timeStr || '10:42:31 AM'}</span>
          </div>

          {/* Notification Alert Bell */}
          <button
            onClick={() => setActivePage('alerts')}
            className="relative p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F7E6CA] border border-[#E8DFD3] text-[#181412] transition shadow-xs"
          >
            <Bell className="w-4 h-4 stroke-[2.2]" />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#D9BBB0] text-[#181412] border border-white text-[10px] font-black flex items-center justify-center shadow">
                {activeAlerts}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8DFD3] px-2.5 py-1.5 rounded-xl text-xs text-[#181412]">
            <div className="w-6 h-6 rounded-full bg-[#F7E6CA] border border-[#E8D59E] flex items-center justify-center text-[#785918] font-black">
              <UserCheck className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="font-black hidden sm:inline">Operator</span>
            <ChevronDown className="w-3 h-3 text-[#3B322B]" />
          </div>

        </div>

      </div>
    </header>
  );
};
