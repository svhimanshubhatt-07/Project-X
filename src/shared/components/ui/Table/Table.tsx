import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { TableColumn } from '../../../types/common.types';
import { Spinner } from '../Spinner';

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  isLoading?: boolean;
  emptyText?: string;
  emptyAction?: ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor = (item, index) => item.id || `row-${index}`,
  isLoading = false,
  emptyText = 'No records found matching your query.',
  emptyAction,
  onRowClick,
  className,
}: TableProps<T>) {
  return (
    <div className={clsx('w-full overflow-x-auto rounded-2xl border border-[var(--border-table)] bg-[var(--bg-table)] shadow-xl', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border-table-header)] bg-[var(--bg-table-header)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'py-4 px-6 text-[11px] font-semibold tracking-wider text-[var(--text-table-header)] uppercase select-none',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-table-row)]">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" />
                  <p className="text-xs text-[var(--text-table-muted)] font-medium">Loading records...</p>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto px-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-table-empty)] border border-[var(--border-table)] flex items-center justify-center text-[var(--text-table-header)]">
                    <span className="text-xl">📁</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-table-body)]">{emptyText}</p>
                  {emptyAction}
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const rowKey = keyExtractor(item, index);
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={clsx(
                    'transition-colors duration-150 group',
                    onRowClick ? 'cursor-pointer hover:bg-[var(--bg-table-row-hover)]' : 'hover:bg-[var(--bg-table-row-hover)]/70'
                  )}
                >
                  {columns.map((col) => {
                    const value = item[col.key];
                    return (
                      <td
                        key={`${rowKey}-${col.key}`}
                        className={clsx(
                          'py-4 px-6 text-[var(--text-table-body)] font-normal align-middle',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          col.className
                        )}
                      >
                        {col.render ? col.render(item) : value !== undefined && value !== null ? String(value) : '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
