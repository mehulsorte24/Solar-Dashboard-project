import React from 'react';
import { useSystem } from '../../context/SystemContext';
import type { PageId } from '../../context/SystemContext';
import { LayoutDashboard, Radio, BarChart3, Bell, Cpu, FileText, Sun, Leaf } from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, dashboardSummary } = useSystem();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'live',
      label: 'Live Monitoring',
      icon: Radio,
      badge: 'LIVE',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: dashboardSummary?.active_alerts_count ? `${dashboardSummary.active_alerts_count}` : undefined,
    },
    {
      id: 'devices',
      label: 'Devices',
      icon: Cpu,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-full lg:w-60 bg-[#0a1122] border-r border-[#162238] shrink-0 flex flex-col justify-between p-3 lg:p-4">
      
      {/* Navigation section */}
      <div className="space-y-6">
        
        {/* Brand header in sidebar */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">SolarMonitor</div>
            <div className="text-[10px] text-slate-500 font-mono">IIoT SCADA Platform</div>
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1930]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    item.badge === 'LIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Graphic Card (From Image 1) */}
      <div className="mt-6 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0e1b36] to-[#070c18] border border-blue-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Leaf className="w-4 h-4" />
            <span>Clean Energy Brighter Future</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Real-time monitoring for a sustainable tomorrow.
          </p>
        </div>

        <div className="text-[10px] text-slate-500 text-center font-mono">
          Final Year IIoT Project v1.0
        </div>
      </div>

    </aside>
  );
};
