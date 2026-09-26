import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TelemetryData } from '../../types/system';
import { Radio } from 'lucide-react';

interface RealtimeStreamChartProps {
  latestReading: TelemetryData | null;
}

export const RealtimeStreamChart: React.FC<RealtimeStreamChartProps> = ({ latestReading }) => {
  const [buffer, setBuffer] = useState<TelemetryData[]>([]);

  useEffect(() => {
    if (!latestReading) return;
    setBuffer(prev => {
      const updated = [...prev, latestReading];
      if (updated.length > 25) {
        return updated.slice(updated.length - 25);
      }
      return updated;
    });
  }, [latestReading]);

  const formattedData = buffer.map((item, idx) => {
    const time = new Date(item.timestamp);
    return {
      ...item,
      timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      idx
    };
  });

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            Live Stream Telemetry Buffer (Real-Time)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming directly from ESP32 → SX1278 LoRa → MQTT → WebSocket without page refresh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            ● LIVE STREAM
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              unit="W"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            />
            <Line
              type="monotone"
              dataKey="power"
              name="Power (W)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981' }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="voltage"
              name="Voltage (V)"
              stroke="#38bdf8"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
