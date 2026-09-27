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
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#362A1F] flex items-center justify-center border border-[#E8DFD3]">
              <Cpu className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#181412] uppercase">
              HARDWARE & DEVICE INVENTORY
            </h2>
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Status monitoring for ESP32 Nodes, SX1278 LoRa Module, Raspberry Pi Gateway, Siemens PLC & SCADA.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs font-mono text-[#181412] shadow-sm font-bold">
          Total Hardware Nodes: <strong className="text-[#1E522F] font-black">{devices.length} ONLINE</strong>
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
              className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F7E6CA] border border-[#E8D59E] text-[#785918] flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#181412]">{device.device_name}</h3>
                      <span className="text-[10px] font-mono font-bold text-[#785918]">{device.device_id}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0] flex items-center gap-1 font-mono shadow-xs">
                    <CheckCircle2 className="w-3 h-3 stroke-[2.2]" /> ONLINE
                  </span>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-[#E8DFD3] space-y-1.5 text-xs text-[#2E2722]">
                  <div className="flex justify-between">
                    <span className="font-bold">Location:</span>
                    <span className="text-[#181412] font-black">{device.location}</span>
                  </div>
                  {device.ip_address && (
                    <div className="flex justify-between font-mono">
                      <span className="font-bold">IP Address:</span>
                      <span className="text-[#181412] font-black">{device.ip_address}</span>
                    </div>
                  )}
                  {device.firmware_version && (
                    <div className="flex justify-between font-mono">
                      <span className="font-bold">Firmware:</span>
                      <span className="text-[#3B322B] font-bold">{device.firmware_version}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hardware Metrics Subcard with Dark Bold Text */}
              {device.metrics && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] grid grid-cols-2 gap-2.5 text-xs font-mono">
                  {device.metrics.rssi !== undefined && (
                    <div>
                      <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">Signal Strength (RSSI)</span>
                      <span className="text-[#181412] font-black">{device.metrics.rssi} dBm</span>
                    </div>
                  )}
                  {device.metrics.snr !== undefined && (
                    <div>
                      <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">Signal-to-Noise Ratio (SNR)</span>
                      <span className="text-[#362A1F] font-black">{device.metrics.snr} dB</span>
                    </div>
                  )}
                  {device.metrics.cpu_temp !== undefined && (
                    <div>
                      <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">CPU Temperature</span>
                      <span className="text-[#7A4F08] font-black">{device.metrics.cpu_temp} °C</span>
                    </div>
                  )}
                  {device.metrics.cpu_usage !== undefined && (
                    <div>
                      <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">CPU Processor Load</span>
                      <span className="text-[#1E522F] font-black">{device.metrics.cpu_usage}%</span>
                    </div>
                  )}
                  {device.metrics.uptime_hours !== undefined && (
                    <div className="col-span-2 pt-1 border-t border-[#E8DFD3]/60">
                      <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">System Uptime</span>
                      <span className="text-[#181412] font-black">{device.metrics.uptime_hours} hours continuous</span>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[10px] text-[#3B322B] font-mono font-bold flex items-center justify-between border-t border-[#E8DFD3] pt-2.5">
                <span>Last Seen:</span>
                <span>{new Date(device.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
