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
  colorScheme = 'amber',
  trend,
  badgeText,
  statusText = 'NORMAL',
}) => {
  const styles = {
    green: {
      cardClass: 'card-glow-sand',
      iconBox: 'bg-[#F7E6CA] text-[#785918] border border-[#E8D59E]',
      badge: 'bg-[#EBF4EE] text-[#1E522F] border border-[#B7DFC0]',
      valueText: 'text-[#181412]',
    },
    amber: {
      cardClass: 'card-glow-sand',
      iconBox: 'bg-[#F7E6CA] text-[#785918] border border-[#E8D59E]',
      badge: 'bg-[#FDF6E7] text-[#7A4F08] border border-[#E8D59E]',
      valueText: 'text-[#181412]',
    },
    cyan: {
      cardClass: 'card-glow-taupe',
      iconBox: 'bg-[#EFEAE4] text-[#423429] border border-[#AD9C8E]',
      badge: 'bg-[#F4EFEA] text-[#362A1F] border border-[#AD9C8E]',
      valueText: 'text-[#181412]',
    },
    purple: {
      cardClass: 'card-glow-taupe',
      iconBox: 'bg-[#EFEAE4] text-[#423429] border border-[#AD9C8E]',
      badge: 'bg-[#F4EFEA] text-[#362A1F] border border-[#AD9C8E]',
      valueText: 'text-[#181412]',
    },
    rose: {
      cardClass: 'card-glow-rose',
      iconBox: 'bg-[#F6ECE8] text-[#8C3830] border border-[#D9BBB0]',
      badge: 'bg-[#FBF0EE] text-[#8C3830] border border-[#D9BBB0]',
      valueText: 'text-[#181412]',
    },
  }[colorScheme];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl ${styles.cardClass} transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between min-h-[155px] shadow-sm`}>
      <div className="flex items-start justify-between gap-2.5">
        <div className="space-y-1 min-w-0 flex-1">
          {/* Full name clearly displayed without any truncation */}
          <span className="text-xs font-bold text-[#181412] tracking-wider uppercase block leading-tight min-h-[30px] flex items-center">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 pt-1 flex-wrap">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${styles.valueText}`}>
              {value}
            </span>
            {unit && (
              <span className="text-xs sm:text-sm font-bold text-[#3B322B]">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Small, refined icon emblem */}
        <div className={`w-8 h-8 rounded-xl ${styles.iconBox} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
          <Icon className="w-4 h-4 stroke-[2.25]" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E8DFD3] flex items-center justify-between text-[11px] font-mono">
        {trend && (
          <span className="text-[#1E522F] font-bold flex items-center gap-1 bg-[#EBF4EE] px-2 py-0.5 rounded-full border border-[#B7DFC0]">
            {trend}
          </span>
        )}
        {badgeText && (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${styles.badge}`}>
            {badgeText}
          </span>
        )}
        {!trend && !badgeText && (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles.badge}`}>
            {statusText}
          </span>
        )}
      </div>
    </div>
  );
};
