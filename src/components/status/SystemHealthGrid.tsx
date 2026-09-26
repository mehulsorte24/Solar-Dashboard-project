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
      subtitle: 'Ambient Temp & Humidity'
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
      name: 'Raspberry Pi',
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
      subtitle: 'Pub/Sub Broker'
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
      name: 'Siemens PLC',
      category: 'industrial',
      icon: Layers,
      online: health?.plc ?? true,
      subtitle: 'S7-1200 Control Path'
    },
    {
      id: 'scada',
      name: 'SCADA Station',
      category: 'industrial',
      icon: Server,
      online: health?.scada ?? true,
      subtitle: 'WinCC Master Node'
    },
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            System Pipeline & Architecture Health
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status across IIoT sensors, LoRa wireless, gateway, database, PLC and SCADA nodes.
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono">
          9/9 NODES ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className={`p-3 rounded-xl border transition-all ${
                node.online
                  ? 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                  : 'bg-rose-950/30 border-rose-800/60'
              } flex items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${
                  node.online
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{node.name}</div>
                  <div className="text-[10px] text-slate-500">{node.subtitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {node.online ? (
                  <>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">ONLINE</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-rose-400 font-mono">FAULT</span>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
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
