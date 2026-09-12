import React from 'react';
import { CompanyRecord } from '../../../../shared/services/mockDataStore';
import { CompanyCard } from './CompanyCard';
import { SearchBar } from '../../../../shared/components/dashboard/SearchBar';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';

export interface CompanyGridProps {
  companies: CompanyRecord[];
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const CompanyGrid: React.FC<CompanyGridProps> = ({
  companies,
  searchValue,
  onSearchChange,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search companies by name, industry, or headquarters..."
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing <span className="text-[var(--brand-primary)] font-bold">{companies.length}</span> of <span className="text-slate-200 font-bold">{totalItems}</span> companies
        </div>
      </div>

      {/* 3 Cards Per Row Grid */}
      {companies.length === 0 ? (
        <div className="bg-[var(--bg-table)] border border-[var(--border-table)] rounded-2xl p-12 text-center">
          <EmptyState
            title="No Companies Found"
            message="No corporate entities match your current filter criteria or search query."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};
