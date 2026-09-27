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
    <aside className="w-full lg:w-60 bg-[#FDFBF7] border-r border-[#E8DFD3] shrink-0 flex flex-col justify-between p-3 lg:p-4 shadow-[2px_0_15px_-4px_rgba(173,156,142,0.08)]">
      
      {/* Navigation section */}
      <div className="space-y-6">
        
        {/* Brand header in sidebar */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-8 h-8 rounded-xl bg-[#F7E6CA] border border-[#E8D59E] text-[#785918] flex items-center justify-center shrink-0 shadow-xs">
            <Sun className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-sm font-black text-[#181412]">SolarMonitor</div>
            <div className="text-[10px] text-[#3B322B] font-mono font-bold">Quiet Luxury IIoT</div>
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-[#F7E6CA] text-[#181412] font-black border border-[#E8D59E] shadow-xs'
                    : 'text-[#2E2722] font-bold hover:text-[#181412] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-[#785918]' : 'text-[#3B322B]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    item.badge === 'LIVE'
                      ? 'bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0]'
                      : 'bg-[#FBF0EE] text-[#8C3830] border border-[#D9BBB0]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Graphic Card */}
      <div className="mt-6 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F7E6CA] border border-[#E8D59E] text-xs space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#1E522F] font-black">
            <Leaf className="w-4 h-4 stroke-[2.2]" />
            <span>Clean Energy Monitoring</span>
          </div>
          <p className="text-[11px] text-[#2E2722] font-medium leading-relaxed">
            Sustainable solar efficiency with precision SCADA control.
          </p>
        </div>

        <div className="text-[10px] text-[#3B322B] text-center font-mono font-bold">
          Quiet Luxury Edition • v1.0
        </div>
      </div>

    </aside>
  );
};
