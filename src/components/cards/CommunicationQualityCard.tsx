import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { Radio, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { evaluateCommStatus } from '../../config/thresholds';

export const CommunicationQualityCard: React.FC = () => {
  const { latestTelemetry, operatingMode } = useSystem();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const rssi = latestTelemetry?.rssi ?? -26;
  const snr = latestTelemetry?.snr ?? 9.75;
  const sent = latestTelemetry?.packet_sent ?? 1420;
  const received = latestTelemetry?.packet_received ?? 1418;
  const loss = latestTelemetry?.packet_loss ?? 0.14;
  const successRate = (100 - loss).toFixed(2);

  const commStatus = evaluateCommStatus(rssi, snr);

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
              <Radio className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#181412] uppercase tracking-wider">
              LoRa Communication Quality
            </span>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0]">
            ● {commStatus}
          </span>
        </div>

        <div className="mt-3.5">
          <div className="text-base font-black text-[#181412] flex items-center gap-2">
            <span>Stable Wireless Link</span>
            <ShieldCheck className="w-4 h-4 text-[#1E522F]" />
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1 leading-relaxed">
            SX1278 433MHz wireless telemetry link actively streaming from ESP32 Transmitter node to Gateway.
          </p>
        </div>
      </div>

      {/* Technical Mode or Expandable Details */}
      {(operatingMode === 'technical' || showTechnicalDetails) && (
        <div className="mt-4 pt-3.5 border-t border-[#E8DFD3] space-y-2 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD3]">
            <div>
              <span className="text-[10px] text-[#2E2722] uppercase block font-sans font-bold">Signal Strength (RSSI)</span>
              <span className="font-black text-[#181412]">{rssi} dBm</span>
            </div>
            <div>
              <span className="text-[10px] text-[#2E2722] uppercase block font-sans font-bold">Signal-to-Noise (SNR)</span>
              <span className="font-black text-[#362A1F]">{snr} dB</span>
            </div>
            <div>
              <span className="text-[10px] text-[#2E2722] uppercase block font-sans font-bold">Packet Loss Rate</span>
              <span className="font-black text-[#1E522F]">{loss}%</span>
            </div>
            <div>
              <span className="text-[10px] text-[#2E2722] uppercase block font-sans font-bold">Packets Sent</span>
              <span className="text-[#181412] font-bold">{sent}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#2E2722] uppercase block font-sans font-bold">Packets Received</span>
              <span className="text-[#181412] font-bold">{received}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#2E2722] uppercase block font-sans font-bold">Packet Success Rate</span>
              <span className="text-[#1E522F] font-black">{successRate}%</span>
            </div>
          </div>
        </div>
      )}

      {operatingMode === 'simple' && (
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="mt-3 pt-2.5 text-[11px] font-bold text-[#785918] hover:text-[#4F390D] flex items-center justify-between border-t border-[#E8DFD3] transition"
        >
          <span>{showTechnicalDetails ? 'Hide Technical RF Details' : 'View Technical Details'}</span>
          {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
