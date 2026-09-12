import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { ApplicationTable } from './components/ApplicationTable';
import { useOnboarding } from '../../../features/onboarding/hooks/useOnboarding';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { DownloadCloud, Filter, Clock, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../../../app/providers/ToastProvider';

export const ApplicationsPage: React.FC = () => {
  const { applications } = useOnboarding();
  const { info } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get('status');
  const [activeTab, setActiveTab] = useState(urlStatus || 'ALL');

  useEffect(() => {
    if (urlStatus && urlStatus !== activeTab) {
      setActiveTab(urlStatus);
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

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      ALL: applications.length,
      SUBMITTED: applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'RESUBMITTED').length,
      UNDER_REVIEW: applications.filter((a) => a.status === 'UNDER_REVIEW').length,
      APPROVED: applications.filter((a) => a.status === 'APPROVED').length,
      REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    };
  }, [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Tab filter
      if (activeTab !== 'ALL') {
        if (activeTab === 'SUBMITTED') {
          if (app.status !== 'SUBMITTED' && app.status !== 'RESUBMITTED') return false;
        } else if (app.status !== activeTab) {
          return false;
        }
      }

      // Search term
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = app.companyName.toLowerCase().includes(q);
        const matchesApplicant = app.applicantName.toLowerCase().includes(q);
        const matchesId = app.id.toLowerCase().includes(q);
        if (!matchesName && !matchesApplicant && !matchesId) return false;
      }

      return true;
    });
  }, [applications, activeTab, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(filteredApps, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Applications"
        subtitle="Review, verify legal documentation, and decide company verification statuses."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Applications' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Exporting application logs CSV...', 'Export Started')}
            leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        }
      />

      {/* Status Navigation Tabs (Status Cards Design) */}
      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          { id: 'ALL', label: 'All', count: tabCounts.ALL },
          {
            id: 'SUBMITTED',
            label: 'Pending',
            count: tabCounts.SUBMITTED,
            icon: <Clock className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'UNDER_REVIEW',
            label: 'Under Review',
            count: tabCounts.UNDER_REVIEW,
            icon: <FileText className="w-4 h-4 text-blue-400" />,
          },
          {
            id: 'APPROVED',
            label: 'Approved',
            count: tabCounts.APPROVED,
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          },
          {
            id: 'REJECTED',
            label: 'Rejected',
            count: tabCounts.REJECTED,
            icon: <XCircle className="w-4 h-4 text-rose-500" />,
          },
        ]}
      />

      {/* Applications Data Table */}
      <ApplicationTable
        applications={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onPageChange={setPage}
      />
    </div>
  );
};
