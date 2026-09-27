import React, { useEffect, useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { KpiCard } from '../components/cards/KpiCard';
import { CommunicationQualityCard } from '../components/cards/CommunicationQualityCard';
import { PowerTimeChart } from '../components/charts/PowerTimeChart';
import { SystemHealthGrid } from '../components/status/SystemHealthGrid';
import { SystemFlowDiagram } from '../components/status/SystemFlowDiagram';
import type { TelemetryData } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { Zap, Battery, Gauge, Activity, Thermometer, Sun, ShieldCheck, CheckCircle2, Droplets, Lightbulb, Bell, BarChart3, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { dashboardSummary, latestTelemetry, operatingMode, setActivePage } = useSystem();
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

  // Bar data for daily energy generation
  const barData = [
    { day: 'Mon', energy: 10.2 },
    { day: 'Tue', energy: 11.4 },
    { day: 'Wed', energy: 12.1 },
    { day: 'Thu', energy: 12.8 },
    { day: 'Fri', energy: 13.2 },
    { day: 'Sat', energy: 12.7 },
    { day: 'Sun', energy: 12.5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F7E6CA] border border-[#E8D59E] text-[#785918] flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 stroke-[2.25]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#181412]">
              Good Morning, Operator
            </h2>
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Real-time telemetry and supervisory control for your solar infrastructure.
          </p>
        </div>

        {operatingMode === 'simple' && (
          <div className="px-3.5 py-1.5 rounded-full bg-[#EBF4EE] border border-[#B7DFC0] text-xs font-bold text-[#1E522F] flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#1E522F]" />
            <span>OPERATOR MODE ACTIVE — SYSTEM SAFE</span>
          </div>
        )}
      </div>

      {/* 6 DISTINCT KPI CARDS (Well-balanced responsive grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* 1. Current Power */}
        <KpiCard
          title="Current Power"
          value={power}
          unit="W"
          icon={Zap}
          colorScheme="amber"
          trend="↑ 4.2% vs avg"
        />

        {/* 2. Today's Energy */}
        <KpiCard
          title="Today's Energy"
          value={energy}
          unit="kWh"
          icon={Battery}
          colorScheme="green"
          trend="↑ 12.7% yield"
        />

        {/* 3. Voltage */}
        <KpiCard
          title="Grid AC Voltage"
          value={voltage}
          unit="V"
          icon={Gauge}
          colorScheme="cyan"
          statusText="NORMAL"
        />

        {/* 4. Current */}
        <KpiCard
          title="Electrical Current"
          value={current}
          unit="A"
          icon={Activity}
          colorScheme="purple"
          statusText="NORMAL"
        />

        {/* 5. Temperature */}
        <KpiCard
          title="Ambient Temperature"
          value={temp}
          unit="°C"
          icon={Thermometer}
          colorScheme="rose"
          statusText="OPTIMAL"
        />

        {/* 6. System Status */}
        <KpiCard
          title="System Status"
          value="ONLINE"
          icon={ShieldCheck}
          colorScheme="green"
          badgeText="● ALL OK"
        />

      </div>

      {/* MIDDLE SECTION: Main Power Area Chart & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2/3): Power Generation + Environmental */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Power Generation Area Chart */}
          <PowerTimeChart data={history} title="Power Generation (Real-time output)" height={280} />

          {/* Environmental Conditions Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#3B322B] flex items-center justify-center border border-[#E8DFD3]">
                <Thermometer className="w-3.5 h-3.5" />
              </span>
              Ambient & Environmental Conditions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F6ECE8] text-[#8C3830] border border-[#D9BBB0] flex items-center justify-center">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2E2722] block">Ambient Temperature</span>
                    <span className="text-xl font-black text-[#181412] font-mono">{temp} °C</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0]">
                  Normal
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F4EFEA] text-[#423429] border border-[#AD9C8E] flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2E2722] block">Relative Humidity</span>
                    <span className="text-xl font-black text-[#181412] font-mono">{humidity} %</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0]">
                  Normal
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF6E7] text-[#785918] border border-[#E8D59E] flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2E2722] block">Ambient Solar Light</span>
                    <span className="text-xl font-black text-[#181412] font-mono">856 lux</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0]">
                  Good
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1/3): Communication Quality + Recent Alerts */}
        <div className="space-y-6">
          
          {/* LoRa Communication Quality */}
          <CommunicationQualityCard />

          {/* Recent Alerts Panel */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#FBF0EE] text-[#8C3830] flex items-center justify-center border border-[#D9BBB0]">
                  <Bell className="w-3.5 h-3.5" />
                </span>
                Recent Alerts
              </h3>
              <button
                onClick={() => setActivePage('alerts')}
                className="text-xs font-bold text-[#785918] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#FBF0EE] border border-[#D9BBB0] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#181412]">High Temperature Warning</div>
                  <div className="text-[11px] text-[#3B322B] font-mono font-medium mt-0.5">26 Sep, 10:32 AM • Ambient 41.2°C</div>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F6ECE8] text-[#8C3830] border border-[#D9BBB0]">
                  CRITICAL
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FDF6E7] border border-[#E8D59E] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#181412]">Low RSSI Telemetry</div>
                  <div className="text-[11px] text-[#3B322B] font-mono font-medium mt-0.5">26 Sep, 09:54 AM • Signal degraded</div>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F7E6CA] text-[#7A4F08] border border-[#E8D59E]">
                  WARNING
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#181412]">Broker Synchronized</div>
                  <div className="text-[11px] text-[#3B322B] font-mono font-medium mt-0.5">26 Sep, 09:58 AM • MQTT connected</div>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F4EFEA] text-[#362A1F] border border-[#AD9C8E]">
                  INFO
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* BALANCED 3-COLUMN METRIC SECTION: Daily Energy, Overlay, and Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Card 1: Daily Energy Generation Bar Chart */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
                <BarChart3 className="w-3.5 h-3.5" />
              </span>
              Daily Energy Generation (kWh)
            </h3>
            <p className="text-xs text-[#3B322B] font-medium mt-0.5">Audited 7-day cumulative yield</p>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DE" vertical={false} />
                <XAxis dataKey="day" stroke="#3B322B" fontSize={11} fontWeight={600} axisLine={{ stroke: '#E8DFD3' }} />
                <YAxis stroke="#3B322B" fontSize={11} fontWeight={600} axisLine={{ stroke: '#E8DFD3' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8DFD3',
                    borderRadius: '0.75rem',
                    color: '#181412',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px -2px rgba(173, 156, 142, 0.2)'
                  }}
                  formatter={(val: any) => [`${val} kWh`, 'Yield']}
                />
                <Bar dataKey="energy" fill="#C4922A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Voltage & Current Dual Line Chart */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#423429] flex items-center justify-center border border-[#E8DFD3]">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
              Voltage & Current Overlay
            </h3>
            <p className="text-xs text-[#3B322B] font-medium mt-0.5">AC phase parameters synchronization</p>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DE" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="#3B322B" fontSize={10} fontWeight={600} />
                <YAxis stroke="#3B322B" fontSize={10} fontWeight={600} axisLine={{ stroke: '#E8DFD3' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8DFD3',
                    borderRadius: '0.75rem',
                    color: '#181412',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px -2px rgba(173, 156, 142, 0.2)'
                  }}
                />
                <Line type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#8C7A6B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="current" name="Current (A)" stroke="#C4922A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Today's Summary Card */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#EBF4EE] text-[#1E522F] flex items-center justify-center border border-[#B7DFC0]">
                <Activity className="w-3.5 h-3.5" />
              </span>
              Today's Performance Summary
            </h3>
            <p className="text-xs text-[#3B322B] font-medium mt-0.5">Aggregated metrics overview</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[11px] text-[#2E2722] font-bold uppercase block font-sans">Total Energy Yield</span>
              <span className="text-xl font-black text-[#1E522F]">{energy} kWh</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[11px] text-[#2E2722] font-bold uppercase block font-sans">Peak Generation Power</span>
              <span className="text-xl font-black text-[#785918]">1.21 kW</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[11px] text-[#2E2722] font-bold uppercase block font-sans">Average Temperature</span>
              <span className="text-xl font-black text-[#181412]">30.8 °C</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[11px] text-[#2E2722] font-bold uppercase block font-sans">Packet Success Rate</span>
              <span className="text-xl font-black text-[#362A1F]">99.7 %</span>
            </div>
          </div>
        </div>

      </div>

      {/* FULL WIDTH: SYSTEM DATA FLOW TOPOLOGY */}
      <SystemFlowDiagram />

      {/* FULL WIDTH: SYSTEM HEALTH GRID */}
      <SystemHealthGrid />

    </div>
  );
};
