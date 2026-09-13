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
    default: 'hover:border-[#3B82F6]/50',
    orange: 'hover:border-[#EC4899]/50',
    emerald: 'hover:border-[#3B82F6]/50',
    blue: 'hover:border-[#3B82F6]/50',
    purple: 'hover:border-[#8B5CF6]/50',
  };

  const iconBg = {
    default: 'bg-[#172554] text-[#3B82F6] border-[#1E3A5F]',
    orange: 'bg-[#2A1526] text-[#EC4899] border-[#4A1E3E]',
    emerald: 'bg-[#172554] text-[#3B82F6] border-[#1E3A5F]',
    blue: 'bg-[#172554] text-[#3B82F6] border-[#1E3A5F]',
    purple: 'bg-[#1F1E38] text-[#8B5CF6] border-[#312E81]',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative bg-[#111827] rounded-2xl border border-[#273244] p-5 shadow-xl transition-all duration-200 overflow-hidden flex items-center justify-between gap-4',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/10',
        borderAccents[variant],
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        {icon && (
          <div
            className={clsx(
              'w-11 h-11 rounded-xl flex items-center justify-center border shrink-0',
              iconBg[variant]
            )}
          >
            {icon}
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-[#9CA3AF] select-none">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] font-heading tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={clsx(
                  'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg font-semibold text-xs font-mono',
                  trend.isPositive !== false
                    ? 'bg-[#172554] text-[#60A5FA] border border-[#1E3A5F]'
                    : 'bg-[#2A1526] text-[#EC4899] border border-[#4A1E3E]'
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
      {description && <span className="text-[#9CA3AF] ml-auto">{description}</span>}
    </div>
  );
};
