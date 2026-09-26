import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  colorScheme?: 'green' | 'amber' | 'cyan' | 'purple' | 'rose';
  trend?: string;
  badgeText?: string;
  statusText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  colorScheme = 'green',
  trend,
  badgeText,
  statusText = 'NORMAL',
}) => {
  const styles = {
    green: {
      cardClass: 'card-glow-green',
      iconBox: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      valueText: 'text-slate-100',
    },
    amber: {
      cardClass: 'card-glow-amber',
      iconBox: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      valueText: 'text-slate-100',
    },
    cyan: {
      cardClass: 'card-glow-cyan',
      iconBox: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      valueText: 'text-slate-100',
    },
    purple: {
      cardClass: 'card-glow-purple',
      iconBox: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      valueText: 'text-slate-100',
    },
    rose: {
      cardClass: 'card-glow-rose',
      iconBox: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      valueText: 'text-slate-100',
    },
  }[colorScheme];

  return (
    <div className={`p-4 rounded-2xl ${styles.cardClass} backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 tracking-wide">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className={`text-2xl xl:text-3xl font-bold tracking-tight font-mono ${styles.valueText}`}>
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl ${styles.iconBox} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
        {trend && (
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            {trend}
          </span>
        )}
        {badgeText && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${styles.badge}`}>
            {badgeText}
          </span>
        )}
        {!trend && !badgeText && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${styles.badge}`}>
            {statusText}
          </span>
        )}
      </div>
    </div>
  );
};
