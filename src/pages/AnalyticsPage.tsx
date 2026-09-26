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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">
              HISTORICAL ANALYTICS & TRENDS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Query PostgreSQL historical sensor database to analyze min/max/average stats & energy yield.
          </p>
        </div>

        {/* Date Filter Controls (Section 14) */}
        <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['today', 'yesterday', '7d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setFilter(prev => ({ ...prev, timeRange: range }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter.timeRange === range
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Insufficient Data Warning Fallback (Section 14) */}
      {analytics && !analytics.has_sufficient_data ? (
        <div className="p-12 rounded-2xl border border-dashed border-amber-800/60 bg-amber-950/10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-amber-300 uppercase">
            Insufficient historical data for comparison.
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            The selected date range does not contain enough stored sensor telemetry records in PostgreSQL to compute statistical min/max aggregations.
          </p>
        </div>
      ) : (
        <>
          {/* Analytics Aggregation KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-2xl border border-amber-800/40 bg-slate-900/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Peak Power Generation
              </span>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {analytics?.max_power ?? 0} W
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono truncate">
                At {analytics?.peak_power_timestamp ? new Date(analytics.peak_power_timestamp).toLocaleTimeString() : 'N/A'}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-800/40 bg-slate-900/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Energy Generated
              </span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {analytics?.total_energy ?? 0} kWh
              </div>
              <div className="text-[10px] text-emerald-500 mt-1 font-mono">
                PostgreSQL Aggregated Sum
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-cyan-800/40 bg-slate-900/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Average Solar Power
              </span>
              <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">
                {analytics?.avg_power ?? 0} W
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Min: {analytics?.min_power ?? 0} W
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-rose-800/40 bg-slate-900/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Max Ambient Temp
              </span>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
                {analytics?.max_temp ?? 0} °C
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Avg: {analytics?.avg_temp ?? 0} °C
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-purple-800/40 bg-slate-900/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Comm Success Rate
              </span>
              <div className="text-2xl font-bold text-purple-300 font-mono mt-1">
                {analytics?.comm_success_rate ?? 99.8}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Samples: {analytics?.sample_count ?? 0}
              </div>
            </div>

          </div>

          {/* Historical Trend Chart */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Historical Generation Trend ({filter.timeRange.toUpperCase()})
            </h3>
            
            <div style={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={10} axisLine={{ stroke: '#334155' }} />
                  <YAxis stroke="#64748b" fontSize={10} axisLine={{ stroke: '#334155' }} unit="W" />
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
                  <Area type="monotone" dataKey="power" name="Power (W)" stroke="#06b6d4" strokeWidth={2} fill="url(#analyticsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
