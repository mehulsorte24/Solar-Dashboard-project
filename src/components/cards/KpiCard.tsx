import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue';
  technicalDetail?: string;
  trend?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  statusColor = 'green',
  technicalDetail,
  trend,
}) => {
  const colorStyles = {
    green: {
      bg: 'bg-emerald-950/20',
      border: 'border-emerald-800/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
    },
    yellow: {
      bg: 'bg-amber-950/20',
      border: 'border-amber-800/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
    },
    red: {
      bg: 'bg-rose-950/20',
      border: 'border-rose-800/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      text: 'text-rose-400',
    },
    blue: {
      bg: 'bg-cyan-950/20',
      border: 'border-cyan-800/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      text: 'text-cyan-400',
    },
  }[statusColor];

  return (
    <div className={`p-4 rounded-2xl border ${colorStyles.border} ${colorStyles.bg} bg-slate-900/80 backdrop-blur-sm transition-all hover:border-slate-700 shadow-md flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-slate-100">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-slate-400 font-sans">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${colorStyles.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || technicalDetail || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          {subtitle && <span>{subtitle}</span>}
          {trend && <span className="text-emerald-400 font-semibold">{trend}</span>}
          {technicalDetail && (
            <span className="text-slate-500 text-[10px] truncate max-w-[180px]">
              {technicalDetail}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
