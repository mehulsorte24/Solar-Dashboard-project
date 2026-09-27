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
    <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#EBF4EE] text-[#1E522F] flex items-center justify-center border border-[#B7DFC0]">
              <Radio className="w-3.5 h-3.5 animate-pulse stroke-[2.2]" />
            </span>
            Live Stream Telemetry Buffer (Real-Time)
          </h3>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Streaming directly from ESP32 → SX1278 LoRa → MQTT → WebSocket without page refresh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#EBF4EE] border border-[#B7DFC0] text-[#1E522F] flex items-center gap-1.5 font-mono shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#1E522F] animate-ping" />
            ● LIVE STREAM
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DE" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#3B322B"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E8DFD3' }}
            />
            <YAxis
              stroke="#3B322B"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E8DFD3' }}
              unit="W"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8DFD3',
                borderRadius: '0.75rem',
                color: '#181412',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                boxShadow: '0 4px 20px -2px rgba(173, 156, 142, 0.25)'
              }}
            />
            <Line
              type="monotone"
              dataKey="power"
              name="Power (W)"
              stroke="#C4922A"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#C4922A' }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="voltage"
              name="Voltage (V)"
              stroke="#8C7A6B"
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
