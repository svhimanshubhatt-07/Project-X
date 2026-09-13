import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  Layers,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Award,
  ShieldCheck,
  Calendar,
  Sparkles,
  Tag,
  Plus,
  HelpCircle,
} from 'lucide-react';

export const CompanyServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, getServiceById } = useServiceVerifications();
  const { companies } = useCompanies();
  const { user } = useAuth();

  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];

  const service = id ? getServiceById(id) || services.find((s) => s.id === id) : services[0];

  if (!service) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading">Service Specification Not Found</h2>
        <p className="text-xs text-slate-400">The requested service specification could not be located.</p>
        <Button
          onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_SERVICES)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to My Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={service.serviceName}
        subtitle="Detailed Service Specification, Deliverables & Marketplace Status"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.COMPANY_OWNER.DASHBOARD },
          { label: 'My Services', path: ROUTES.COMPANY_OWNER.MY_SERVICES },
          { label: service.serviceName },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_SERVICES)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to My Services
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.SERVICE_CREATE)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Another Service
            </Button>
          </div>
        }
      />

      {/* TOP SUMMARY HERO BANNER */}
      <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-primary)]/5 rounded-full blur-3xl pointer-events-none" />

        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#072b22] to-[#041a14] border border-[var(--brand-primary)]/40 flex items-center justify-center text-[var(--brand-primary)] shrink-0 shadow-[0_0_20px_rgba(0,229,153,0.15)]">
                <Layers className="w-7 h-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading tracking-tight">
                    {service.serviceName}
                  </h1>
                  <StatusBadge status={service.status} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[var(--brand-primary)] border border-emerald-500/30 font-semibold inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {service.category}
                  </span>

                  <span className="font-mono text-slate-400 bg-[var(--bg-card-inner)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)]">
                    ID: {service.id}
                  </span>

                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Submitted: {formatDate(service.submissionDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Delivery Model</span>
                <span className="text-xs font-bold text-slate-200 block truncate mt-0.5">{service.deliveryModel}</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-left">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Pricing Tier</span>
                <span className="text-xs font-bold text-emerald-300 font-mono block truncate mt-0.5">
                  {service.pricingTier}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-left col-span-2 sm:col-span-1">
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
        {/* Left Column (2 Cols): Service Specs, Deliverables, Compliance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Scope of Work & Specification */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
            <CardHeader
              title="Scope of Work & Specification"
              subtitle="Detailed functional overview and technical delivery description"
            />
            <CardBody className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs sm:text-sm text-slate-200 leading-relaxed">
                {service.description}
              </div>

              {/* SLA Guarantee Box */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
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

          {/* Section 2: Key Deliverables & Scope Checklist */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
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
                      className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-start gap-3 group hover:border-[var(--brand-primary)]/40 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-[var(--brand-primary)] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30 font-bold text-[10px]">
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

          {/* Section 3: Compliance Accreditations & Certifications */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
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
                      className="px-3.5 py-2 rounded-xl bg-[var(--bg-card-inner)] border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-2 shadow-sm"
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

        {/* Right Column (1 Col): Verification Pipeline Status & Company Dossier */}
        <div className="space-y-6">
          {/* Verification Status Card */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
            <CardHeader
              title="Verification Status"
              subtitle="Current lifecycle stage in platform directory"
            />
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Current Status:</span>
                <StatusBadge status={service.status} size="md" />
              </div>

              {/* Status Explanation Box */}
              {service.status === 'APPROVED' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active & Published</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    This capability is verified and visible to clients across the platform catalog and on your public profile.
                  </p>
                </div>
              )}

              {service.status === 'PENDING' && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting Admin Verification</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Your service has been submitted and is currently in the verification queue for technical & compliance checks.
                  </p>
                </div>
              )}

              {service.status === 'UNDER_REVIEW' && (
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Under Active Review</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Platform compliance team is actively evaluating the SLAs and credential documentation.
                  </p>
                </div>
              )}

              {service.status === 'REJECTED' && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>Action Required</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Please review reviewer remarks below and update your specifications accordingly.
                  </p>
                </div>
              )}

              {/* Reviewer Remarks */}
              {service.reviewerRemarks && (
                <div className="pt-2 border-t border-[var(--border-divider)] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Reviewer Notes / Feedback:
                  </span>
                  <p className="text-xs text-slate-300 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] leading-relaxed font-mono">
                    {service.reviewerRemarks}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Submitting Company Card */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
            <CardHeader
              title="Provider Company"
              subtitle="Registered enterprise identity"
            />
            <CardBody className="p-6 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center font-extrabold text-[var(--brand-primary)] text-sm shrink-0">
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

              <div className="pt-2 border-t border-[var(--border-divider)] space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>CIN:</span>
                  <span className="text-slate-200 font-mono font-semibold">{myCompany?.cinNumber || 'Verified MCA'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Headquarters:</span>
                  <span className="text-slate-200">{myCompany?.headquarters || 'India'}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
