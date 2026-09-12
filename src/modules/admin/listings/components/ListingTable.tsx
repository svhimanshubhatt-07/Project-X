import React from 'react';
import { DataTable } from '../../../../shared/components/dashboard/DataTable';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { CompanyRecord } from '../../../../shared/services/mockDataStore';
import { Eye, Power, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export interface ListingTableProps {
  companies: CompanyRecord[];
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggleListing: (company: CompanyRecord) => void;
  onPreview: (company: CompanyRecord) => void;
}

export const ListingTable: React.FC<ListingTableProps> = ({
  companies,
  searchValue,
  onSearchChange,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onToggleListing,
  onPreview,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'LISTED COMPANY',
      render: (item: CompanyRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[var(--brand-primary)] text-xs shrink-0 shadow-inner">
            {item.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-100">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'listingStatus',
      header: 'VISIBILITY STATUS',
      render: (item: CompanyRecord) => <StatusBadge status={item.listingStatus} size="sm" />,
    },
    {
      key: 'verificationStatus',
      header: 'VERIFICATION',
      render: (item: CompanyRecord) => <StatusBadge status={item.verificationStatus} size="sm" />,
    },
    {
      key: 'listingViews',
      header: 'MONTHLY DISCOVERIES',
      render: (item: CompanyRecord) => (
        <span className="text-xs font-bold text-slate-100">{item.listingViews.toLocaleString()} views</span>
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
              onPreview(item);
            }}
            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
            title="View Listing Details"
            aria-label="View Listing Details"
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
      searchPlaceholder="Search listings by company name or industry..."
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onRowClick={(item) => onPreview(item)}
    />
  );
};
