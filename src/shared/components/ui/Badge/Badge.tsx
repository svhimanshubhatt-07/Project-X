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
    default: 'bg-[#1F2937] text-[#9CA3AF] border-[#273244]',
    success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
    info: 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30',
    orange: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
    purple: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30',
    outline: 'bg-transparent text-[#9CA3AF] border-[#273244]',
  };

  const dotColors = {
    default: 'bg-[#667085]',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
    info: 'bg-[#3B82F6]',
    orange: 'bg-[#F59E0B]',
    purple: 'bg-[#8B5CF6]',
    outline: 'bg-[#667085]',
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
