import React from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  onClear,
  className,
}) => {
  return (
    <div className={clsx('relative flex items-center min-w-[260px] max-w-md w-full', className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-9 bg-[var(--bg-card-inner)] text-xs text-[var(--text-primary)] placeholder-slate-400 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] focus:border-[var(--brand-primary)] focus:bg-[var(--bg-surface)] focus:ring-1 focus:ring-[var(--brand-primary)]/20 outline-none transition-all shadow-md"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
