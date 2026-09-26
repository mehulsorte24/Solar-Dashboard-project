import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import type { AlertItem, SeverityType } from '../types/system';
import { dataAdapter } from '../services/dataAdapter';
import { ShieldAlert, Sliders, Check } from 'lucide-react';

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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold tracking-wide text-slate-100 uppercase">
              SYSTEM ALERTS & FAULT ENGINE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time evaluation against backend threshold bounds (Temperature, RSSI, Device Offline).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Configure Thresholds</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                severityFilter === sev
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono pr-2">
          Total Alerts: <strong className="text-slate-200">{filteredAlerts.length}</strong>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Alert ID & Type</th>
                <th className="p-3.5">Device</th>
                <th className="p-3.5">Trigger Message</th>
                <th className="p-3.5">Value vs Threshold</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                    No active system alerts matching filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  let badge = 'bg-cyan-950 text-cyan-300 border-cyan-800';
                  if (alert.severity === 'CRITICAL') badge = 'bg-rose-950 text-rose-300 border-rose-800';
                  if (alert.severity === 'WARNING') badge = 'bg-amber-950 text-amber-300 border-amber-800';

                  return (
                    <tr key={alert.alert_id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${badge}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-100">{alert.alert_type}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{alert.alert_id}</div>
                      </td>
                      <td className="p-3.5 font-mono text-cyan-400 font-semibold">{alert.device_id}</td>
                      <td className="p-3.5 text-slate-300 max-w-xs">{alert.message}</td>
                      <td className="p-3.5 font-mono">
                        <span className="text-amber-400 font-bold">{alert.value}</span>
                        <span className="text-slate-500"> / {alert.threshold}</span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(alert.created_at).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right">
                        {alert.acknowledged ? (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center justify-end gap-1 font-mono">
                            <Check className="w-3.5 h-3.5" /> ACKNOWLEDGED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledge(alert.alert_id)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 transition"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Configure System Thresholds
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Temperature Warning Threshold (°C)</label>
                <input
                  type="number"
                  value={modalTempWarn}
                  onChange={e => setModalTempWarn(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Temperature Critical Threshold (°C)</label>
                <input
                  type="number"
                  value={modalTempCrit}
                  onChange={e => setModalTempCrit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow"
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
