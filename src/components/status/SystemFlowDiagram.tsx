import React from 'react';
import { Sun, Zap, Radio, Cpu, Database, LayoutDashboard, Layers, Network } from 'lucide-react';

export const SystemFlowDiagram: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl border border-[#162238] bg-[#0b1426] backdrop-blur-md shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Network className="w-4 h-4 text-cyan-400" />
          System Data Flow Topology
        </h3>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
          END-TO-END PIPELINE
        </span>
      </div>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 items-center text-center font-mono text-[10px]">
        
        {/* Node 1: Solar Panel */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-amber-500/30 flex flex-col items-center gap-1.5 shadow">
          <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <span className="font-bold text-slate-200">Solar Panel</span>
          <span className="text-slate-500 text-[9px]">Array Output</span>
        </div>

        {/* Node 2: Energy Meter */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-cyan-500/30 flex flex-col items-center gap-1.5 shadow">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-slate-200">Energy Meter</span>
          <span className="text-cyan-400 text-[9px]">+ Modbus RS485</span>
        </div>

        {/* Node 3: ESP32 TX */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-emerald-500/30 flex flex-col items-center gap-1.5 shadow">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">ESP32 TX</span>
          <span className="text-emerald-400 text-[9px]">+ SX1278 LoRa</span>
        </div>

        {/* Node 4: ESP32 RX */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-emerald-500/30 flex flex-col items-center gap-1.5 shadow">
          <Radio className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-slate-200">ESP32 RX</span>
          <span className="text-slate-500 text-[9px]">Gateway Serial</span>
        </div>

        {/* Node 5: Raspberry Pi */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-purple-500/30 flex flex-col items-center gap-1.5 shadow">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-slate-200">Raspberry Pi</span>
          <span className="text-purple-300 text-[9px]">MQTT Broker</span>
        </div>

        {/* Node 6: Siemens PLC */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-blue-500/30 flex flex-col items-center gap-1.5 shadow">
          <Layers className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-slate-200">Siemens PLC</span>
          <span className="text-blue-300 text-[9px]">S7-1200 SCADA</span>
        </div>

        {/* Node 7: PostgreSQL DB */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-cyan-500/30 flex flex-col items-center gap-1.5 shadow">
          <Database className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-slate-200">PostgreSQL</span>
          <span className="text-slate-500 text-[9px]">Timeseries DB</span>
        </div>

        {/* Node 8: Web Dashboard */}
        <div className="p-2.5 rounded-xl bg-[#070c18] border border-emerald-500/40 flex flex-col items-center gap-1.5 shadow">
          <LayoutDashboard className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-emerald-300">Web Dashboard</span>
          <span className="text-emerald-400 text-[9px]">React + WS</span>
        </div>

      </div>
    </div>
  );
};
