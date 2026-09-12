import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { CompanyGrid } from './components/CompanyGrid';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { DownloadCloud, Plus, CheckCircle2, Clock, Ban } from 'lucide-react';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const { companies } = useCompanies();
  const { info } = useToast();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  const tabCounts = useMemo(() => {
    return {
      ALL: companies.length,
      ACTIVE: companies.filter((c) => c.companyStatus === 'ACTIVE').length,
      PENDING: companies.filter((c) => c.companyStatus === 'PENDING').length,
      SUSPENDED: companies.filter((c) => c.companyStatus === 'SUSPENDED').length,
    };
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
      if (activeTab !== 'ALL' && comp.companyStatus !== activeTab) return false;

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesIndustry = comp.industry.toLowerCase().includes(q);
        const matchesCity = comp.headquarters.toLowerCase().includes(q);
        if (!matchesName && !matchesIndustry && !matchesCity) return false;
      }

      return true;
    });
  }, [companies, activeTab, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage, setLimit } = usePagination(filteredCompanies, 9);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verified Companies"
        subtitle="Manage approved corporate profiles, monitor verification status, and toggle ecosystem listings."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Companies' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => info('Exporting verified company catalog CSV...', 'Export Complete')}
              leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
            >
              Export Directory
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.COMPANY_ONBOARD)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Onboard Company
            </Button>
          </div>
        }
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'ALL', label: 'All Companies', count: tabCounts.ALL },
          {
            id: 'ACTIVE',
            label: 'Active in Directory',
            count: tabCounts.ACTIVE,
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          },
          {
            id: 'PENDING',
            label: 'Pending Verification',
            count: tabCounts.PENDING,
            icon: <Clock className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'SUSPENDED',
            label: 'Suspended',
            count: tabCounts.SUSPENDED,
            icon: <Ban className="w-4 h-4 text-rose-400" />,
          },
        ]}
      />

      <CompanyGrid
        companies={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />
    </div>
  );
};

