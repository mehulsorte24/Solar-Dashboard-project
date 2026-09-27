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
        let borderClass = 'border-[#E8DFD3] bg-white text-[#231F1D] shadow-[0_8px_30px_rgb(0,0,0,0.08)]';
        let iconColor = 'text-[#6E5D4F]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-[#D9BBB0] bg-[#FBF0EE] text-[#231F1D] shadow-lg';
          iconColor = 'text-[#A64B42]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-[#E8D59E] bg-[#FDF6E7] text-[#231F1D] shadow-lg';
          iconColor = 'text-[#916212]';
        } else if (toast.type === 'success') {
          Icon = CheckCircle;
          borderClass = 'border-[#B7DFC0] bg-[#EBF4EE] text-[#231F1D] shadow-lg';
          iconColor = 'text-[#3B724D]';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
              <div>
                <div className="text-xs font-bold text-[#231F1D]">{toast.title}</div>
                <div className="text-[11px] text-[#6E645B] mt-0.5 leading-tight">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#AD9C8E] hover:text-[#231F1D] ml-2 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
