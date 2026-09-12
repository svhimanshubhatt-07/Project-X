import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { DataTable } from '../../../shared/components/dashboard/DataTable';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { useToast } from '../../../app/providers/ToastProvider';
import { CompanyServiceVerificationRecord } from '../../../shared/services/mockDataStore';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  Layers,
  Clock,
  FileText,
  XCircle,
  DownloadCloud,
  Eye,
  Building2,
} from 'lucide-react';

export const ServiceVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { services } = useServiceVerifications();
  const { info } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get('status');
  const [activeTab, setActiveTab] = useState(urlStatus || 'ALL');

  useEffect(() => {
    if (urlStatus && urlStatus !== activeTab) {
      if (urlStatus === 'APPROVED') {
        setActiveTab('ALL');
        searchParams.delete('status');
        setSearchParams(searchParams);
      } else {
        setActiveTab(urlStatus);
      }
    }
  }, [urlStatus]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'ALL') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), status: tabId });
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Exclude approved/verified services from the verification queue
  const verificationServices = useMemo(() => {
    return services.filter((s) => s.status !== 'APPROVED');
  }, [services]);

  // Counts for tabs (Pending, Under Review, Rejected)
  const tabCounts = useMemo(() => {
    return {
      ALL: verificationServices.length,
      PENDING: verificationServices.filter((s) => s.status === 'PENDING').length,
      UNDER_REVIEW: verificationServices.filter((s) => s.status === 'UNDER_REVIEW').length,
      REJECTED: verificationServices.filter((s) => s.status === 'REJECTED').length,
    };
  }, [verificationServices]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return verificationServices.filter((srv) => {
      // Status Tab filter
      if (activeTab !== 'ALL' && srv.status !== activeTab) {
        return false;
      }

      // Search query
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = srv.serviceName.toLowerCase().includes(q);
        const matchesCompany = srv.companyName.toLowerCase().includes(q);
        const matchesCategory = srv.category.toLowerCase().includes(q);
        const matchesId = srv.id.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesCategory && !matchesId) return false;
      }

      return true;
    });
  }, [verificationServices, activeTab, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(filteredServices, 10);

  const columns = [
    {
      key: 'serviceName',
      header: 'SERVICE NAME',
      render: (item: CompanyServiceVerificationRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shrink-0 shadow-inner">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-slate-100 block truncate">{item.serviceName}</span>
            <span className="text-[11px] text-[var(--text-secondary)] block truncate mt-0.5 font-medium">
              {item.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'COMPANY NAME',
      render: (item: CompanyServiceVerificationRecord) => (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-medium text-slate-200 text-xs">
            <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">{item.companyName}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">{item.companyIndustry}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (item: CompanyServiceVerificationRecord) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right' as const,
      render: (item: CompanyServiceVerificationRecord) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.ADMIN.SERVICE_VERIFICATION_DETAILS(item.id));
            }}
            className="p-1.5 rounded-lg text-[var(--brand-primary)] hover:opacity-80 hover:bg-[var(--brand-primary)]/10 border border-transparent hover:border-[var(--brand-primary)]/20 transition-all inline-flex items-center justify-center cursor-pointer"
            title="Inspect Service Verification Details"
            aria-label="Inspect Service Verification Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Service Verification"
        subtitle="Review and verify enterprise services, capabilities, and solutions added by registered companies for marketplace catalog publication."
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
          { label: 'Verification', path: ROUTES.ADMIN.APPLICATIONS },
          { label: 'Service Verification' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Exporting service verification log CSV...', 'Export Started')}
            leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        }
      />

      {/* Status Cards Tabs */}
      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          { id: 'ALL', label: 'All Services', count: tabCounts.ALL },
          {
            id: 'PENDING',
            label: 'Pending',
            count: tabCounts.PENDING,
            icon: <Clock className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'UNDER_REVIEW',
            label: 'Under Review',
            count: tabCounts.UNDER_REVIEW,
            icon: <FileText className="w-4 h-4 text-blue-400" />,
          },
          {
            id: 'REJECTED',
            label: 'Rejected',
            count: tabCounts.REJECTED,
            icon: <XCircle className="w-4 h-4 text-rose-500" />,
          },
        ]}
      />

      {/* Services Table */}
      <DataTable
        columns={columns}
        data={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search services by title, category, company, or ID..."
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onPageChange={setPage}
        onRowClick={(item) => {
          navigate(ROUTES.ADMIN.SERVICE_VERIFICATION_DETAILS(item.id));
        }}
      />
    </div>
  );
};
