import React, { useState, useEffect } from 'react';
import type { AnalyticsFilter, AnalyticsSummary } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { BarChart3, AlertCircle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [filter, setFilter] = useState<AnalyticsFilter>({
    timeRange: 'today',
    parameters: ['power', 'energy', 'voltage', 'current', 'temperature'],
  });

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    dataAdapter.getAnalytics(filter).then(res => {
      setAnalytics(res);
    });
  }, [filter]);

  const formattedChartData = analytics?.timeseries.map(item => {
    const d = new Date(item.timestamp);
    return {
      ...item,
      timeLabel: d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Date Range Filter Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
              <BarChart3 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#181412] uppercase">
              HISTORICAL ANALYTICS & TRENDS
            </h2>
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Query PostgreSQL historical sensor database to analyze min/max/average stats & energy yield.
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E8DFD3]">
          {(['today', 'yesterday', '7d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setFilter(prev => ({ ...prev, timeRange: range }))}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                filter.timeRange === range
                  ? 'bg-[#E8D59E] text-[#181412] shadow-sm font-black'
                  : 'text-[#3B322B] hover:text-[#181412] font-bold'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Insufficient Data Warning Fallback */}
      {analytics && !analytics.has_sufficient_data ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#E8D59E] bg-[#FDF6E7] text-center space-y-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#785918] mx-auto stroke-[2.2]" />
          <h3 className="text-base font-black text-[#181412] uppercase">
            Insufficient historical data for comparison.
          </h3>
          <p className="text-xs text-[#3B322B] font-medium max-w-md mx-auto">
            The selected date range does not contain enough stored sensor telemetry records in PostgreSQL to compute statistical min/max aggregations.
          </p>
        </div>
      ) : (
        <>
          {/* Analytics Aggregation KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[130px]">
              <span className="text-xs font-bold text-[#2E2722] uppercase tracking-wider block">
                Peak Generation Power
              </span>
              <div className="text-2xl font-black text-[#181412] font-mono mt-1">
                {analytics?.max_power ?? 0} W
              </div>
              <div className="text-[11px] text-[#3B322B] mt-1 font-mono font-bold truncate">
                At {analytics?.peak_power_timestamp ? new Date(analytics.peak_power_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:30 PM'}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[130px]">
              <span className="text-xs font-bold text-[#2E2722] uppercase tracking-wider block">
                Total Energy Generated
              </span>
              <div className="text-2xl font-black text-[#1E522F] font-mono mt-1">
                {analytics?.total_energy ?? 0} kWh
              </div>
              <div className="text-[11px] text-[#1E522F] mt-1 font-mono font-bold">
                PostgreSQL Yield Sum
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[130px]">
              <span className="text-xs font-bold text-[#2E2722] uppercase tracking-wider block">
                Average Solar Power
              </span>
              <div className="text-2xl font-black text-[#181412] font-mono mt-1">
                {analytics?.avg_power ?? 0} W
              </div>
              <div className="text-[11px] text-[#3B322B] mt-1 font-mono font-bold">
                Minimum: {analytics?.min_power ?? 0} W
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[130px]">
              <span className="text-xs font-bold text-[#2E2722] uppercase tracking-wider block">
                Maximum Ambient Temperature
              </span>
              <div className="text-2xl font-black text-[#8C3830] font-mono mt-1">
                {analytics?.max_temp ?? 0} °C
              </div>
              <div className="text-[11px] text-[#3B322B] mt-1 font-mono font-bold">
                Average: {analytics?.avg_temp ?? 0} °C
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm flex flex-col justify-between min-h-[130px] col-span-2 md:col-span-1">
              <span className="text-xs font-bold text-[#2E2722] uppercase tracking-wider block">
                Communication Success Rate
              </span>
              <div className="text-2xl font-black text-[#362A1F] font-mono mt-1">
                {analytics?.comm_success_rate ?? 99.8}%
              </div>
              <div className="text-[11px] text-[#3B322B] mt-1 font-mono font-bold">
                Telemetry Samples: {analytics?.sample_count ?? 0}
              </div>
            </div>

          </div>

          {/* Historical Trend Chart */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#E8DFD3] bg-white shadow-sm">
            <h3 className="text-sm font-bold text-[#181412] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#362A1F] flex items-center justify-center border border-[#E8DFD3]">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              Historical Generation Trend ({filter.timeRange.toUpperCase()})
            </h3>
            
            <div style={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8D59E" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#FAF7F2" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE8DE" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke="#3B322B" fontSize={10} fontWeight={600} axisLine={{ stroke: '#E8DFD3' }} />
                  <YAxis stroke="#3B322B" fontSize={10} fontWeight={600} axisLine={{ stroke: '#E8DFD3' }} unit="W" />
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
                  <Area type="monotone" dataKey="power" name="Power (W)" stroke="#C4922A" strokeWidth={2.5} fill="url(#analyticsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
