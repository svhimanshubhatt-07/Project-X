import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { DataTable } from '../../../shared/components/dashboard/DataTable';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useOnboarding } from '../../../features/onboarding/hooks/useOnboarding';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  Clock,
  PauseCircle,
  FileSearch,
  AlertCircle,
  Eye,
  FileText,
  DownloadCloud,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { useToast } from '../../../app/providers/ToastProvider';
import { OnboardingApplication } from '../../../features/onboarding/types/onboarding.types';

export const DocumentsPage: React.FC = () => {
  const { applications } = useOnboarding();
  const navigate = useNavigate();
  const { info } = useToast();

  const [activeTab, setActiveTab] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Filter only companies in the verification lifecycle
  const verificationQueue = useMemo(() => {
    return applications.filter((app) =>
      ['SUBMITTED', 'RESUBMITTED', 'PENDING', 'DRAFT', 'NOT_STARTED', 'UNDER_REVIEW', 'MORE_INFORMATION_REQUIRED'].includes(
        app.status
      )
    );
  }, [applications]);

  // Tab counts calculation for the 3 required verification states:
  // 1. Pending  2. Not Started  3. Under Review
  const tabCounts = useMemo(() => {
    return {
      PENDING: applications.filter(
        (a) => a.status === 'SUBMITTED' || a.status === 'RESUBMITTED' || a.status === 'PENDING'
      ).length,
      NOT_STARTED: applications.filter(
        (a) => a.status === 'DRAFT' || a.status === 'NOT_STARTED'
      ).length,
      UNDER_REVIEW: applications.filter(
        (a) => a.status === 'UNDER_REVIEW'
      ).length,
    };
  }, [applications]);

  // Filter applications by active verification tab and search keyword
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status Filter matching
      if (activeTab === 'PENDING') {
        if (app.status !== 'SUBMITTED' && app.status !== 'RESUBMITTED' && app.status !== 'PENDING') {
          return false;
        }
      } else if (activeTab === 'NOT_STARTED') {
        if (app.status !== 'DRAFT' && app.status !== 'NOT_STARTED') {
          return false;
        }
      } else if (activeTab === 'UNDER_REVIEW') {
        if (app.status !== 'UNDER_REVIEW') {
          return false;
        }
      }

      // Search matching across company name, applicant, industry, GST, or ID
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = app.companyName.toLowerCase().includes(q);
        const matchesApplicant = app.applicantName.toLowerCase().includes(q);
        const matchesIndustry = app.industry.toLowerCase().includes(q);
        const matchesGst = app.gstInfo?.gstNumber?.toLowerCase().includes(q) || false;
        const matchesCin = app.gstInfo?.cinNumber?.toLowerCase().includes(q) || false;
        const matchesId = app.id.toLowerCase().includes(q);
        if (!matchesName && !matchesApplicant && !matchesIndustry && !matchesGst && !matchesCin && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [applications, activeTab, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(filteredApplications, 10);

  const columns = [
    {
      key: 'companyName',
      header: 'COMPANY NAME',
      render: (item: OnboardingApplication) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-center font-bold text-teal-400 text-xs shrink-0 shadow-inner">
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
        <span className="text-xs font-semibold text-slate-200">{item.industry}</span>
      ),
    },
    {
      key: 'registration',
      header: 'STATUTORY ID',
      render: (item: OnboardingApplication) => (
        <span className="text-xs font-mono font-medium text-teal-300">
          {item.gstInfo?.gstNumber || item.gstInfo?.cinNumber || item.legalInfo?.registrationNumber || 'Pending GST'}
        </span>
      ),
    },
    {
      key: 'documents',
      header: 'COMPLIANCE DOCS',
      render: (item: OnboardingApplication) => {
        const docCount = item.documents?.length || 0;
        return (
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            {docCount} {docCount === 1 ? 'Document' : 'Documents'}
          </span>
        );
      },
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
      header: 'VERIFICATION STATUS',
      render: (item: OnboardingApplication) => (
        <StatusBadge status={item.status === 'DRAFT' ? 'NOT_STARTED' : item.status} size="sm" />
      ),
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
            title="View Company Verification Details"
            aria-label="View Company Verification Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Verification"
        subtitle="Track corporate entities undergoing KYC audit, statutory document validation, and registry verification."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Verification' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Exporting corporate verification register CSV...', 'Export Queued')}
            leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
          >
            Export Register
          </Button>
        }
      />

      {/* 3 Required Verification Filter Buttons: 1. Pending, 2. Not Started, 3. Under Review */}
      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            id: 'PENDING',
            label: 'Pending',
            count: tabCounts.PENDING,
            icon: <Clock className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'NOT_STARTED',
            label: 'Not Started',
            count: tabCounts.NOT_STARTED,
            icon: <PauseCircle className="w-4 h-4 text-slate-400" />,
          },
          {
            id: 'UNDER_REVIEW',
            label: 'Under Review',
            count: tabCounts.UNDER_REVIEW,
            icon: <FileSearch className="w-4 h-4 text-cyan-400" />,
          },
        ]}
      />

      {/* Verification Companies Data Table */}
      <DataTable
        columns={columns}
        data={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search verification queue by company name, applicant, GST, or ID..."
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onPageChange={setPage}
        onRowClick={(item) => navigate(ROUTES.ADMIN.APPLICATION_DETAILS(item.id))}
      />
    </div>
  );
};
