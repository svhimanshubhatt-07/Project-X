import React, { ReactNode } from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className,
}) => {
  const variants = {
    default: 'bg-[#143144] text-slate-300 border-[#1c4560]',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-[#17384e]',
  };

  const dotColors = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    outline: 'bg-slate-500',
  };

  const sizes = {
    sm: 'text-[11px] font-semibold px-2 py-0.5 rounded-full gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-full gap-1.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center border select-none tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
