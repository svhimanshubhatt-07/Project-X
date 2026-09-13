import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
  Tag,
  ShieldCheck,
  Award,
  ArrowRight,
  Eye,
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const MyServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { companies } = useCompanies();
  const { user } = useAuth();
  const { services } = useServiceVerifications();

  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];

  // Filter services belonging to the logged-in company owner's company
  const companyServices = services.filter((s) => {
    if (!myCompany) return false;
    return (
      s.companyId === myCompany.id ||
      s.companyName.toLowerCase() === myCompany.name.toLowerCase()
    );
  });

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'UNDER_REVIEW' | 'REJECTED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Compute categories available for this company
  const uniqueCategories = Array.from(new Set(companyServices.map((s) => s.category)));

  // Filtered services
  const filteredServices = companyServices.filter((service) => {
    const matchesStatus =
      selectedStatus === 'ALL' || service.status === selectedStatus;

    const matchesCategory =
      selectedCategory === 'ALL' || service.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.deliveryModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Metrics
  const totalCount = companyServices.length;
  const approvedCount = companyServices.filter((s) => s.status === 'APPROVED').length;
  const pendingCount = companyServices.filter((s) => s.status === 'PENDING').length;
  const underReviewCount = companyServices.filter((s) => s.status === 'UNDER_REVIEW').length;
  const rejectedCount = companyServices.filter((s) => s.status === 'REJECTED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title="My Services & Solutions"
        subtitle="Manage and list your proprietary capabilities, service specifications, pricing tiers, and directly publish them to the marketplace."
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.COMPANY_OWNER.DASHBOARD },
          { label: 'My Services' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.SERVICE_CREATE)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-[0_0_20px_rgba(0,229,153,0.25)]"
            >
              Add Service
            </Button>
          </div>
        }
      />

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Total Services */}
        <div className="p-4 rounded-2xl bg-[var(--bg-table)] border border-[var(--border-table)] relative overflow-hidden group hover:border-[var(--brand-primary)]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Services</span>
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-100 font-heading">
            {totalCount}
          </div>
          <span className="text-[11px] text-teal-400 mt-0.5 block font-medium">
            Listed for {myCompany?.name}
          </span>
        </div>

        {/* Active & Published */}
        <div className="p-4 rounded-2xl bg-[var(--bg-table)] border border-[var(--border-table)] relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active & Published</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-heading">
            {approvedCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Public marketplace live
          </span>
        </div>

        {/* Unique Categories */}
        <div className="p-4 rounded-2xl bg-[var(--bg-table)] border border-[var(--border-table)] relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Service Categories</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-cyan-400 font-heading">
            {uniqueCategories.length || 1}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Active domain verticals
          </span>
        </div>
      </div>

      {/* Main Filter & Action Controls Card */}
      <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl">
        <CardBody className="p-4 sm:p-5 space-y-4">
          {/* Top Row: Search & Category Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, categories, pricing..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            {/* Category Filter & Status Tabs */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {uniqueCategories.length > 0 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-200 text-xs focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.COMPANY_OWNER.SERVICE_CREATE)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="ml-auto sm:ml-0"
              >
                Add Service
              </Button>
            </div>
          </div>

          {/* Bottom Row: Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-[var(--border-divider)] pt-3">
            {[
              { id: 'ALL', label: 'All Services', count: totalCount },
              { id: 'APPROVED', label: 'Approved & Active', count: approvedCount },
              { id: 'PENDING', label: 'Pending Verification', count: pendingCount },
              { id: 'UNDER_REVIEW', label: 'Under Review', count: underReviewCount },
              { id: 'REJECTED', label: 'Rejected', count: rejectedCount },
            ].map((tab) => {
              const isActive = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-card-inner)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-[var(--brand-primary)] text-slate-950 font-bold'
                        : 'bg-[var(--bg-card-inner)] text-slate-400 border border-[var(--border-subtle)]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Services Grid / List */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="bg-[var(--bg-table)] border border-[var(--border-table)] hover:border-[var(--brand-primary)]/50 shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <CardBody className="p-6 space-y-5">
                {/* Card Top Bar */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#072b22] to-[#041a14] border border-[var(--brand-primary)]/30 flex items-center justify-center text-[var(--brand-primary)] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[var(--brand-primary)] border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 mb-1">
                        <Tag className="w-3 h-3" />
                        {service.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 font-heading group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1">
                        {service.serviceName}
                      </h3>
                    </div>
                  </div>

                  <StatusBadge status={service.status} size="sm" />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Specs Pills */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Delivery Model</span>
                    <span className="font-semibold text-slate-200 truncate block mt-0.5">
                      {service.deliveryModel}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Pricing Tier</span>
                    <span className="font-semibold text-emerald-300 font-mono truncate block mt-0.5">
                      {service.pricingTier}
                    </span>
                  </div>
                </div>

                {/* Deliverables Preview Checklist */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Key Deliverables ({service.deliverables.length})
                    </span>
                    <div className="space-y-1">
                      {service.deliverables.slice(0, 2).map((deliv, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                          <span className="truncate">{deliv}</span>
                        </div>
                      ))}
                      {service.deliverables.length > 2 && (
                        <span className="text-[11px] text-teal-400 font-medium block pl-5">
                          +{service.deliverables.length - 2} more deliverables included
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications Chips */}
                {service.certifications && service.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-card-inner)] border border-cyan-500/30 text-cyan-300 text-[10px] font-medium flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-cyan-400" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                )}
              </CardBody>

              {/* Card Footer Bar */}
              <div className="p-4 border-t border-[var(--border-divider)] bg-[var(--bg-card-inner)]/50 rounded-b-2xl flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submitted {formatDate(service.submissionDate)}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.COMPANY_OWNER.SERVICE_DETAILS(service.id))}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--brand-primary)]">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-heading">
                {searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL'
                  ? 'No Matching Services Found'
                  : 'No Services Listed Yet'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL'
                  ? 'Try adjusting your search query, status filters, or category filters.'
                  : 'Start showcasing your corporate solutions, delivery models, and SLA commitments to potential enterprise partners.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              {searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('ALL');
                    setSelectedCategory('ALL');
                  }}
                >
                  Clear Filters
                </Button>
              ) : null}

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.COMPANY_OWNER.SERVICE_CREATE)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-[0_0_20px_rgba(0,229,153,0.3)]"
              >
                Add Your First Service
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
