import React from 'react';
import { DataTable } from '../../../../shared/components/dashboard/DataTable';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { CompanyRecord } from '../../../../shared/services/mockDataStore';
import { formatDate } from '../../../../shared/utils/formatDate';
import { Eye, Edit3, ShieldCheck, Building2 } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export interface CompanyTableProps {
  companies: CompanyRecord[];
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  searchValue,
  onSearchChange,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'COMPANY NAME',
      render: (item: CompanyRecord) => {
        const name = typeof item.name === 'string' ? item.name : 'Company';
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[var(--brand-primary)] text-xs shrink-0 shadow-inner">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold text-slate-100">{name}</span>
          </div>
        );
      },
    },
    {
      key: 'industry',
      header: 'INDUSTRY',
      render: (item: CompanyRecord) => (
        <span className="text-xs font-medium text-slate-200">{typeof item.industry === 'string' ? item.industry : 'Technology'}</span>
      ),
    },
    {
      key: 'verificationStatus',
      header: 'VERIFICATION',
      render: (item: CompanyRecord) => <StatusBadge status={item.verificationStatus} size="sm" />,
    },
    {
      key: 'listingStatus',
      header: 'LISTING STATUS',
      render: (item: CompanyRecord) => <StatusBadge status={item.listingStatus} size="sm" />,
    },
    {
      key: 'profileCompletion',
      header: 'COMPLETION',
      render: (item: CompanyRecord) => (
        <div className="w-24">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
            <span>{item.profileCompletion}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#091b27] overflow-hidden border border-[#17384e]">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
              style={{ width: `${item.profileCompletion}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right' as const,
      render: (item: CompanyRecord) => (
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.ADMIN.COMPANY_DETAILS(item.id));
            }}
            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
            title="View Company Details"
            aria-label="View Company Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={companies}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search companies by name, industry, or headquarters..."
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onRowClick={(item) => navigate(ROUTES.ADMIN.COMPANY_DETAILS(item.id))}
    />
  );
};
