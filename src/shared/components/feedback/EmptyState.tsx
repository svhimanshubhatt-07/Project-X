import React, { ReactNode } from 'react';
import { FolderSearch } from 'lucide-react';
import clsx from 'clsx';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-[var(--border-table)] bg-[var(--bg-table)] max-w-md mx-auto my-6 shadow-sm',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] mb-4">
        {icon || <FolderSearch className="w-7 h-7 text-[var(--brand-primary)]" />}
      </div>

      <h3 className="text-base font-bold text-slate-100 font-heading">{title}</h3>
      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
