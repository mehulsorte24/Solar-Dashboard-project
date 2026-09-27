import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E8DFD3] px-4 py-3.5 text-xs text-[#2E2722] shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
          <span className="font-black text-[#181412]">Architecture Pipeline:</span>
          <span className="font-mono text-[11px] text-[#3B322B] font-bold">
            ESP32-S3 → SX1278 LoRa → RPi Gateway → MQTT → FastAPI → PostgreSQL → WebSocket → React UI
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] text-[10px] text-[#362A1F] font-mono font-bold">
            PLC Siemens S7-1200
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F7E6CA] border border-[#E8D59E] text-[10px] text-[#785918] font-mono font-bold">
            WinCC SCADA Master
          </span>
        </div>
      </div>
    </footer>
  );
};
