import React from 'react';
import { Calendar } from 'lucide-react';
import clsx from 'clsx';

export interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 bg-[var(--bg-table)] px-3 py-1.5 rounded-xl border border-[var(--border-table)] text-xs text-slate-300 shadow-sm',
        className
      )}
    >
      <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="bg-transparent text-slate-200 outline-none cursor-pointer [color-scheme:dark]"
      />
      <span className="text-slate-500">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="bg-transparent text-slate-200 outline-none cursor-pointer [color-scheme:dark]"
      />
    </div>
  );
};
