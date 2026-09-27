import React from 'react';
import { Sun, Zap, Radio, Cpu, Database, LayoutDashboard, Layers, Network, ArrowRight } from 'lucide-react';

export const SystemFlowDiagram: React.FC = () => {
  const steps = [
    { title: 'Solar Array', sub: 'PV DC Generation', icon: Sun, color: 'text-[#785918]', bg: 'bg-[#FDF6E7]', border: 'border-[#E8D59E]' },
    { title: 'Energy Meter', sub: 'RS485 Modbus AC', icon: Zap, color: 'text-[#785918]', bg: 'bg-[#F7E6CA]', border: 'border-[#E8D59E]' },
    { title: 'ESP32 TX Node', sub: 'SX1278 433MHz LoRa', icon: Radio, color: 'text-[#1E522F]', bg: 'bg-[#EBF4EE]', border: 'border-[#B7DFC0]' },
    { title: 'ESP32 RX Node', sub: 'USB Serial Gateway', icon: Radio, color: 'text-[#362A1F]', bg: 'bg-[#F4EFEA]', border: 'border-[#AD9C8E]' },
    { title: 'Raspberry Pi 4', sub: 'Local MQTT Broker', icon: Cpu, color: 'text-[#423429]', bg: 'bg-[#FAF7F2]', border: 'border-[#E8DFD3]' },
    { title: 'Siemens PLC', sub: 'S7-1200 Automation', icon: Layers, color: 'text-[#362A1F]', bg: 'bg-[#F4EFEA]', border: 'border-[#AD9C8E]' },
    { title: 'PostgreSQL DB', sub: 'Audited Telemetry', icon: Database, color: 'text-[#785918]', bg: 'bg-[#F7E6CA]', border: 'border-[#E8D59E]' },
    { title: 'Web SCADA', sub: 'Real-Time React WS', icon: LayoutDashboard, color: 'text-[#1E522F]', bg: 'bg-[#EBF4EE]', border: 'border-[#B7DFC0]' },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
              <Network className="w-3.5 h-3.5 stroke-[2.2]" />
            </span>
            End-to-End System Data Flow Pipeline
          </h3>
          <p className="text-xs text-[#3B322B] font-medium mt-0.5">
            Architecture telemetry stream from physical solar panels to cloud dashboard and industrial SCADA.
          </p>
        </div>
        <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#FAF7F2] text-[#181412] border border-[#E8DFD3] font-mono shrink-0 self-start sm:self-auto shadow-xs">
          FULL PIPELINE ACTIVE
        </span>
      </div>

      {/* Visual Flow Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 items-stretch text-center font-sans">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl ${step.bg} border ${step.border} flex flex-col items-center justify-between gap-2 shadow-sm transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold text-[#3B322B]">
                <span>0{idx + 1}</span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[#3B322B] hidden lg:block opacity-60" />
                )}
              </div>

              <div className={`w-8 h-8 rounded-xl bg-white border border-[#E8DFD3] ${step.color} flex items-center justify-center shadow-xs`}>
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>

              <div>
                <span className="font-black text-[#181412] text-xs block leading-tight">
                  {step.title}
                </span>
                <span className="text-[#2E2722] text-[10px] font-bold block mt-0.5 leading-tight">
                  {step.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
