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
  const { dashboardSummary, latestTelemetry, operatingMode } = useSystem();
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

  // Mock bar data for daily energy generation
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
      
      {/* Greeting Banner (Matching Image 1) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100">
              Good Morning, Operator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Here's what's happening with your solar system today.
          </p>
        </div>

        {operatingMode === 'simple' && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>🟢 OPERATOR MODE ACTIVE — SYSTEM SAFE</span>
          </div>
        )}
      </div>

      {/* 6 DISTINCT KPI CARDS (Matching Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* 1. Current Power */}
        <KpiCard
          title="Current Power"
          value={power}
          unit="W"
          icon={Zap}
          colorScheme="green"
          trend="↑ 4.2% vs yesterday"
        />

        {/* 2. Today's Energy */}
        <KpiCard
          title="Today's Energy"
          value={energy}
          unit="kWh"
          icon={Battery}
          colorScheme="amber"
          trend="↑ 12.7% vs yesterday"
        />

        {/* 3. Voltage */}
        <KpiCard
          title="Voltage"
          value={voltage}
          unit="V"
          icon={Gauge}
          colorScheme="cyan"
          statusText="NORMAL"
        />

        {/* 4. Current */}
        <KpiCard
          title="Current"
          value={current}
          unit="A"
          icon={Activity}
          colorScheme="purple"
          statusText="NORMAL"
        />

        {/* 5. Temperature */}
        <KpiCard
          title="Temperature"
          value={temp}
          unit="°C"
          icon={Thermometer}
          colorScheme="rose"
          statusText="NORMAL"
        />

        {/* 6. System Status */}
        <KpiCard
          title="System Status"
          value="ONLINE"
          icon={ShieldCheck}
          colorScheme="green"
          badgeText="● ONLINE"
        />

      </div>

      {/* MIDDLE SECTION: Charts & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3): Power Generation + Environmental */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Power Generation Area Chart */}
          <PowerTimeChart data={history} title="Power Generation (Real-time power output)" height={280} />

          {/* Environmental Conditions Card */}
          <div className="p-5 rounded-2xl border border-[#162238] bg-[#0b1426] backdrop-blur-md shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              Environmental Conditions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[#070c18] border border-rose-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Temperature</span>
                    <span className="text-lg font-bold text-slate-100 font-mono">{temp} °C</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Normal
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070c18] border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Humidity</span>
                    <span className="text-lg font-bold text-slate-100 font-mono">{humidity} %</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Normal
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070c18] border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Ambient Light</span>
                    <span className="text-lg font-bold text-slate-100 font-mono">856 lux</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
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

          {/* Recent Alerts Panel (Matching Image 1) */}
          <div className="p-5 rounded-2xl border border-[#162238] bg-[#0b1426] backdrop-blur-md shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Bell className="w-4 h-4 text-rose-400" />
                Recent Alerts
              </h3>
              <span className="text-[11px] text-cyan-400 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-[#070c18] border border-rose-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">High Temperature</div>
                  <div className="text-[10px] text-slate-500 font-mono">26 Sep, 10:32 AM • Ambient 41.2°C</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-950 text-rose-300 border border-rose-800">
                  CRITICAL
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#070c18] border border-amber-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">Low Communication</div>
                  <div className="text-[10px] text-slate-500 font-mono">26 Sep, 09:54 AM • LoRa signal degraded</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-800">
                  WARNING
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#070c18] border border-cyan-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">System Recovered</div>
                  <div className="text-[10px] text-slate-500 font-mono">26 Sep, 09:58 AM • MQTT reconnected</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  INFO
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Energy Generation & Voltage Line + Today Summary & Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3): Daily Energy Bar Chart & Voltage/Current Dual Line */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Daily Energy Generation Bar Chart */}
            <div className="p-5 rounded-2xl border border-[#162238] bg-[#0b1426] shadow-lg">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Energy Generation (Daily kWh)
              </h3>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162238" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} axisLine={{ stroke: '#162238' }} />
                    <YAxis stroke="#64748b" fontSize={11} axisLine={{ stroke: '#162238' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#070c18', borderColor: '#162238', color: '#f8fafc', fontSize: '11px' }} />
                    <Bar dataKey="energy" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Voltage & Current Dual Line Chart */}
            <div className="p-5 rounded-2xl border border-[#162238] bg-[#0b1426] shadow-lg">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Voltage & Current Overlay
              </h3>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162238" vertical={false} />
                    <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#070c18', borderColor: '#162238', color: '#f8fafc', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="current" name="Current (A)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* System Data Flow Topology */}
          <SystemFlowDiagram />

        </div>

        {/* Right Column (1/3): Today's Summary & System Health Grid */}
        <div className="space-y-6">
          
          {/* Today's Summary Card */}
          <div className="p-5 rounded-2xl border border-[#162238] bg-[#0b1426] shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-emerald-400" />
              Today's Performance Summary
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#070c18] border border-[#162238]">
                <span className="text-[10px] text-slate-400 block">Total Energy</span>
                <span className="text-lg font-bold text-emerald-400">{energy} kWh</span>
              </div>
              <div className="p-3 rounded-xl bg-[#070c18] border border-[#162238]">
                <span className="text-[10px] text-slate-400 block">Peak Power</span>
                <span className="text-lg font-bold text-amber-400">1.21 kW</span>
              </div>
              <div className="p-3 rounded-xl bg-[#070c18] border border-[#162238]">
                <span className="text-[10px] text-slate-400 block">Avg Temperature</span>
                <span className="text-lg font-bold text-slate-100">30.8 °C</span>
              </div>
              <div className="p-3 rounded-xl bg-[#070c18] border border-[#162238]">
                <span className="text-[10px] text-slate-400 block">Packet Success</span>
                <span className="text-lg font-bold text-cyan-300">99.7 %</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FULL WIDTH: SYSTEM HEALTH GRID */}
      <SystemHealthGrid />

    </div>
  );
};
