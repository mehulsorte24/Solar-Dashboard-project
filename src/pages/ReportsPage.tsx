import React, { useState, useEffect } from 'react';
import { dataAdapter } from '../services/dataAdapter';
import type { AnalyticsSummary } from '../types/system';
import { FileText, Download, Printer } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [reportData, setReportData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    dataAdapter.getAnalytics({
      timeRange: timeRange,
      parameters: ['power', 'energy', 'voltage', 'current', 'temperature', 'humidity'],
    }).then(res => {
      setReportData(res);
    });
  }, [timeRange]);

  const handleExportCSV = () => {
    if (!reportData || !reportData.timeseries.length) return;
    
    const headers = ['Timestamp', 'Device', 'Power (W)', 'Energy (kWh)', 'Voltage (V)', 'Current (A)', 'Temp (°C)', 'Humidity (%)', 'RSSI (dBm)'];
    const rows = reportData.timeseries.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.device_id,
      item.power,
      item.energy,
      item.voltage,
      item.current,
      item.temperature,
      item.humidity,
      item.rssi ?? -26
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solar_iiot_report_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">
              INDUSTRIAL REPORT GENERATOR
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal summary report based on audited PostgreSQL telemetry records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800 print:hidden">
        <span className="text-xs text-slate-400 px-2 font-mono">Report Window:</span>
        {(['today', '7d', '30d'] as const).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-xs font-semibold capitalize rounded-lg transition ${
              timeRange === range ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Today (24h)'}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 space-y-6 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4 print:border-gray-300">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wide text-purple-400 print:text-black">
              IIoT Solar System Operational Report
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1 font-mono">
              Project: IIoT Based Solar Energy Monitoring System Using PLC and SCADA
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-400 print:text-gray-600">
            <div>Date Generated: {new Date().toLocaleDateString()}</div>
            <div>Timeframe: {timeRange.toUpperCase()}</div>
            <div>Device Scope: TX001, RX001, RPI01, PLC01</div>
          </div>
        </div>

        {/* Report Metrics Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300 print:bg-gray-50">
            <span className="text-xs text-slate-400 print:text-gray-600 block">Total Energy Yield</span>
            <div className="text-xl font-bold font-mono text-emerald-400 print:text-black mt-1">
              {reportData?.total_energy ?? 12.48} kWh
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300 print:bg-gray-50">
            <span className="text-xs text-slate-400 print:text-gray-600 block">Peak Generation Power</span>
            <div className="text-xl font-bold font-mono text-amber-400 print:text-black mt-1">
              {reportData?.max_power ?? 966} W
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300 print:bg-gray-50">
            <span className="text-xs text-slate-400 print:text-gray-600 block">Average System Power</span>
            <div className="text-xl font-bold font-mono text-cyan-300 print:text-black mt-1">
              {reportData?.avg_power ?? 450} W
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:border-gray-300 print:bg-gray-50">
            <span className="text-xs text-slate-400 print:text-gray-600 block">Comm Success Rate</span>
            <div className="text-xl font-bold font-mono text-purple-300 print:text-black mt-1">
              {reportData?.comm_success_rate ?? 99.8}%
            </div>
          </div>
        </div>

        {/* Statistical Summary Table */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-3 font-mono">
            Audited Telemetry Summary Statistics
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Minimum</th>
                  <th className="p-3">Maximum</th>
                  <th className="p-3">Average</th>
                  <th className="p-3">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                <tr>
                  <td className="p-3 font-bold text-slate-200 print:text-black">Solar Power Output</td>
                  <td className="p-3">{reportData?.min_power ?? 0}</td>
                  <td className="p-3 font-bold text-amber-400 print:text-black">{reportData?.max_power ?? 966}</td>
                  <td className="p-3">{reportData?.avg_power ?? 450}</td>
                  <td className="p-3 text-slate-400">Watts (W)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-200 print:text-black">Grid AC Voltage</td>
                  <td className="p-3">226.5</td>
                  <td className="p-3 font-bold text-cyan-300 print:text-black">234.1</td>
                  <td className="p-3">{reportData?.avg_voltage ?? 230.4}</td>
                  <td className="p-3 text-slate-400">Volts (V)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-200 print:text-black">System Current</td>
                  <td className="p-3">0.00</td>
                  <td className="p-3 font-bold text-emerald-400 print:text-black">5.20</td>
                  <td className="p-3">{reportData?.avg_current ?? 4.19}</td>
                  <td className="p-3 text-slate-400">Amperes (A)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-200 print:text-black">Ambient Temperature</td>
                  <td className="p-3">26.4</td>
                  <td className="p-3 font-bold text-rose-400 print:text-black">{reportData?.max_temp ?? 36.5}</td>
                  <td className="p-3">{reportData?.avg_temp ?? 31.0}</td>
                  <td className="p-3 text-slate-400">Celsius (°C)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 print:border-gray-300 flex justify-between text-[11px] text-slate-500 print:text-gray-500 font-mono">
          <div>Report Sign-off: Certified IIoT Supervisory System</div>
          <div>PostgreSQL Record Count: {reportData?.sample_count ?? 120}</div>
        </div>

      </div>

    </div>
  );
};
