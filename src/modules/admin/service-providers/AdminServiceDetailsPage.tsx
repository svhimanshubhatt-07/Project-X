import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useServiceProviders } from '../../../features/service-providers/hooks/useServiceProviders';
import { INITIAL_SERVICE_TYPES } from './components/ServiceListCatalog';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  Layers,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Award,
  ShieldCheck,
  Calendar,
  Tag,
  Eye,
} from 'lucide-react';

export const AdminServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, getServiceById } = useServiceVerifications();
  const { companies } = useCompanies();
  const { serviceProviders } = useServiceProviders();

  const verifiedRecord = id ? getServiceById(id) || services.find((s) => s.id === id) : null;
  const catalogItem = id ? INITIAL_SERVICE_TYPES.find((s) => s.id === id) : null;

  // Matched provider for catalog item
  const matchedProvider = catalogItem
    ? serviceProviders.find((sp) => catalogItem.providerIds.includes(sp.id)) || serviceProviders[0]
    : null;

  // Normalized service object
  const service = verifiedRecord
    ? {
        id: verifiedRecord.id,
        name: verifiedRecord.serviceName,
        category: verifiedRecord.category,
        companyId: verifiedRecord.companyId,
        companyName: verifiedRecord.companyName,
        companyIndustry: verifiedRecord.companyIndustry,
        deliveryModel: verifiedRecord.deliveryModel,
        pricingTier: verifiedRecord.pricingTier,
        slaCommitment: verifiedRecord.slaCommitment,
        description: verifiedRecord.description,
        deliverables: verifiedRecord.deliverables,
        certifications: verifiedRecord.certifications,
        status: verifiedRecord.status,
        submissionDate: verifiedRecord.submissionDate,
        decidedDate: verifiedRecord.decidedDate,
        reviewerRemarks: verifiedRecord.reviewerRemarks,
      }
    : catalogItem
    ? {
        id: catalogItem.id,
        name: catalogItem.name,
        category: catalogItem.category,
        companyId: matchedProvider?.id || 'sp_01',
        companyName: matchedProvider?.name || 'Apex Cloud Solutions Pvt Ltd',
        companyIndustry: catalogItem.category,
        deliveryModel: catalogItem.deliveryTime,
        pricingTier: catalogItem.pricing,
        slaCommitment: '99.98% production uptime SLA with < 1-hour critical response.',
        description: catalogItem.description,
        deliverables: catalogItem.deliverables,
        certifications: ['ISO 9001:2015', 'SOC 2 Type II', 'ISO 27001'],
        status: 'APPROVED' as const,
        submissionDate: '2025-06-15',
        decidedDate: '2025-06-16',
        reviewerRemarks: 'Published directly by company owner.',
      }
    : services[0]
    ? {
        id: services[0].id,
        name: services[0].serviceName,
        category: services[0].category,
        companyId: services[0].companyId,
        companyName: services[0].companyName,
        companyIndustry: services[0].companyIndustry,
        deliveryModel: services[0].deliveryModel,
        pricingTier: services[0].pricingTier,
        slaCommitment: services[0].slaCommitment,
        description: services[0].description,
        deliverables: services[0].deliverables,
        certifications: services[0].certifications,
        status: services[0].status,
        submissionDate: services[0].submissionDate,
        decidedDate: services[0].decidedDate,
        reviewerRemarks: services[0].reviewerRemarks,
      }
    : null;

  // Matched company record
  const company = service
    ? companies.find(
        (c) =>
          c.id === service.companyId ||
          c.name.toLowerCase() === service.companyName.toLowerCase()
      )
    : null;

  if (!service) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-[#1F2937] flex items-center justify-center mx-auto text-slate-500">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading">Service Specification Not Found</h2>
        <p className="text-xs text-slate-400">The requested service specification could not be located.</p>
        <Button
          onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <PageHeader
        title={service.name}
        subtitle="Complete service specifications, deliverables, and company profile."
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
          { label: 'Companies', path: ROUTES.ADMIN.COMPANIES },
          { label: service.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          </div>
        }
      />

      {/* TOP SUMMARY HERO BANNER */}
      <Card className="bg-[#111827] border border-[#1F2937] shadow-xl relative overflow-hidden">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0e223d] border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] shrink-0 shadow-inner">
                <Layers className="w-7 h-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading tracking-tight">
                    {service.name}
                  </h1>
                  <StatusBadge status={service.status} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {service.category}
                  </span>

                  <span className="font-mono text-slate-400 bg-[#0B0F14] px-2.5 py-1 rounded-lg border border-[#1F2937]">
                    ID: {service.id}
                  </span>

                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Listed: {formatDate(service.submissionDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#1F2937] text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Delivery Model</span>
                <span className="text-xs font-bold text-slate-200 block truncate mt-0.5">{service.deliveryModel}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#1F2937] text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Pricing Model</span>
                <span className="text-xs font-bold text-emerald-300 font-mono block truncate mt-0.5">
                  {service.pricingTier}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#1F2937] text-left col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Certifications</span>
                <span className="text-xs font-bold text-cyan-300 block truncate mt-0.5">
                  {service.certifications?.length || 0} Accredited
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 2-COLUMN MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Scope of Work, Deliverables, Compliance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Scope of Work */}
          <Card className="bg-[#111827] border border-[#1F2937] shadow-lg">
            <CardHeader
              title="Scope of Work & Specification"
              subtitle="Detailed functional overview and technical delivery description"
            />
            <CardBody className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0F14] border border-[#1F2937] text-xs sm:text-sm text-slate-200 leading-relaxed">
                {service.description}
              </div>

              {/* SLA Guarantee Box */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    SLA & Availability Commitment
                  </h4>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {service.slaCommitment || '99.9% uptime SLA with dedicated technical support and incident management.'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Section 2: Committed Deliverables */}
          <Card className="bg-[#111827] border border-[#1F2937] shadow-lg">
            <CardHeader
              title="Committed Deliverables & Milestones"
              subtitle={`${service.deliverables?.length || 0} milestone deliverables defined for this service`}
            />
            <CardBody className="p-6">
              {service.deliverables && service.deliverables.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.deliverables.map((deliv, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-[#0B0F14] border border-[#1F2937] flex items-start gap-3 group hover:border-[#3B82F6]/40 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30 font-bold text-[10px]">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-slate-200 block group-hover:text-slate-100 transition-colors">
                          {deliv}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No specific deliverables listed.</p>
              )}
            </CardBody>
          </Card>

          {/* Section 3: Compliance & Certifications */}
          <Card className="bg-[#111827] border border-[#1F2937] shadow-lg">
            <CardHeader
              title="Compliance Accreditations & Standards"
              subtitle="Verified industrial, security, and quality compliance credentials"
            />
            <CardBody className="p-6">
              {service.certifications && service.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {service.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="px-3.5 py-2 rounded-xl bg-[#0B0F14] border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-2 shadow-sm"
                    >
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No specific compliance certifications listed for this service.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column (1 Col): Provider Company Details */}
        <div className="space-y-6">
          <Card className="bg-[#111827] border border-[#1F2937] shadow-lg">
            <CardHeader
              title="Provider Company"
              subtitle="Registered enterprise identity"
            />
            <CardBody className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0e223d] border border-[#3B82F6]/30 flex items-center justify-center font-extrabold text-[#3B82F6] text-sm shrink-0">
                  {service.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 truncate">
                    {service.companyName}
                  </h4>
                  <span className="text-[11px] text-teal-400 font-medium block truncate">
                    {service.companyIndustry}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>CIN:</span>
                  <span className="text-slate-200 font-mono font-semibold">{company?.cinNumber || 'Verified MCA'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Headquarters:</span>
                  <span className="text-slate-200">{company?.headquarters || 'India'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Company Status:</span>
                  <span className="text-emerald-400 font-semibold">{company?.companyStatus || 'ACTIVE'}</span>
                </div>
              </div>

              {company && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id))}
                  leftIcon={<Building2 className="w-3.5 h-3.5" />}
                >
                  View Full Company Profile
                </Button>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
