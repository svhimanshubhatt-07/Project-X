import React from 'react';
import { DataTable } from '../../../../shared/components/dashboard/DataTable';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { PlatformUserRecord } from '../../../../shared/services/mockDataStore';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Button } from '../../../../shared/components/ui/Button';
import { Shield, Briefcase, Power, CheckCircle, Ban, Eye, Globe, Users } from 'lucide-react';
import { formatDate } from '../../../../shared/utils/formatDate';

export interface UserTableProps {
  users: PlatformUserRecord[];
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (user: PlatformUserRecord) => void;
  onViewDetails?: (user: PlatformUserRecord) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  searchValue,
  onSearchChange,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onToggleStatus,
  onViewDetails,
}) => {
  const columns = [
    {
      key: 'name',
      header: 'USER',
      render: (item: PlatformUserRecord) => (
        <div className="flex items-center gap-3">
          <Avatar name={item.name} size="sm" />
          <div className="min-w-0">
            <span className="font-semibold text-slate-100 block truncate">{item.name}</span>
            <span className="text-[11px] text-slate-400 font-mono block truncate">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'PLATFORM ROLE',
      render: (item: PlatformUserRecord) => {
        const roleStyles: Record<string, string> = {
          ADMIN: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          COMPANY_OWNER: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
          VISITOR: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          REGISTERED_USER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          STAKEHOLDER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          SERVICE_PROVIDER: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
        const currentStyle = roleStyles[item.role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${currentStyle}`}
          >
            {item.role === 'ADMIN' ? (
              <Shield className="w-3.5 h-3.5" />
            ) : item.role === 'VISITOR' || item.role === 'REGISTERED_USER' ? (
              <Globe className="w-3.5 h-3.5" />
            ) : (
              <Briefcase className="w-3.5 h-3.5" />
            )}
            {item.role === 'VISITOR' ? 'Website Visitor' : item.role === 'REGISTERED_USER' ? 'Website User' : item.role.replace(/_/g, ' ')}
          </span>
        );
      },
    },
    {
      key: 'companyName',
      header: 'ASSOCIATED ENTITY / INTENT',
      render: (item: PlatformUserRecord) => (
        <div className="min-w-0">
          <span className="text-xs font-medium text-slate-200 block truncate">
            {item.companyName || (item.role === 'VISITOR' || item.role === 'REGISTERED_USER' ? 'Public Company Discovery' : 'Platform Headquarters')}
          </span>
          {item.companiesViewed ? (
            <span className="text-[10px] text-[var(--brand-primary)] font-mono block">
              👁 {item.companiesViewed} companies viewed
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (item: PlatformUserRecord) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'lastLoginDate',
      header: 'LAST ACTIVE',
      render: (item: PlatformUserRecord) => (
        <span className="text-xs text-slate-300">{item.lastLoginDate}</span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right' as const,
      render: (item: PlatformUserRecord) => (
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(item);
            }}
            className="p-1.5 rounded-lg text-[var(--brand-primary)] hover:opacity-80 hover:bg-[var(--brand-primary)]/10 border border-transparent hover:border-[var(--brand-primary)]/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
            title="View User Details"
            aria-label="View User Details"
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
      data={users}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search users by name, email, or company..."
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
};
