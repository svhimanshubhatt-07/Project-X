import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  description?: string;
  variant?: 'default' | 'orange' | 'emerald' | 'blue' | 'purple';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  variant = 'default',
  onClick,
  className,
}) => {
  const borderAccents = {
    default: 'hover:border-[var(--brand-primary)]/50',
    orange: 'hover:border-rose-500/40',
    emerald: 'hover:border-emerald-500/50',
    blue: 'hover:border-cyan-500/40',
    purple: 'hover:border-purple-500/40',
  };

  const iconBg = {
    default: 'bg-[var(--bg-card-inner)] text-[var(--brand-primary)] border-[var(--border-subtle)]',
    orange: 'bg-[var(--bg-card-inner)] text-rose-400 border-[var(--border-subtle)]',
    emerald: 'bg-[var(--bg-card-inner)] text-emerald-400 border-[var(--border-subtle)]',
    blue: 'bg-[var(--bg-card-inner)] text-cyan-400 border-[var(--border-subtle)]',
    purple: 'bg-[var(--bg-card-inner)] text-purple-400 border-[var(--border-subtle)]',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative bg-[var(--bg-table)] rounded-2xl border border-[var(--border-table)] p-5 shadow-xl transition-all duration-200 overflow-hidden flex items-center justify-between gap-4',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[var(--brand-glow)]',
        borderAccents[variant],
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        {icon && (
          <div
            className={clsx(
              'w-12 h-12 rounded-xl flex items-center justify-center border shrink-0',
              iconBg[variant]
            )}
          >
            {icon}
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-slate-400 select-none">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={clsx(
                  'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg font-semibold text-xs',
                  trend.isPositive !== false
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                )}
              >
                {trend.isPositive !== false ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
      {description && <span className="text-slate-400 ml-auto">{description}</span>}
    </div>
  );
};
