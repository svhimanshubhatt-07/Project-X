import React, { ReactNode } from 'react';
import { Table, TableProps } from '../ui/Table';
import { Pagination } from '../ui/Pagination';
import { SearchBar } from './SearchBar';

export interface DataTableProps<T> extends TableProps<T> {
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Search & Filters
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filterComponent?: ReactNode;
  headerActions?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyText,
  emptyAction,
  onRowClick,
  className,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterComponent,
  headerActions,
}: DataTableProps<T>) {
  const showTopBar = onSearchChange !== undefined || filterComponent || headerActions;

  return (
    <div className="flex flex-col gap-4">
      {showTopBar && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {onSearchChange && (
              <SearchBar
                value={searchValue || ''}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            )}
            {filterComponent}
          </div>

          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      <Table
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        isLoading={isLoading}
        emptyText={emptyText}
        emptyAction={emptyAction}
        onRowClick={onRowClick}
        className={className}
      />

      {onPageChange && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
