import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { TelemetryData } from '../../types/system';
import { SlidersHorizontal, Eye } from 'lucide-react';

interface MultiParameterChartProps {
  data: TelemetryData[];
}

type ParameterKey = 'power' | 'voltage' | 'current' | 'temperature' | 'humidity';

interface ParamConfig {
  key: ParameterKey;
  label: string;
  unit: string;
  color: string;
  yAxisId: 'left' | 'right';
}

const PARAM_CONFIGS: ParamConfig[] = [
  { key: 'voltage', label: 'Voltage', unit: 'V', color: '#38bdf8', yAxisId: 'left' },
  { key: 'current', label: 'Current', unit: 'A', color: '#34d399', yAxisId: 'right' },
  { key: 'power', label: 'Power', unit: 'W', color: '#fbbf24', yAxisId: 'left' },
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#f87171', yAxisId: 'right' },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#a78bfa', yAxisId: 'right' },
];

export const MultiParameterChart: React.FC<MultiParameterChartProps> = ({ data }) => {
  const [selectedParams, setSelectedParams] = useState<Record<ParameterKey, boolean>>({
    voltage: true,
    current: true,
    power: false,
    temperature: false,
    humidity: false,
  });

  const toggleParam = (key: ParameterKey) => {
    setSelectedParams(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formattedData = data.map(item => {
    const time = new Date(item.timestamp);
    return {
      ...item,
      timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });

  const activeConfigs = PARAM_CONFIGS.filter(p => selectedParams[p.key]);

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg flex flex-col justify-between">
      
      {/* Controls & Checkboxes */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            Dynamic Multi-Parameter Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select parameters below to overlay electrical & environmental telemetry.
          </p>
        </div>

        {/* Checkbox Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {PARAM_CONFIGS.map(param => (
            <label
              key={param.key}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                selectedParams[param.key]
                  ? 'bg-slate-800 border-slate-700 text-slate-100 shadow-sm'
                  : 'bg-slate-950/60 border-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedParams[param.key]}
                onChange={() => toggleParam(param.key)}
                className="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <span style={{ color: selectedParams[param.key] ? param.color : undefined }}>
                {param.label} ({param.unit})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 320 }}>
        {activeConfigs.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 gap-2">
            <Eye className="w-6 h-6 text-slate-600" />
            <span className="text-xs">Select at least one parameter above to view graph.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
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
                labelFormatter={(label) => `Timestamp: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {PARAM_CONFIGS.map(param => {
                if (!selectedParams[param.key]) return null;
                return (
                  <Line
                    key={param.key}
                    yAxisId={param.yAxisId}
                    type="monotone"
                    dataKey={param.key}
                    name={`${param.label} (${param.unit})`}
                    stroke={param.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
