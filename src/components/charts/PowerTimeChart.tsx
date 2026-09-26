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
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active generation curve measured in Watts (W) over time.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Current</span>
            <span className="font-bold text-amber-400">{currentPower} W</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Peak</span>
            <span className="font-bold text-emerald-400">{maxPower} W</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Average</span>
            <span className="font-bold text-cyan-400">{avgPower} W</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
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
              formatter={(val: any) => [`${val} Watts`, 'Solar Power']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke="#f59e0b"
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
