import React, { ReactNode } from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: ReactNode;
  iconColor?: string; // Optional custom color for icon container
  badgeColor?: string; // Optional custom badge color class
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'enclosed' | 'status-cards';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'status-cards',
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center overflow-x-auto no-scrollbar py-1',
        variant === 'status-cards' && 'gap-3',
        variant === 'underline' && 'border-b border-[#17384e] gap-6',
        variant === 'enclosed' && 'p-1 bg-[#091b27] border border-[#17384e] rounded-xl gap-2',
        variant === 'pills' && 'gap-2',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        // 1. Status Cards Variant (Matches the requested pill card UI)
        if (variant === 'status-cards') {
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'group relative px-4 py-2.5 rounded-2xl transition-all duration-200 flex items-center gap-2.5 select-none whitespace-nowrap text-xs sm:text-sm font-medium border shrink-0 cursor-pointer',
                isActive
                  ? 'bg-gradient-to-b from-[#072b22] to-[#041a14] border-[var(--brand-primary)]/90 text-white font-semibold shadow-[0_0_18px_rgba(0,229,153,0.22)] ring-1 ring-[var(--brand-primary)]/40'
                  : 'bg-[var(--bg-table)] hover:bg-[var(--bg-surface-hover)] border-[var(--border-table)] hover:border-[var(--border-strong)] text-slate-300 hover:text-white shadow-sm',
                tab.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
              )}
            >
              {tab.icon && (
                <span
                  className={clsx(
                    'flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                    tab.iconColor || 'text-slate-300'
                  )}
                >
                  {tab.icon}
                </span>
              )}

              <span className={clsx(isActive ? 'text-white' : 'text-slate-200')}>
                {tab.label}
              </span>

              {tab.count !== undefined && tab.count !== null && (
                <span
                  className={clsx(
                    'px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-tight transition-all',
                    isActive
                      ? 'bg-emerald-950/80 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40 shadow-inner'
                      : 'bg-[var(--bg-card-inner)] text-slate-300 border border-[var(--border-subtle)] group-hover:border-slate-600',
                    tab.badgeColor
                  )}
                >
                  {typeof tab.count === 'number' ? tab.count.toLocaleString() : tab.count}
                </span>
              )}
            </button>
          );
        }

        // 2. Underline Variant
        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'group relative pb-3.5 pt-1 text-sm font-medium transition-all duration-200 flex items-center gap-2 select-none whitespace-nowrap shrink-0',
                isActive
                  ? 'text-[var(--brand-primary)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-emerald-950/80 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                      : 'bg-[var(--bg-card-inner)] text-slate-400 border border-[var(--border-subtle)]'
                  )}
                >
                  {typeof tab.count === 'number' ? tab.count.toLocaleString() : tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-full shadow-[0_0_10px_rgba(0,229,153,0.5)]" />
              )}
            </button>
          );
        }

        // 3. Enclosed Variant
        if (variant === 'enclosed') {
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 select-none whitespace-nowrap shrink-0',
                isActive
                  ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-surface-hover)]',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    isActive ? 'bg-slate-950/30 text-slate-900' : 'bg-[var(--bg-card-inner)] text-slate-300'
                  )}
                >
                  {typeof tab.count === 'number' ? tab.count.toLocaleString() : tab.count}
                </span>
              )}
            </button>
          );
        }

        // 4. Pills Variant
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'px-4 py-2 text-xs font-medium rounded-xl transition-all duration-150 flex items-center gap-2 select-none whitespace-nowrap shrink-0',
              isActive
                ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-surface-hover)]',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold',
                  isActive ? 'bg-slate-950/30 text-slate-900' : 'bg-[var(--bg-card-inner)] text-slate-300'
                )}
              >
                {typeof tab.count === 'number' ? tab.count.toLocaleString() : tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

