import React from 'react';
import { DataTable } from '../../../../shared/components/dashboard/DataTable';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { formatDate } from '../../../../shared/utils/formatDate';
import { Eye, ArrowUpRight } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export interface ApplicationTableProps {
  applications: OnboardingApplication[];
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
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
      key: 'companyName',
      header: 'COMPANY NAME',
      render: (item: OnboardingApplication) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-center font-bold text-teal-400 text-xs shrink-0 shadow-inner">
            {item.companyName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-100">{item.companyName}</span>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'INDUSTRY',
      render: (item: OnboardingApplication) => (
        <span className="text-xs font-medium text-slate-200">{item.industry}</span>
      ),
    },
    {
      key: 'submissionDate',
      header: 'SUBMITTED',
      render: (item: OnboardingApplication) => (
        <span className="text-xs text-slate-300">{formatDate(item.submissionDate)}</span>
      ),
    },
    {
      key: 'status',
      header: 'CURRENT STATUS',
      render: (item: OnboardingApplication) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right' as const,
      render: (item: OnboardingApplication) => (
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.ADMIN.APPLICATION_DETAILS(item.id));
            }}
            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
            title="View Application Details"
            aria-label="View Application Details"
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
      data={applications}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search by company name, applicant, or application ID..."
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onRowClick={(item) => navigate(ROUTES.ADMIN.APPLICATION_DETAILS(item.id))}
    />
  );
};
