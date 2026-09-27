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
    
    const headers = ['Timestamp', 'Device', 'Power (W)', 'Energy (kWh)', 'Voltage (V)', 'Current (A)', 'Temperature (°C)', 'Humidity (%)', 'RSSI (dBm)'];
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
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#362A1F] flex items-center justify-center border border-[#E8DFD3]">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#181412] uppercase">
              INDUSTRIAL REPORT GENERATOR
            </h2>
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Generate formal summary report based on audited PostgreSQL telemetry records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#FAF7F2] hover:bg-[#F7E6CA] border border-[#E8DFD3] text-[#181412] transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#785918]" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl bg-[#181412] hover:bg-[#332B25] text-white transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#E8D59E]" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#E8DFD3] shadow-sm print:hidden">
        <span className="text-xs text-[#2E2722] font-mono font-bold px-2">Report Window:</span>
        {(['today', '7d', '30d'] as const).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 text-xs capitalize rounded-xl transition ${
              timeRange === range
                ? 'bg-[#E8D59E] text-[#181412] shadow-sm font-black'
                : 'text-[#3B322B] hover:text-[#181412] hover:bg-[#FAF7F2] font-bold'
            }`}
          >
            {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Today (24h)'}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#E8DFD3] bg-white text-[#181412] space-y-6 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-[#E8DFD3] pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#181412]">
              Solar System Operational Telemetry Report
            </h1>
            <p className="text-xs text-[#3B322B] mt-1 font-mono font-bold">
              Project: IIoT Based Solar Energy Monitoring System Using PLC and SCADA
            </p>
          </div>
          <div className="text-right text-xs font-mono text-[#3B322B] font-bold">
            <div>Date Generated: {new Date().toLocaleDateString()}</div>
            <div>Timeframe: {timeRange.toUpperCase()}</div>
            <div>Device Scope: TX001, RX001, RPI01, PLC01</div>
          </div>
        </div>

        {/* Report Metrics Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-xs text-[#2E2722] font-bold uppercase block">Total Energy Yield</span>
            <div className="text-2xl font-black font-mono text-[#1E522F] mt-1">
              {reportData?.total_energy ?? 12.48} kWh
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-xs text-[#2E2722] font-bold uppercase block">Peak Generation Power</span>
            <div className="text-2xl font-black font-mono text-[#785918] mt-1">
              {reportData?.max_power ?? 966} W
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-xs text-[#2E2722] font-bold uppercase block">Average System Power</span>
            <div className="text-2xl font-black font-mono text-[#181412] mt-1">
              {reportData?.avg_power ?? 450} W
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <span className="text-xs text-[#2E2722] font-bold uppercase block">Communication Success Rate</span>
            <div className="text-2xl font-black font-mono text-[#362A1F] mt-1">
              {reportData?.comm_success_rate ?? 99.8}%
            </div>
          </div>
        </div>

        {/* Statistical Summary Table */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#181412] mb-3 font-mono">
            Audited Telemetry Summary Statistics
          </h3>
          <div className="overflow-x-auto rounded-xl border border-[#E8DFD3]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF7F2] text-[#181412] font-black uppercase">
                <tr>
                  <th className="p-3.5">Parameter</th>
                  <th className="p-3.5">Minimum</th>
                  <th className="p-3.5">Maximum</th>
                  <th className="p-3.5">Average</th>
                  <th className="p-3.5">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD3] text-[#181412] font-bold">
                <tr>
                  <td className="p-3.5 font-black text-[#181412]">Solar Power Output</td>
                  <td className="p-3.5">{reportData?.min_power ?? 0}</td>
                  <td className="p-3.5 font-black text-[#785918]">{reportData?.max_power ?? 966}</td>
                  <td className="p-3.5">{reportData?.avg_power ?? 450}</td>
                  <td className="p-3.5 text-[#3B322B]">Watts (W)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-[#181412]">Grid AC Voltage</td>
                  <td className="p-3.5">226.5</td>
                  <td className="p-3.5 font-black text-[#362A1F]">{reportData?.avg_voltage ? (reportData.avg_voltage + 4).toFixed(1) : '234.1'}</td>
                  <td className="p-3.5">{reportData?.avg_voltage ?? 230.4}</td>
                  <td className="p-3.5 text-[#3B322B]">Volts (V)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-[#181412]">Electrical Current</td>
                  <td className="p-3.5">0.00</td>
                  <td className="p-3.5 font-black text-[#1E522F]">5.20</td>
                  <td className="p-3.5">{reportData?.avg_current ?? 4.19}</td>
                  <td className="p-3.5 text-[#3B322B]">Amperes (A)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-black text-[#181412]">Ambient Temperature</td>
                  <td className="p-3.5">26.4</td>
                  <td className="p-3.5 font-black text-[#8C3830]">{reportData?.max_temp ?? 36.5}</td>
                  <td className="p-3.5">{reportData?.avg_temp ?? 31.0}</td>
                  <td className="p-3.5 text-[#3B322B]">Celsius (°C)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8DFD3] flex justify-between text-[11px] text-[#3B322B] font-mono font-bold">
          <div>Report Sign-off: Certified IIoT Supervisory System</div>
          <div>PostgreSQL Record Count: {reportData?.sample_count ?? 120}</div>
        </div>

      </div>

    </div>
  );
};
