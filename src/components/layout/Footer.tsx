import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 px-4 py-3 text-xs text-slate-500">
      <div className="max-w-7xl mx-mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Architecture Pipeline:</span>
          <span className="font-mono text-[11px] text-slate-500">
            ESP32-S3 → SX1278 LoRa → RPi Gateway → MQTT → FastAPI → PostgreSQL → WebSocket → React UI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-mono">
            PLC Siemens S7-1200
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-purple-400 font-mono">
            SCADA Master Node
          </span>
        </div>
      </div>
    </footer>
  );
};
