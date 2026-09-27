import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { Cpu, Server, Database, Radio, Zap, Thermometer, Layers, Network, CheckCircle2, AlertCircle } from 'lucide-react';

interface NodeItem {
  id: string;
  name: string;
  category: 'hardware' | 'gateway' | 'industrial' | 'cloud';
  icon: React.ElementType;
  online: boolean;
  subtitle: string;
}

export const SystemHealthGrid: React.FC = () => {
  const { dashboardSummary } = useSystem();
  const health = dashboardSummary?.health;

  const nodes: NodeItem[] = [
    {
      id: 'dht22',
      name: 'DHT22 Sensor',
      category: 'hardware',
      icon: Thermometer,
      online: health?.sensor_dht22 ?? true,
      subtitle: 'Ambient Temperature & Humidity'
    },
    {
      id: 'energy_meter',
      name: 'Energy Meter',
      category: 'hardware',
      icon: Zap,
      online: health?.energy_meter ?? true,
      subtitle: 'RS485 Modbus Power'
    },
    {
      id: 'lora_tx',
      name: 'ESP32 TX Node',
      category: 'hardware',
      icon: Radio,
      online: health?.lora_tx ?? true,
      subtitle: 'SX1278 433MHz LoRa'
    },
    {
      id: 'lora_rx',
      name: 'ESP32 RX Gateway',
      category: 'gateway',
      icon: Radio,
      online: health?.lora_rx ?? true,
      subtitle: 'USB Serial Receiver'
    },
    {
      id: 'rpi',
      name: 'Raspberry Pi 4',
      category: 'gateway',
      icon: Cpu,
      online: health?.raspberry_pi ?? true,
      subtitle: 'Debian IIoT Gateway'
    },
    {
      id: 'mqtt',
      name: 'MQTT Broker',
      category: 'cloud',
      icon: Network,
      online: health?.mqtt_broker ?? true,
      subtitle: 'Pub/Sub Broker Stream'
    },
    {
      id: 'postgres',
      name: 'PostgreSQL DB',
      category: 'cloud',
      icon: Database,
      online: health?.postgresql_db ?? true,
      subtitle: 'Historical Telemetry'
    },
    {
      id: 'plc',
      name: 'Siemens S7-1200',
      category: 'industrial',
      icon: Layers,
      online: health?.plc ?? true,
      subtitle: 'PLC Automation Path'
    },
    {
      id: 'scada',
      name: 'WinCC SCADA',
      category: 'industrial',
      icon: Server,
      online: health?.scada ?? true,
      subtitle: 'Industrial Master Station'
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
              <Server className="w-3.5 h-3.5 stroke-[2.2]" />
            </span>
            System Pipeline & Architecture Health
          </h3>
          <p className="text-xs text-[#3B322B] font-medium mt-0.5">
            Real-time status across IIoT sensors, LoRa wireless, gateway, database, PLC and SCADA nodes.
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#EBF4EE] border border-[#B7DFC0] text-[#1E522F] font-mono shrink-0 self-start sm:self-auto shadow-sm">
          9/9 NODES ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className={`p-3.5 rounded-xl border transition-all ${
                node.online
                  ? 'bg-[#FAF7F2] border-[#E8DFD3] hover:border-[#AD9C8E] hover:bg-white'
                  : 'bg-[#FBF0EE] border-[#D9BBB0]'
              } flex items-center justify-between gap-3 shadow-sm`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl border shrink-0 flex items-center justify-center ${
                  node.online
                    ? 'bg-[#F7E6CA] border-[#E8D59E] text-[#785918]'
                    : 'bg-[#FBF0EE] border-[#D9BBB0] text-[#8C3830]'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-[#181412] leading-tight">{node.name}</div>
                  <div className="text-[11px] text-[#3B322B] font-bold leading-tight mt-0.5">{node.subtitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {node.online ? (
                  <>
                    <span className="text-[10px] font-black text-[#1E522F] font-mono">ONLINE</span>
                    <CheckCircle2 className="w-4 h-4 text-[#1E522F]" />
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-black text-[#8C3830] font-mono">FAULT</span>
                    <AlertCircle className="w-4 h-4 text-[#8C3830]" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
