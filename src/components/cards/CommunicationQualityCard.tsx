import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { Radio, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { evaluateCommStatus, getCommStatusColor } from '../../config/thresholds';

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
  const badgeStyle = getCommStatusColor(commStatus);

  return (
    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              LoRa Communication Quality
            </span>
          </div>
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeStyle}`}>
            🟢 {commStatus}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Stable Connection</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            SX1278 433MHz Wireless telemetry link active between ESP32 Transmitter & Receiver Gateway.
          </p>
        </div>
      </div>

      {/* Technical Mode or Expandable Details */}
      {(operatingMode === 'technical' || showTechnicalDetails) && (
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">LoRa RSSI</span>
              <span className="font-bold text-cyan-300">{rssi} dBm</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">LoRa SNR</span>
              <span className="font-bold text-purple-300">{snr} dB</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Packet Loss</span>
              <span className="font-bold text-emerald-400">{loss}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Packets Sent</span>
              <span className="text-slate-300">{sent}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Packets Recv</span>
              <span className="text-slate-300">{received}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Success Rate</span>
              <span className="text-emerald-400 font-bold">{successRate}%</span>
            </div>
          </div>
        </div>
      )}

      {operatingMode === 'simple' && (
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="mt-3 pt-2 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center justify-between border-t border-slate-800/60"
        >
          <span>{showTechnicalDetails ? 'Hide Technical RF Details' : 'View Technical Details'}</span>
          {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
