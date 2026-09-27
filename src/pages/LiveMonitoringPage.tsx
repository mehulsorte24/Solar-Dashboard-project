import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { RealtimeStreamChart } from '../components/charts/RealtimeStreamChart';
import { Radio, Activity, Zap, Gauge, Thermometer, Droplets, Shield, Clock, Wifi } from 'lucide-react';

export const LiveMonitoringPage: React.FC = () => {
  const { latestTelemetry, dataSource } = useSystem();
  const [packetCount, setPacketCount] = useState<number>(1420);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!latestTelemetry) return;
    setPacketCount(prev => prev + 1);
    const timeStr = new Date(latestTelemetry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    
    const newLog = `[${timeStr}] TELEMETRY PACKET #${latestTelemetry.packet_sent || packetCount}: Power=${latestTelemetry.power}W, Voltage=${latestTelemetry.voltage}V, Current=${latestTelemetry.current}A, Temperature=${latestTelemetry.temperature}°C, RSSI=${latestTelemetry.rssi ?? -26}dBm`;
    
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
  }, [latestTelemetry]);

  const power = latestTelemetry?.power ?? 966;
  const voltage = latestTelemetry?.voltage ?? 230.4;
  const current = latestTelemetry?.current ?? 4.19;
  const temp = latestTelemetry?.temperature ?? 31.0;
  const humidity = latestTelemetry?.humidity ?? 77.8;
  const rssi = latestTelemetry?.rssi ?? -26;
  const snr = latestTelemetry?.snr ?? 9.75;
  const loss = latestTelemetry?.packet_loss ?? 0.14;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#1E522F] flex items-center justify-center border border-[#B7DFC0]">
              <Radio className="w-4 h-4 animate-pulse stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#181412] uppercase">
              LIVE TELEMETRY MONITORING
            </h2>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0] flex items-center gap-1.5 font-mono shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#1E522F] animate-ping" />
              ● LIVE STREAM
            </span>
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Zero-latency stream transmitting real-time packets directly from LoRa Gateway to web SCADA.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#2E2722] bg-[#FAF7F2] px-4 py-2.5 rounded-xl border border-[#E8DFD3] shadow-sm font-bold">
          <span>Source: <strong className="text-[#785918]">{dataSource === 'mock' ? 'Simulated Hardware' : 'FastAPI WebSocket'}</strong></span>
          <span>•</span>
          <span>Packets: <strong className="text-[#1E522F]">{packetCount}</strong></span>
        </div>
      </div>

      {/* Live Stream Scrolling Chart */}
      <RealtimeStreamChart latestReading={latestTelemetry} />

      {/* Real-Time Live Readout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="text-xs font-bold text-[#2E2722] flex items-center gap-1.5 uppercase">
            <Zap className="w-3.5 h-3.5 text-[#785918]" />
            Solar Power Output
          </div>
          <div className="text-2xl font-black text-[#181412] font-mono mt-1">{power} W</div>
          <div className="text-[11px] text-[#3B322B] font-bold mt-0.5">Real-time AC</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="text-xs font-bold text-[#2E2722] flex items-center gap-1.5 uppercase">
            <Gauge className="w-3.5 h-3.5 text-[#362A1F]" />
            Grid AC Voltage
          </div>
          <div className="text-2xl font-black text-[#181412] font-mono mt-1">{voltage} V</div>
          <div className="text-[11px] text-[#3B322B] font-bold mt-0.5">50Hz Modbus</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="text-xs font-bold text-[#2E2722] flex items-center gap-1.5 uppercase">
            <Activity className="w-3.5 h-3.5 text-[#1E522F]" />
            Electrical Current
          </div>
          <div className="text-2xl font-black text-[#181412] font-mono mt-1">{current} A</div>
          <div className="text-[11px] text-[#3B322B] font-bold mt-0.5">Energy Meter</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="text-xs font-bold text-[#2E2722] flex items-center gap-1.5 uppercase">
            <Thermometer className="w-3.5 h-3.5 text-[#8C3830]" />
            Ambient Temperature
          </div>
          <div className="text-2xl font-black text-[#181412] font-mono mt-1">{temp} °C</div>
          <div className="text-[11px] text-[#3B322B] font-bold mt-0.5">DHT22 Ambient</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="text-xs font-bold text-[#2E2722] flex items-center gap-1.5 uppercase">
            <Droplets className="w-3.5 h-3.5 text-[#362A1F]" />
            Relative Humidity
          </div>
          <div className="text-2xl font-black text-[#181412] font-mono mt-1">{humidity} %</div>
          <div className="text-[11px] text-[#3B322B] font-bold mt-0.5">Environmental</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="text-xs font-bold text-[#2E2722] flex items-center gap-1.5 uppercase">
            <Wifi className="w-3.5 h-3.5 text-[#785918]" />
            Signal Strength (RSSI)
          </div>
          <div className="text-2xl font-black text-[#181412] font-mono mt-1">{rssi} dBm</div>
          <div className="text-[11px] text-[#1E522F] mt-0.5 font-mono font-bold">SNR: {snr} dB</div>
        </div>
      </div>

      {/* Live Connection Diagnostics & Real-Time Console Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Connection Link Specs */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#EBF4EE] text-[#1E522F] flex items-center justify-center border border-[#B7DFC0]">
                <Shield className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              Wireless Telemetry Link
            </h3>
            <p className="text-xs text-[#3B322B] font-medium mt-0.5">RF hardware operational state</p>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[#3B322B] font-bold">Transmitter Device:</span>
              <span className="text-[#181412] font-black">ESP32-S3 (TX001)</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[#3B322B] font-bold">Receiver Gateway:</span>
              <span className="text-[#181412] font-black">ESP32-S3 (RX001)</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[#3B322B] font-bold">LoRa Frequency:</span>
              <span className="text-[#181412] font-bold">433 MHz SX1278</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[#3B322B] font-bold">Packet Success Rate:</span>
              <span className="text-[#1E522F] font-black">{(100 - loss).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
              <span className="text-[#3B322B] font-bold">Broker Stream:</span>
              <span className="text-[#785918] font-black">solar/TX001/telemetry</span>
            </div>
          </div>
        </div>

        {/* Live Packet Console */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#362A1F] flex items-center justify-center border border-[#E8DFD3]">
                <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              Real-Time Packet Stream Log
            </h3>
            <span className="text-[10px] text-[#181412] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFD3]">
              AUTO-STREAMING
            </span>
          </div>

          <div className="h-60 overflow-y-auto font-mono text-[11px] bg-[#1C1815] p-4 rounded-xl border border-[#3D352F] space-y-1.5 shadow-inner">
            {logs.map((log, index) => (
              <div key={index} className="text-[#E8D59E] hover:text-white transition leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
