import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TelemetryData } from '../../types/system';
import { Zap } from 'lucide-react';

interface PowerTimeChartProps {
  data: TelemetryData[];
  title?: string;
  height?: number;
}

export const PowerTimeChart: React.FC<PowerTimeChartProps> = ({
  data,
  title = "Solar Power Output vs Time",
  height = 300,
}) => {
  const formattedData = data.map(item => {
    const time = new Date(item.timestamp);
    return {
      ...item,
      timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });

  const powers = data.map(d => d.power);
  const maxPower = powers.length ? Math.max(...powers) : 0;
  const avgPower = powers.length ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : 0;
  const currentPower = data.length ? data[data.length - 1].power : 0;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
              <Zap className="w-3.5 h-3.5 stroke-[2.2]" />
            </span>
            {title}
          </h3>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Active generation curve measured in Watts (W) over time.
          </p>
        </div>

        {/* Stats Pills with Dark, High Contrast Text */}
        <div className="flex items-center gap-2.5 font-mono text-xs flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">Current</span>
            <span className="font-black text-[#785918] text-sm">{currentPower} W</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">Peak</span>
            <span className="font-black text-[#1E522F] text-sm">{maxPower} W</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-[10px] text-[#2E2722] font-bold uppercase block font-sans">Average</span>
            <span className="font-black text-[#362A1F] text-sm">{avgPower} W</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8D59E" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#FAF7F2" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DE" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#3B322B"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E8DFD3' }}
            />
            <YAxis
              stroke="#3B322B"
              fontSize={11}
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
              formatter={(val: any) => [`${val} Watts`, 'Solar Power']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke="#C4922A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#powerGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
