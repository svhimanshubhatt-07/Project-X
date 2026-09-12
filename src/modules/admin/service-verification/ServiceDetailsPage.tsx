import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useServiceProviders } from '../../../features/service-providers/hooks/useServiceProviders';
import { INITIAL_SERVICE_TYPES } from '../service-providers/components/ServiceListCatalog';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  Layers,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ArrowLeft,
  Check,
  X,
  Award,
  ShieldCheck,
  Calendar,
  ExternalLink,
  DollarSign,
  Truck,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Tag,
  Copy,
  Activity,
  Send,
} from 'lucide-react';

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, getServiceById, approveService, rejectService, setServiceStatus } = useServiceVerifications();
  const { companies } = useCompanies();
  const { serviceProviders } = useServiceProviders();
  const { success, info, error } = useToast();

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
        isVerificationRecord: true,
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
        reviewerRemarks: 'Standard platform verified enterprise capability.',
        isVerificationRecord: false,
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
        isVerificationRecord: true,
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

  // Verification Decision State
  const [reviewerRemarks, setReviewerRemarks] = useState(service?.reviewerRemarks || '');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!service) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading">Service Not Found</h2>
        <p className="text-sm text-slate-400">The requested service specification could not be found.</p>
        <Button
          onClick={() => navigate(`${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services`)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Service List
        </Button>
      </div>
    );
  }

  const handleApprove = () => {
    setIsProcessing(true);
    try {
      approveService(service.id, reviewerRemarks.trim() || undefined);
      success(`Service "${service.name}" has been successfully verified & published!`);
    } catch {
      error('Failed to approve service.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkUnderReview = () => {
    setIsProcessing(true);
    try {
      setServiceStatus(
        service.id,
        'UNDER_REVIEW',
        reviewerRemarks.trim() || 'Compliance team is reviewing technical capabilities and SLAs.'
      );
      info(`Service "${service.name}" is now marked Under Review.`);
    } catch {
      error('Failed to update service status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      error('Please specify a rejection reason for the applicant company.');
      return;
    }
    setIsProcessing(true);
    try {
      rejectService(service.id, rejectReason.trim());
      success(`Service "${service.name}" rejected. Feedback notification dispatched.`);
      setIsRejecting(false);
      setRejectReason('');
    } catch {
      error('Failed to reject service.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={service.name}
        subtitle="Comprehensive Service Specification Dossier & Verification Decision"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
          { label: 'Service Providers', path: ROUTES.ADMIN.SERVICE_PROVIDERS },
          { label: 'Service List', path: `${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services` },
          { label: service.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services`)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Service List
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
                    {service.name}
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
                  {service.certifications.length} Accredited
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
          {/* Section 1: Scope of Work & Capabilities */}
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
              subtitle={`${service.deliverables.length} verified milestone deliverables defined for this service`}
            />
            <CardBody className="p-6">
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
            </CardBody>
          </Card>

          {/* Section 3: Compliance Accreditations & Certifications */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
            <CardHeader
              title="Compliance Accreditations & Standards"
              subtitle="Verified industrial, security, and quality compliance credentials"
            />
            <CardBody className="p-6">
              {service.certifications.length > 0 ? (
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

        {/* Right Column (1 Col): Submitting Company Profile & Audit Metadata */}
        <div className="space-y-6">
          {/* Submitting Company Card */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
            <CardHeader
              title="Submitting Company"
              subtitle="Enterprise offering this service"
            />
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center font-extrabold text-[var(--brand-primary)] text-lg shrink-0 shadow-inner">
                  {service.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
                    <span>{service.companyName}</span>
                  </h4>
                  <span className="text-xs text-teal-400 font-medium block truncate mt-0.5">
                    {service.companyIndustry}
                  </span>
                </div>
              </div>

              {company && (
                <div className="space-y-2.5 pt-3 border-t border-[var(--border-divider)] text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">CIN Number:</span>
                    <span className="font-mono font-semibold">{company.cinNumber || 'Verified MCA'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Company Status:</span>
                    <StatusBadge status={company.verificationStatus} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Headquarters:</span>
                    <span className="text-slate-200">{company.headquarters || 'India'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Incorporation:</span>
                    <span className="font-mono">{company.incorporationDate || '2023'}</span>
                  </div>
                </div>
              )}

              {company ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/companies/${company.id}`)}
                  className="w-full text-xs"
                  leftIcon={<Building2 className="w-3.5 h-3.5 text-teal-400" />}
                >
                  View Full Company Profile
                </Button>
              ) : (
                <div className="text-[11px] text-slate-400">Company ID: {service.companyId}</div>
              )}
            </CardBody>
          </Card>

          {/* Verification Audit Dossier */}
          <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
            <CardHeader
              title="Verification Audit Info"
              subtitle="Lifecycle log and reviewer history"
            />
            <CardBody className="p-6 space-y-3.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Current Status:</span>
                <StatusBadge status={service.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Submission Date:</span>
                <span className="font-mono">{formatDate(service.submissionDate)}</span>
              </div>

              {service.decidedDate && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Decision Date:</span>
                  <span className="font-mono">{formatDate(service.decidedDate)}</span>
                </div>
              )}

              {service.reviewerRemarks && (
                <div className="pt-2 border-t border-[var(--border-divider)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Reviewer Notes / Remarks:
                  </span>
                  <p className="text-slate-300 p-2.5 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] leading-relaxed">
                    {service.reviewerRemarks}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* FINAL SECTION: VERIFY SERVICE DECISION CENTER */}
      <Card className="bg-gradient-to-b from-[#072b22] to-[#041a14] border-2 border-[var(--brand-primary)]/60 shadow-[0_0_30px_rgba(0,229,153,0.15)] rounded-2xl">
        <CardHeader
          title="Verify Service — Administrative Decision Center"
          subtitle="Review technical capabilities, adjust verification notes, and submit formal approval or rejection decision"
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Current Decision:</span>
              <StatusBadge status={service.status} size="sm" />
            </div>
          }
        />
        <CardBody className="p-6 space-y-6">
          {/* Reviewer Note / Remarks Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
              Verification / Compliance Audit Remarks
            </label>
            <textarea
              rows={3}
              value={reviewerRemarks}
              onChange={(e) => setReviewerRemarks(e.target.value)}
              placeholder="Add verification findings, SLA confirmation notes, or internal comments regarding this service offering..."
              className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Rejection Form Drawer (if rejection active) */}
          {isRejecting && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Specify Formal Rejection Reason for Company
              </div>
              <textarea
                rows={2}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain the compliance gap, missing documentation, or justification for rejecting this service..."
                className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-rose-500/40 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-rose-400 resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setIsRejecting(false);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  type="button"
                  disabled={isProcessing}
                  onClick={handleReject}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Confirm Rejection & Dispatch Notice
                </Button>
              </div>
            </div>
          )}

          {/* Decision Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-divider)]">
            <div className="text-xs text-slate-400">
              Approved services will automatically be published to the Marketplace Catalog.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {service.status !== 'UNDER_REVIEW' && service.status !== 'APPROVED' && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isProcessing}
                  onClick={handleMarkUnderReview}
                  leftIcon={<FileText className="w-4 h-4 text-blue-400" />}
                >
                  Mark Under Review
                </Button>
              )}

              {service.status !== 'REJECTED' && !isRejecting && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isProcessing}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/40"
                  onClick={() => setIsRejecting(true)}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Reject Service
                </Button>
              )}

              {service.status !== 'APPROVED' && (
                <Button
                  type="button"
                  variant="primary"
                  disabled={isProcessing}
                  onClick={handleApprove}
                  leftIcon={<Check className="w-4 h-4" />}
                  className="shadow-[0_0_20px_rgba(0,229,153,0.3)]"
                >
                  Verify & Approve Service
                </Button>
              )}

              {service.status === 'APPROVED' && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/15 px-4 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Service is Verified & Active in Catalog
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
