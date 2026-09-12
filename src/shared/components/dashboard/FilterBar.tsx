import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FilterBarProps {
  children: ReactNode;
  onReset?: () => void;
  activeFiltersCount?: number;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onReset,
  activeFiltersCount = 0,
  className,
}) => {
  return (
    <div
      className={clsx(
        'p-4 bg-[var(--bg-table)] rounded-2xl border border-[var(--border-table)] mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3 flex-1">{children}</div>

      {onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={activeFiltersCount === 0}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs text-slate-400 hover:text-white"
        >
          Reset Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      )}
    </div>
  );
};
