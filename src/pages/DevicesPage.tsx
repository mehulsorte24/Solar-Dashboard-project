import React, { useState, useEffect } from 'react';
import type { DeviceInfo } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { Cpu, Radio, Server, Layers, Zap, Thermometer, Terminal, CheckCircle2 } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);

  useEffect(() => {
    dataAdapter.getDevices().then(setDevices);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">
              HARDWARE & DEVICE INVENTORY
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Status monitoring for ESP32 Nodes, SX1278 LoRa Module, Raspberry Pi Gateway, Siemens PLC & SCADA.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
          Total Hardware Nodes: <strong>{devices.length} ONLINE</strong>
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => {
          let Icon = Cpu;
          if (device.device_type === 'TRANSMITTER' || device.device_type === 'RECEIVER') Icon = Radio;
          if (device.device_type === 'GATEWAY') Icon = Server;
          if (device.device_type === 'PLC') Icon = Layers;
          if (device.device_type === 'SCADA') Icon = Terminal;
          if (device.device_type === 'ENERGY_METER') Icon = Zap;
          if (device.device_type === 'DHT22') Icon = Thermometer;

          return (
            <div
              key={device.device_id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{device.device_name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400">{device.device_id}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> ONLINE
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-slate-200 font-medium">{device.location}</span>
                  </div>
                  {device.ip_address && (
                    <div className="flex justify-between font-mono">
                      <span>IP Address:</span>
                      <span className="text-cyan-300">{device.ip_address}</span>
                    </div>
                  )}
                  {device.firmware_version && (
                    <div className="flex justify-between font-mono">
                      <span>Firmware:</span>
                      <span className="text-slate-300">{device.firmware_version}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hardware Metrics Subcard */}
              {device.metrics && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  {device.metrics.rssi !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">LoRa RSSI</span>
                      <span className="text-cyan-300 font-bold">{device.metrics.rssi} dBm</span>
                    </div>
                  )}
                  {device.metrics.snr !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">LoRa SNR</span>
                      <span className="text-purple-300 font-bold">{device.metrics.snr} dB</span>
                    </div>
                  )}
                  {device.metrics.cpu_temp !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">CPU Temp</span>
                      <span className="text-amber-400 font-bold">{device.metrics.cpu_temp} °C</span>
                    </div>
                  )}
                  {device.metrics.cpu_usage !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">CPU Load</span>
                      <span className="text-emerald-400 font-bold">{device.metrics.cpu_usage}%</span>
                    </div>
                  )}
                  {device.metrics.uptime_hours !== undefined && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase block">System Uptime</span>
                      <span className="text-slate-300">{device.metrics.uptime_hours} hours continuous</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60 pt-2">
                <span>Last Seen:</span>
                <span>{new Date(device.last_seen).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
