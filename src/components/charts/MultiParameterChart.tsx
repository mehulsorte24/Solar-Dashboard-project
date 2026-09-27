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
  { key: 'voltage', label: 'Voltage', unit: 'V', color: '#8C7A6B', yAxisId: 'left' },
  { key: 'current', label: 'Current', unit: 'A', color: '#785918', yAxisId: 'right' },
  { key: 'power', label: 'Power', unit: 'W', color: '#C4922A', yAxisId: 'left' },
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#A64B42', yAxisId: 'right' },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#5C4A3A', yAxisId: 'right' },
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
    <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between">
      
      {/* Controls & Checkboxes */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
            </span>
            Dynamic Multi-Parameter Analysis
          </h3>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Select parameters below to overlay electrical & environmental telemetry.
          </p>
        </div>

        {/* Checkbox Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {PARAM_CONFIGS.map(param => (
            <label
              key={param.key}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                selectedParams[param.key]
                  ? 'bg-[#F7E6CA] border-[#E8D59E] text-[#181412] shadow-sm'
                  : 'bg-[#FAF7F2] border-[#E8DFD3] text-[#3B322B] hover:text-[#181412]'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedParams[param.key]}
                onChange={() => toggleParam(param.key)}
                className="rounded accent-[#785918]"
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
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-[#E8DFD3] rounded-xl text-[#3B322B] gap-2">
            <Eye className="w-6 h-6 text-[#8C7A6B]" />
            <span className="text-xs font-semibold">Select at least one parameter above to view graph.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                yAxisId="left"
                stroke="#3B322B"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#E8DFD3' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#3B322B"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#E8DFD3' }}
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
                labelFormatter={(label) => `Timestamp: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />

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
                    strokeWidth={2.5}
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
