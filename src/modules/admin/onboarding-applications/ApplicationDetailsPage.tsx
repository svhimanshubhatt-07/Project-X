import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { useOnboarding } from '../../../features/onboarding/hooks/useOnboarding';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { useToast } from '../../../app/providers/ToastProvider';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  UploadCloud,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  Eye,
  Calendar,
  Building,
  Award,
  Check,
  FileCheck,
  X,
  RotateCcw,
} from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { ApplicationReviewActions } from './components/ApplicationReviewActions';

interface SectionVerificationState {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  reviewer?: string;
}

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApplicationById } = useOnboarding();
  const { users } = useUsers();
  const { success, error, info } = useToast();

  const application = id ? getApplicationById(id) : undefined;
  const [activeTab, setActiveTab] = useState<'overview' | 'tax' | 'documents'>('overview');
  const [previewDoc, setPreviewDoc] = useState<{ title: string; filename: string; type: string; size: string } | null>(null);

  // Section verification state for each of the 3 steps
  const [sectionVerifications, setSectionVerifications] = useState<Record<'overview' | 'tax' | 'documents', SectionVerificationState>>({
    overview: { status: 'PENDING' },
    tax: { status: 'PENDING' },
    documents: { status: 'PENDING' },
  });

  if (!application) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white font-heading">Application Not Found</h2>
        <p className="text-xs text-slate-400">The requested onboarding packet could not be retrieved.</p>
        <Button onClick={() => navigate(ROUTES.ADMIN.APPLICATIONS)} variant="secondary">
          Back to Applications List
        </Button>
      </div>
    );
  }

  // Linked / matched user
  const linkedUser = users.find(
    (u) =>
      u.email.toLowerCase() === (application.representative?.email || application.companyInfo?.businessEmail || '').toLowerCase() ||
      u.name.toLowerCase() === (application.representative?.fullName || application.applicantName || '').toLowerCase()
  );

  const city = application.legalInfo?.city || (application.companyInfo?.headquarters ? application.companyInfo.headquarters.split(',')[0]?.trim() : 'Bengaluru');
  const state = application.legalInfo?.state || (application.companyInfo?.headquarters ? application.companyInfo.headquarters.split(',')[1]?.trim() : 'Karnataka');
  const country = application.legalInfo?.country || 'India';
  const locationLink = `https://maps.google.com/?q=${encodeURIComponent(`${application.companyName} ${city} ${state}`)}`;

  // Tax Identifiers
  const registrationNo = application.gstInfo?.cinNumber || application.legalInfo?.registrationNumber || 'U72200KA2023PTC174829';
  const panNumber = application.gstInfo?.panNumber || 'AABCA1234D';
  const gstNumber = application.gstInfo?.gstNumber || '29AABCA1234D1Z5';
  const incorporationDate = application.legalInfo?.incorporationDate || '03/15/2023';
  const registrationAuthority = 'Ministry of Corporate Affairs (MCA) / Startup India';
  const recognitionNumber = 'DIPP123456 / UDYAM-00123';

  // 4 Statutory Documents matching onboarding
  const statutoryDocs = [
    {
      id: 'doc_1',
      title: 'Certificate of Incorporation (COI)',
      filename: `COI_${application.companyName.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '1.8 MB',
      uploadedAt: application.submissionDate,
      authority: 'Registrar of Companies (ROC / MCA)',
      status: 'Verified',
    },
    {
      id: 'doc_2',
      title: 'Corporate PAN Card',
      filename: `PAN_${application.companyName.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '0.9 MB',
      uploadedAt: application.submissionDate,
      authority: 'Income Tax Department (ITD)',
      status: 'Verified',
    },
    {
      id: 'doc_3',
      title: 'GST Registration Certificate (REG-06)',
      filename: `GST_Certificate_${application.companyName.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '1.4 MB',
      uploadedAt: application.submissionDate,
      authority: 'Goods & Services Tax Network (GSTN)',
      status: 'Verified',
    },
    {
      id: 'doc_4',
      title: 'Startup Recognition Certificate (DPIIT / MSME)',
      filename: `Startup_Recognition_${application.companyName.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '1.6 MB',
      uploadedAt: application.submissionDate,
      authority: 'Department for Promotion of Industry and Internal Trade',
      status: 'Verified',
    },
  ];

  const handleVerifyAndNext = (sectionKey: 'overview' | 'tax' | 'documents', sectionName: string, stepNum: number) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();

    setSectionVerifications((prev) => ({
      ...prev,
      [sectionKey]: {
        status: 'VERIFIED',
        verifiedAt: now,
        reviewer: 'Vikramaditya Roy (Admin)',
      },
    }));

    success(`${sectionName} VERIFIED successfully.`, 'Section Verified');

    // Automatically navigate to next step
    if (stepNum === 1) {
      setActiveTab('tax');
    } else if (stepNum === 2) {
      setActiveTab('documents');
    } else {
      info('All 3 sections verified! Application ready for final approval.', 'Verification Complete');
    }
  };

  const handleRejectSection = (sectionKey: 'overview' | 'tax' | 'documents', sectionName: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();

    setSectionVerifications((prev) => ({
      ...prev,
      [sectionKey]: {
        status: 'REJECTED',
        verifiedAt: now,
        reviewer: 'Vikramaditya Roy (Admin)',
      },
    }));

    error(`${sectionName} verification has been REJECTED.`, 'Section Rejected');
  };

  const handleResetSection = (sectionKey: 'overview' | 'tax' | 'documents', sectionName: string) => {
    setSectionVerifications((prev) => ({
      ...prev,
      [sectionKey]: {
        status: 'PENDING',
        verifiedAt: undefined,
        reviewer: undefined,
      },
    }));
    info(`${sectionName} status reset to Pending.`, 'Status Reset');
  };

  const handleDownloadDoc = (docTitle: string) => {
    info(`Downloading ${docTitle}...`);
  };

  const verifiedCount = [
    sectionVerifications.overview.status === 'VERIFIED',
    sectionVerifications.tax.status === 'VERIFIED',
    sectionVerifications.documents.status === 'VERIFIED',
  ].filter(Boolean).length;

  // Reusable Section Verification Card with BOTH "Reject Verification" and "Verify & Next"
  const renderSectionVerificationCard = (
    sectionKey: 'overview' | 'tax' | 'documents',
    sectionTitle: string,
    stepNum: number
  ) => {
    const verification = sectionVerifications[sectionKey];

    return (
      <Card
        className={`border transition-all duration-200 ${
          verification.status === 'VERIFIED'
            ? 'bg-gradient-to-r from-emerald-950/40 via-[#0a2323] to-[#091b27] border-emerald-500/50 shadow-lg shadow-emerald-950/30'
            : verification.status === 'REJECTED'
            ? 'bg-gradient-to-r from-rose-950/40 via-[#230a14] to-[#091b27] border-rose-500/50 shadow-lg shadow-rose-950/30'
            : 'bg-[#0a1e2d] border-[#1b435d]'
        }`}
      >
        <CardBody className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center text-xs font-bold font-mono">
                  {stepNum}
                </span>
                <h3 className="text-sm font-bold text-slate-100 font-heading">
                  Section {stepNum} Verification: {sectionTitle}
                </h3>
                {verification.status === 'VERIFIED' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    VERIFIED
                  </span>
                ) : verification.status === 'REJECTED' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1 shadow-sm">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    REJECTED
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    PENDING VERIFICATION
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                {verification.status === 'VERIFIED'
                  ? `Verified and signed off by ${verification.reviewer || 'Reviewer'} on ${verification.verifiedAt}.`
                  : verification.status === 'REJECTED'
                  ? `Marked as rejected by ${verification.reviewer || 'Reviewer'} on ${verification.verifiedAt}.`
                  : `Inspect the parameters above and choose 'Verify & Next' to approve or 'Reject Verification' to flag.`}
              </p>
            </div>

            {/* TWO ACTION BUTTONS: 1. Reject Verification  2. Verify & Next */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {verification.status !== 'PENDING' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetSection(sectionKey, sectionTitle)}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Reset
                </Button>
              )}

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRejectSection(sectionKey, sectionTitle)}
                leftIcon={<XCircle className="w-4 h-4 text-rose-200" />}
                className={`text-xs shadow-md shadow-rose-950/30 ${
                  verification.status === 'REJECTED' ? 'ring-2 ring-rose-400' : ''
                }`}
              >
                Reject Verification
              </Button>

              <Button
                variant="success"
                size="sm"
                onClick={() => handleVerifyAndNext(sectionKey, sectionTitle, stepNum)}
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-200" />}
                rightIcon={stepNum < 3 ? <ArrowRight className="w-3.5 h-3.5 ml-1 text-emerald-200" /> : undefined}
                className={`text-xs shadow-md shadow-emerald-500/20 font-semibold ${
                  verification.status === 'VERIFIED' ? 'ring-2 ring-emerald-400' : ''
                }`}
              >
                {stepNum < 3 ? 'Verify & Next' : 'Verify & Complete'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(ROUTES.ADMIN.APPLICATIONS)}
        leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        className="text-xs text-slate-400 hover:text-slate-100 -mb-2"
      >
        Back to Applications
      </Button>

      {/* Top Banner Card with Actions */}
      <Card className="bg-gradient-to-r from-teal-500/10 via-[#0c2130] to-cyan-500/10 border-[#17384e] shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 p-[2px] shrink-0 shadow-md">
                <div className="w-full h-full bg-[#091b27] rounded-[14px] flex items-center justify-center font-bold text-teal-400 text-xl">
                  {application.companyName.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading">
                    {application.companyName}
                  </h1>
                  <StatusBadge status={application.status} />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    {verifiedCount}/3 Sections Verified
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                  <span className="font-mono text-teal-400 font-semibold">{application.id}</span>
                  <span>•</span>
                  <span>Applicant: <strong className="text-slate-200 font-semibold">{application.applicantName}</strong></span>
                  <span>•</span>
                  <span>Industry: <strong className="text-slate-200 font-semibold">{application.industry}</strong></span>
                  <span>•</span>
                  <span>Submitted: {formatDate(application.submissionDate)}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Reject & Approve Company) */}
            <div className="shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#17384e]">
              <ApplicationReviewActions application={application} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 3 Step Tabs matching Onboarding Wizard with Verification Status Badges */}
      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as 'overview' | 'tax' | 'documents')}
        tabs={[
          {
            id: 'overview',
            label: '1. Basic Overview',
            icon:
              sectionVerifications.overview.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : sectionVerifications.overview.status === 'REJECTED' ? (
                <XCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <Building2 className="w-4 h-4 text-cyan-400" />
              ),
            count:
              sectionVerifications.overview.status === 'VERIFIED'
                ? '✓ Verified'
                : sectionVerifications.overview.status === 'REJECTED'
                ? '✕ Rejected'
                : undefined,
            badgeColor:
              sectionVerifications.overview.status === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : sectionVerifications.overview.status === 'REJECTED'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : undefined,
          },
          {
            id: 'tax',
            label: '2. Tax and Details',
            icon:
              sectionVerifications.tax.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : sectionVerifications.tax.status === 'REJECTED' ? (
                <XCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              ),
            count:
              sectionVerifications.tax.status === 'VERIFIED'
                ? '✓ Verified'
                : sectionVerifications.tax.status === 'REJECTED'
                ? '✕ Rejected'
                : undefined,
            badgeColor:
              sectionVerifications.tax.status === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : sectionVerifications.tax.status === 'REJECTED'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : undefined,
          },
          {
            id: 'documents',
            label: '3. Documents',
            icon:
              sectionVerifications.documents.status === 'VERIFIED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : sectionVerifications.documents.status === 'REJECTED' ? (
                <XCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <UploadCloud className="w-4 h-4 text-teal-400" />
              ),
            count:
              sectionVerifications.documents.status === 'VERIFIED'
                ? '✓ Verified'
                : sectionVerifications.documents.status === 'REJECTED'
                ? '✕ Rejected'
                : statutoryDocs.length,
            badgeColor:
              sectionVerifications.documents.status === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : sectionVerifications.documents.status === 'REJECTED'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : undefined,
          },
        ]}
      />

      {/* STEP 1: Basic Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Select User / Organization Owner Section */}
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader
                  title="Select User (Organization Owner / Representative)"
                  subtitle="Account owner and primary authorized signatory for this company application."
                />
                <CardBody className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#091b27] border border-[#17384e]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-lg shadow-inner">
                        {(application.representative?.fullName || application.applicantName || 'AU').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100 font-heading">
                            {application.representative?.fullName || application.applicantName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                            {linkedUser?.role ? linkedUser.role.replace('_', ' ') : 'FOUNDER / OWNER'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {application.representative?.email || application.companyInfo?.businessEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-300 sm:border-l sm:border-[#17384e] sm:pl-4">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Contact Phone</span>
                        <span className="font-semibold text-slate-200 mt-0.5 block">
                          {application.representative?.phone || application.companyInfo?.businessPhone}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Designation</span>
                        <span className="font-semibold text-slate-200 mt-0.5 block">
                          {application.representative?.designation || 'Director / Founder'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* 2. Company Overview Card */}
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader
                  title="Company & Organization Details"
                  subtitle="Entity profile and classification parameters"
                />
                <CardBody className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Organization Name</span>
                      <span className="text-sm font-bold text-slate-100 mt-1 block">
                        {application.legalInfo?.legalName || application.companyName}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Company Brand Name</span>
                      <span className="text-sm font-bold text-teal-400 mt-1 block">{application.companyName}</span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Company Type</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        {application.companyType || 'Startup (Early / Seed Stage)'}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Industry Sector</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        {application.industry || 'Tech & SaaS'}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Company Size</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        {application.companyInfo?.companySize || '11 - 50 Employees'}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Establish Year</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        📅 {application.companyInfo?.foundedYear || 2026}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Description about Company
                    </span>
                    <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] text-sm text-slate-300 leading-relaxed">
                      {application.companyInfo?.description ||
                        application.businessInfo?.businessDescription ||
                        'Provide a summary of company vision, primary products, target market, and focus areas...'}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* 3. Contact & Location Details */}
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader
                  title="Contact & Location Details"
                  subtitle="Communication channels, geographic coordinates, and regional address"
                />
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Official Contact Email</span>
                      <a
                        href={`mailto:${application.companyInfo?.businessEmail}`}
                        className="text-sm font-semibold text-teal-400 hover:underline mt-1 inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-teal-400" /> {application.companyInfo?.businessEmail}
                      </a>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Official Contact Phone</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {application.companyInfo?.businessPhone}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Website Link</span>
                      <a
                        href={application.companyInfo?.website || 'https://'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-cyan-400 hover:underline mt-1 inline-flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-cyan-400" /> {application.companyInfo?.website || 'https://'}
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                      </a>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Google Maps / Location Link</span>
                      <a
                        href={locationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-emerald-400 hover:underline mt-1 inline-flex items-center gap-1.5 truncate max-w-full"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">https://maps.google.com/?q=...</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">City</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">{city}</span>
                    </div>
                    <div className="bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">State</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">{state}</span>
                    </div>
                    <div className="bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Country</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">{country}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Column Summary & Verification Progress */}
            <div className="space-y-6">
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader title="Application Status & Review Progress" />
                <CardBody className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-4xl font-extrabold font-heading text-teal-400">
                      {Math.round((verifiedCount / 3) * 100)}%
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {verifiedCount} of 3 Sections Verified
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#091b27] overflow-hidden border border-[#17384e]">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${(verifiedCount / 3) * 100}%` }}
                    />
                  </div>
                  <div className="pt-4 border-t border-[#17384e] space-y-3 text-xs text-slate-400">
                    <div className="flex justify-between items-center">
                      <span>Packet ID:</span>
                      <span className="font-mono text-teal-400 font-semibold">{application.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Verification Status:</span>
                      <StatusBadge status={application.status} size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Submission Timestamp:</span>
                      <strong className="text-slate-200 font-semibold">{formatDate(application.submissionDate)}</strong>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader title="Verification Checklist" />
                <CardBody className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                    <span className="text-slate-300">Basic Overview Details</span>
                    {sectionVerifications.overview.status === 'VERIFIED' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : sectionVerifications.overview.status === 'REJECTED' ? (
                      <X className="w-4 h-4 text-rose-400" />
                    ) : (
                      <span className="text-[11px] text-amber-400">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                    <span className="text-slate-300">Tax & Registration</span>
                    {sectionVerifications.tax.status === 'VERIFIED' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : sectionVerifications.tax.status === 'REJECTED' ? (
                      <X className="w-4 h-4 text-rose-400" />
                    ) : (
                      <span className="text-[11px] text-amber-400">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                    <span className="text-slate-300">Statutory Documents</span>
                    {sectionVerifications.documents.status === 'VERIFIED' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : sectionVerifications.documents.status === 'REJECTED' ? (
                      <X className="w-4 h-4 text-rose-400" />
                    ) : (
                      <span className="text-[11px] text-amber-400">Pending</span>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Section 1 Verify Card */}
          {renderSectionVerificationCard('overview', 'Basic Overview & Organization Profile', 1)}
        </div>
      )}

      {/* STEP 2: Tax and Details */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <Card className="bg-[#0c2130] border-[#17384e]">
            <CardHeader
              title="Tax & Registration Details"
              subtitle="Statutory tax identifiers, incorporation timestamp, and recognition credentials"
            />
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">Company Registration No (CIN / LLPIN)</span>
                  <span className="font-mono text-sm font-bold text-teal-400 block tracking-wide">
                    {registrationNo}
                  </span>
                  <span className="text-[11px] text-emerald-400 inline-flex items-center gap-1 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" /> MCA Registered
                  </span>
                </div>

                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">PAN Number (Permanent Account No)</span>
                  <span className="font-mono text-sm font-bold text-amber-400 block tracking-wide">
                    {panNumber}
                  </span>
                  <span className="text-[11px] text-emerald-400 inline-flex items-center gap-1 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" /> ITD Verified
                  </span>
                </div>

                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">GST Number (GSTIN)</span>
                  <span className="font-mono text-sm font-bold text-cyan-400 block tracking-wide">
                    {gstNumber}
                  </span>
                  <span className="text-[11px] text-emerald-400 inline-flex items-center gap-1 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Regular GSTIN
                  </span>
                </div>

                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">Incorporation Date</span>
                  <span className="text-sm font-semibold text-slate-100 block inline-flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    {incorporationDate}
                  </span>
                </div>

                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">Registration Authority</span>
                  <span className="text-sm font-semibold text-slate-100 block inline-flex items-center gap-2 mt-1">
                    <Building className="w-4 h-4 text-purple-400" />
                    {registrationAuthority}
                  </span>
                </div>

                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] space-y-1">
                  <span className="text-xs text-slate-400 font-medium block">Recognition Number (DPIIT / MSME)</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 block tracking-wide">
                    {recognitionNumber}
                  </span>
                  <span className="text-[11px] text-teal-400 inline-flex items-center gap-1 font-medium mt-1">
                    <Award className="w-3 h-3" /> Startup India Recognized
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#17384e]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Official Registered Corporate Address
                </span>
                <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] text-xs text-slate-300 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block text-sm font-semibold mb-0.5">
                      {application.legalInfo?.legalName || application.companyName}
                    </strong>
                    <p className="leading-relaxed">
                      {application.legalInfo?.registeredAddress || `${city}, ${state}, ${country}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Section 2 Verify Card */}
          {renderSectionVerificationCard('tax', 'Tax & Registration Compliance Details', 2)}
        </div>
      )}

      {/* STEP 3: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <Card className="bg-[#0c2130] border-[#17384e]">
            <CardHeader
              title="Statutory & Compliance Documents"
              subtitle="All verified legal certificates and identification documents uploaded during onboarding"
            />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statutoryDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100 font-heading">{doc.title}</h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.filename}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {doc.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#17384e]">
                      <span>
                        Size: <strong className="text-slate-300">{doc.size}</strong> • {doc.type}
                      </span>
                      <span className="text-[11px] text-slate-400">Issued by: {doc.authority.split('(')[0]}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 text-xs"
                        leftIcon={<Eye className="w-3.5 h-3.5 text-cyan-400" />}
                        onClick={() =>
                          setPreviewDoc({
                            title: doc.title,
                            filename: doc.filename,
                            type: doc.type,
                            size: doc.size,
                          })
                        }
                      >
                        View Document
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        leftIcon={<Download className="w-3.5 h-3.5 text-teal-400" />}
                        onClick={() => handleDownloadDoc(doc.filename)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Section 3 Verify Card */}
          {renderSectionVerificationCard('documents', 'Statutory Uploaded Documents', 3)}
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#091b27] border border-[#17384e] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
            <div className="p-4 border-b border-[#17384e] flex items-center justify-between bg-[#0c2130]">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-heading">{previewDoc.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">{previewDoc.filename}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="h-64 rounded-xl bg-[#06121a] border border-[#17384e] flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{previewDoc.filename}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {previewDoc.type} • {previewDoc.size} • Digitally Signed & Encrypted
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified by ProjectX Compliance
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 bg-[#0c2130] p-3 rounded-xl border border-[#17384e]">
                <span>Entity: <strong className="text-slate-200">{application.companyName}</strong></span>
                <span>Registration No: <strong className="text-teal-400 font-mono">{registrationNo}</strong></span>
              </div>
            </div>

            <div className="p-4 border-t border-[#17384e] bg-[#0c2130] flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => {
                  handleDownloadDoc(previewDoc.filename);
                  setPreviewDoc(null);
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
