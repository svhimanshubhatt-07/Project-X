import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { ListingTable } from './components/ListingTable';
import { ListingPreview } from './components/ListingPreview';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { useToast } from '../../../app/providers/ToastProvider';
import { CompanyRecord } from '../../../shared/services/mockDataStore';
import { CheckCircle2, Ban, Globe, Sliders, LayoutGrid, Sparkles, TrendingUp, Eye } from 'lucide-react';

export const ListingsPage: React.FC = () => {
  const { companies, setListingStatus, updateCompany } = useCompanies();
  const { success } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const viewParam = searchParams.get('view');
  const [activeTab, setActiveTab] = useState(viewParam === 'manage' ? 'MANAGE' : 'ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [previewCompany, setPreviewCompany] = useState<CompanyRecord | null>(null);

  useEffect(() => {
    if (viewParam === 'manage' && activeTab !== 'MANAGE') {
      setActiveTab('MANAGE');
    }
  }, [viewParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'MANAGE') {
      setSearchParams({ view: 'manage' });
    } else {
      setSearchParams({});
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
      if (activeTab === 'ACTIVE' && comp.listingStatus !== 'ACTIVE') return false;
      if (activeTab === 'SUSPENDED' && comp.listingStatus !== 'SUSPENDED') return false;

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.industry.toLowerCase().includes(q) ||
          comp.headquarters.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [companies, activeTab, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(filteredCompanies, 10);

  const handleToggleListing = (comp: CompanyRecord) => {
    const nextStatus = comp.listingStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setListingStatus(comp.id, nextStatus);
    success(`Listing visibility for ${comp.name} set to ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Directory Listings & Public Exposure"
        subtitle="Manage public ecosystem listings, visibility toggles, and live search impressions."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Listings' }]}
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          {
            id: 'ALL',
            label: 'All Listings',
            count: companies.length,
            icon: <LayoutGrid className="w-4 h-4 text-cyan-400" />,
          },
          {
            id: 'ACTIVE',
            label: 'Active Listings',
            count: companies.filter((c) => c.listingStatus === 'ACTIVE').length,
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          },
          {
            id: 'SUSPENDED',
            label: 'Suspended Listings',
            count: companies.filter((c) => c.listingStatus === 'SUSPENDED').length,
            icon: <Ban className="w-4 h-4 text-rose-400" />,
          },
          {
            id: 'MANAGE',
            label: 'Listing Management',
            count: companies.length,
            icon: <Sliders className="w-4 h-4 text-purple-400" />,
          },
        ]}
      />

      {activeTab === 'MANAGE' ? (
        <div className="space-y-6">
          <Card className="bg-[#0c2130] border border-[#17384e] shadow-lg">
            <CardHeader
              title="Listing Curation & Search Ranking Management"
              subtitle="Control featured spotlights, search boost multipliers, and badge certifications across the ecosystem."
            />
            <CardBody className="p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#143144] bg-[#091e2b]/80">
                    <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">COMPANY</th>
                    <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">CATEGORY</th>
                    <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">VISIBILITY</th>
                    <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">IMPRESSIONS</th>
                    <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">SEARCH BOOST</th>
                    <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#143144]">
                  {companies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-[#0f2c40]/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-100">{comp.name}</td>
                      <td className="py-4 px-6 text-slate-300">{comp.industry}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            comp.listingStatus === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {comp.listingStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-teal-300">
                        {comp.listingViews?.toLocaleString() || '1,200'} Views
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <Sparkles className="w-3 h-3" /> 1.5x Multiplier
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setPreviewCompany(comp)}
                            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
                            title="View Listing Details"
                            aria-label="View Listing Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      ) : (
        <ListingTable
          companies={items}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={limit}
          onPageChange={setPage}
          onToggleListing={handleToggleListing}
          onPreview={setPreviewCompany}
        />
      )}

      <ListingPreview company={previewCompany} onClose={() => setPreviewCompany(null)} />
    </div>
  );
};
