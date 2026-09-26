import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSystem();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-cyan-800 bg-slate-900 text-cyan-300';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-800 bg-slate-900 text-rose-300';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-800 bg-slate-900 text-amber-300';
        } else if (toast.type === 'success') {
          Icon = CheckCircle;
          borderClass = 'border-emerald-800 bg-slate-900 text-emerald-300';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start justify-between p-3 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-100">{toast.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
