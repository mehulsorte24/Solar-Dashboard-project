import React from 'react';
import { useSystem } from '../../context/SystemContext';
import type { PageId } from '../../context/SystemContext';
import { LayoutDashboard, Radio, BarChart3, Bell, Cpu, FileText } from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, dashboardSummary } = useSystem();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'System overview & KPIs'
    },
    {
      id: 'live',
      label: 'Live Monitoring',
      icon: Radio,
      badge: 'LIVE',
      description: 'High-frequency telemetry stream'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Historical trends & statistics'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: dashboardSummary?.active_alerts_count ? `${dashboardSummary.active_alerts_count}` : undefined,
      description: 'System warnings & fault logs'
    },
    {
      id: 'devices',
      label: 'Devices & Health',
      icon: Cpu,
      description: 'LoRa, ESP32, PLC & SCADA status'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Generate & export PDF/CSV reports'
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between p-3 lg:p-4">
      
      {/* Navigation list */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Monitoring Navigation
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-cyan-600/15 border border-cyan-500/40 text-cyan-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    item.badge === 'LIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info in sidebar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 px-2 space-y-3">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>LoRa Link</span>
            <span className="text-emerald-400 font-mono text-[10px]">🟢 EXCELLENT</span>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-slate-500">
            <span>RSSI: -26 dBm</span>
            <span>SNR: 9.75 dB</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[95%]" />
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center font-mono">
          Final Year IIoT Project v1.0
        </div>
      </div>

    </aside>
  );
};
