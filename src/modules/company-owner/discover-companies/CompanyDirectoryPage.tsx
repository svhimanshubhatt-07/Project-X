import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardBody } from '../../../shared/components/ui/Card';
import { SearchBar } from '../../../shared/components/dashboard/SearchBar';
import { Select } from '../../../shared/components/ui/Select';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Button } from '../../../shared/components/ui/Button';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { Building2, Globe, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { CompanyRecord } from '../../../shared/services/mockDataStore';

export const CompanyDirectoryPage: React.FC = () => {
  const { companies } = useCompanies();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  // Only show active / verified companies in ecosystem discovery
  const verifiedCompanies = useMemo(() => {
    return companies.filter((c) => c.verificationStatus === 'VERIFIED');
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return verifiedCompanies.filter((comp) => {
      if (industryFilter !== 'ALL' && comp.industry !== industryFilter) return false;
      if (sizeFilter !== 'ALL' && comp.companySize !== sizeFilter) return false;

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.industry.toLowerCase().includes(q) ||
          comp.description.toLowerCase().includes(q) ||
          comp.headquarters.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [verifiedCompanies, industryFilter, sizeFilter, debouncedSearch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Verified Ecosystem Companies"
        subtitle="Explore verified enterprises, deeptech innovators, and prospective technology partners on Project X."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Discover Companies' }]}
      />

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0c2130] border border-[#17384e] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px]">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by company name, technology, or location..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              options={[
                { label: 'All Industries', value: 'ALL' },
                { label: 'Robotics & AI', value: 'Robotics & AI' },
                { label: 'Cloud Infrastructure', value: 'Cloud Infrastructure' },
                { label: 'Semiconductors & Hardware', value: 'Semiconductors & Hardware' },
                { label: 'CleanTech & Energy', value: 'CleanTech & Energy' },
              ]}
            />
          </div>

          <div className="w-48">
            <Select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              options={[
                { label: 'All Scales', value: 'ALL' },
                { label: '1-10 Employees', value: '1-10 Employees' },
                { label: '11-50 Employees', value: '11-50 Employees' },
                { label: '51-200 Employees', value: '51-200 Employees' },
                { label: '201-500 Employees', value: '201-500 Employees' },
                { label: '500+ Employees', value: '500+ Employees' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-500">
            No verified companies matched your search criteria.
          </div>
        ) : (
          filteredCompanies.map((comp) => (
            <Card
              key={comp.id}
              isHoverable
              className="flex flex-col justify-between cursor-pointer bg-[#0c2130] border-[#17384e] hover:border-teal-500/40"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANY_DETAILS(comp.id))}
            >
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-sm shrink-0 shadow-xs">
                      {comp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100 font-heading">{comp.name}</h4>
                      <p className="text-xs text-teal-400 font-medium">{comp.industry}</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {comp.description}
                </p>

                {/* Products & Services summary */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  {comp.products && comp.products.length > 0 && (
                    <span className="text-teal-300">
                      {comp.products.length} {comp.products.length === 1 ? 'Product' : 'Products'}
                    </span>
                  )}
                  {comp.products && comp.products.length > 0 && comp.services && comp.services.length > 0 && (
                    <span>•</span>
                  )}
                  {comp.services && comp.services.length > 0 && (
                    <span className="text-cyan-300">
                      {comp.services.length} {comp.services.length === 1 ? 'Service' : 'Services'}
                    </span>
                  )}
                  {comp.foundedYear && (
                    <>
                      <span>•</span>
                      <span>Est. {comp.foundedYear}</span>
                    </>
                  )}
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {comp.technologies.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#091b27] text-[10px] text-slate-300 border border-[#17384e]">
                      {t}
                    </span>
                  ))}
                  {comp.technologies.length > 3 && (
                    <span className="text-[10px] text-slate-500 px-1 py-0.5">+{comp.technologies.length - 3}</span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#17384e] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {comp.headquarters.split(',')[0]}
                  </span>
                  <span className="text-teal-400 font-semibold flex items-center gap-1 group-hover:underline">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
