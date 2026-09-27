import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import type { AlertItem, SeverityType } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { ShieldAlert, Sliders, Check, X } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { thresholds, updateThresholds, addToast } = useSystem();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | SeverityType>('ALL');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Modal threshold state
  const [modalTempWarn, setModalTempWarn] = useState(thresholds.temp_warning);
  const [modalTempCrit, setModalTempCrit] = useState(thresholds.temp_critical);

  useEffect(() => {
    dataAdapter.getAlerts().then(setAlerts);
  }, []);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
    addToast({
      type: 'success',
      title: 'Alert Acknowledged',
      message: `Alert ID ${id} marked as acknowledged by operator.`
    });
  };

  const handleSaveThresholds = () => {
    updateThresholds({
      temp_warning: Number(modalTempWarn),
      temp_critical: Number(modalTempCrit),
    });
    setShowConfigModal(false);
  };

  const filteredAlerts = alerts.filter(a => severityFilter === 'ALL' || a.severity === severityFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FBF0EE] text-[#8C3830] flex items-center justify-center border border-[#D9BBB0]">
              <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#181412] uppercase">
              SYSTEM ALERTS & FAULT ENGINE
            </h2>
          </div>
          <p className="text-xs text-[#3B322B] font-medium mt-1">
            Real-time evaluation against backend threshold bounds (Temperature, RSSI, Device Offline).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#FAF7F2] hover:bg-[#F7E6CA] border border-[#E8DFD3] text-[#181412] transition shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-[#785918]" />
            <span>Configure Thresholds</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-[#E8DFD3] shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                severityFilter === sev
                  ? 'bg-[#E8D59E] text-[#181412] shadow-sm font-black'
                  : 'text-[#3B322B] hover:text-[#181412] hover:bg-[#FAF7F2] font-bold'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#3B322B] font-mono font-bold pr-2">
          Total Alerts: <strong className="text-[#181412]">{filteredAlerts.length}</strong>
        </div>
      </div>

      {/* Alerts Table with Dark Bold Text */}
      <div className="rounded-2xl border border-[#E8DFD3] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#FAF7F2] text-[#181412] font-black uppercase font-mono text-[10px] tracking-wider border-b border-[#E8DFD3]">
              <tr>
                <th className="p-4">Severity</th>
                <th className="p-4">Alert ID & Type</th>
                <th className="p-4">Device</th>
                <th className="p-4">Trigger Message</th>
                <th className="p-4">Value vs Threshold</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD3] text-[#181412]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#3B322B] font-mono font-bold">
                    No active system alerts matching filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  let badge = 'bg-[#FAF7F2] text-[#362A1F] border-[#AD9C8E]';
                  if (alert.severity === 'CRITICAL') badge = 'bg-[#FBF0EE] text-[#8C3830] border-[#D9BBB0]';
                  if (alert.severity === 'WARNING') badge = 'bg-[#FDF6E7] text-[#7A4F08] border-[#E8D59E]';

                  return (
                    <tr key={alert.alert_id} className="hover:bg-[#FAF7F2] transition">
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${badge}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-black text-[#181412]">{alert.alert_type}</div>
                        <div className="text-[10px] text-[#3B322B] font-mono font-bold">{alert.alert_id}</div>
                      </td>
                      <td className="p-4 font-mono text-[#785918] font-black">{alert.device_id}</td>
                      <td className="p-4 text-[#181412] font-semibold max-w-xs">{alert.message}</td>
                      <td className="p-4 font-mono">
                        <span className="text-[#7A4F08] font-black">{alert.value}</span>
                        <span className="text-[#3B322B] font-bold"> / {alert.threshold}</span>
                      </td>
                      <td className="p-4 text-[#3B322B] font-mono font-bold text-[11px]">
                        {new Date(alert.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {alert.acknowledged ? (
                          <span className="text-[11px] font-bold text-[#1E522F] flex items-center justify-end gap-1 font-mono">
                            <Check className="w-3.5 h-3.5 stroke-[2.2]" /> ACKNOWLEDGED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledge(alert.alert_id)}
                            className="px-3 py-1 text-[11px] font-bold rounded-xl bg-[#FAF7F2] hover:bg-[#F7E6CA] text-[#785918] border border-[#E8D59E] transition shadow-xs"
                          >
                            Acknowledge
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threshold Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-[#181412]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DFD3] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#181412] uppercase tracking-wider flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F7E6CA] text-[#785918] flex items-center justify-center border border-[#E8D59E]">
                  <Sliders className="w-3.5 h-3.5 stroke-[2.2]" />
                </span>
                Configure System Thresholds
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-[#3B322B] hover:text-[#181412]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#2E2722] block mb-1 font-bold">Temperature Warning Threshold (°C)</label>
                <input
                  type="number"
                  value={modalTempWarn}
                  onChange={e => setModalTempWarn(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-2.5 text-[#181412] font-mono font-bold outline-none focus:border-[#AD9C8E]"
                />
              </div>

              <div>
                <label className="text-[#2E2722] block mb-1 font-bold">Temperature Critical Threshold (°C)</label>
                <input
                  type="number"
                  value={modalTempCrit}
                  onChange={e => setModalTempCrit(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-2.5 text-[#181412] font-mono font-bold outline-none focus:border-[#AD9C8E]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8DFD3]">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#3B322B] hover:text-[#181412]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 text-xs font-black bg-[#181412] hover:bg-[#332B25] text-white rounded-xl shadow-xs transition"
              >
                Save Thresholds
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
