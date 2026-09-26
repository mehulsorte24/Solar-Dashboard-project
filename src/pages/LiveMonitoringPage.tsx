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
    
    const newLog = `[${timeStr}] TELEMETRY PKT #${latestTelemetry.packet_sent || packetCount}: P=${latestTelemetry.power}W, V=${latestTelemetry.voltage}V, I=${latestTelemetry.current}A, T=${latestTelemetry.temperature}°C, RSSI=${latestTelemetry.rssi ?? -26}dBm`;
    
    setLogs(prev => [newLog, ...prev.slice(0, 14)]);
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">
              LIVE TELEMETRY MONITORING
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              ● LIVE STREAM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero-latency WebSocket stream emitting real-time packets directly from LoRa Gateway.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <span>Source: <strong className="text-cyan-400">{dataSource === 'mock' ? 'Simulated Hardware' : 'FastAPI WebSocket'}</strong></span>
          <span>•</span>
          <span>Packets: <strong className="text-emerald-400">{packetCount}</strong></span>
        </div>
      </div>

      {/* Live Stream Scrolling Chart */}
      <RealtimeStreamChart latestReading={latestTelemetry} />

      {/* Real-Time Live Readout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-amber-800/40 bg-amber-950/10">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Power Output
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">{power} W</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Real-time AC</div>
        </div>

        <div className="p-3.5 rounded-xl border border-cyan-800/40 bg-cyan-950/10">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            Grid Voltage
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono mt-1">{voltage} V</div>
          <div className="text-[10px] text-slate-500 mt-0.5">50Hz Modbus</div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-800/40 bg-emerald-950/10">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Current
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{current} A</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Energy Meter</div>
        </div>

        <div className="p-3.5 rounded-xl border border-rose-800/40 bg-rose-950/10">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            Temperature
          </div>
          <div className="text-xl font-bold text-rose-300 font-mono mt-1">{temp} °C</div>
          <div className="text-[10px] text-slate-500 mt-0.5">DHT22 Ambient</div>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-800/40 bg-purple-950/10">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-purple-400" />
            Humidity
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono mt-1">{humidity} %</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Environmental</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            LoRa RSSI
          </div>
          <div className="text-xl font-bold text-slate-200 font-mono mt-1">{rssi} dBm</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">SNR: {snr} dB</div>
        </div>
      </div>

      {/* Live Connection Diagnostics & Real-Time Console Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Link Specs */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Wireless Telemetry Link
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Transmitter Device:</span>
              <span className="text-cyan-300 font-bold">ESP32-S3 (TX001)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Receiver Gateway:</span>
              <span className="text-cyan-300 font-bold">ESP32-S3 (RX001)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">LoRa Frequency:</span>
              <span className="text-slate-200">433 MHz SX1278</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Packet Success Rate:</span>
              <span className="text-emerald-400 font-bold">{(100 - loss).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Broker Stream:</span>
              <span className="text-purple-300 font-bold">solar/TX001/telemetry</span>
            </div>
          </div>
        </div>

        {/* Live Packet Console */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-md space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Real-Time Packet Stream Log
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">AUTO-SCROLLING</span>
          </div>

          <div className="h-52 overflow-y-auto font-mono text-[11px] bg-black/80 p-3 rounded-xl border border-slate-800 space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-emerald-400 hover:text-emerald-300">
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
