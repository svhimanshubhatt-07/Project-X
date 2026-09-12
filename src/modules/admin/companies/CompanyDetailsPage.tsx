import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { ConfirmDialog } from '../../../shared/components/dashboard/ConfirmDialog';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { useToast } from '../../../app/providers/ToastProvider';
import { formatDate } from '../../../shared/utils/formatDate';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Edit3,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  Download,
  Calendar,
  Award,
  Building,
  Check,
  FileCheck,
  X,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes.constants';

interface SectionVerificationState {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  reviewer?: string;
}

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById, setCompanyStatus, setListingStatus } = useCompanies();
  const { users } = useUsers();
  const { success, error, info } = useToast();

  const company = id ? getCompanyById(id) : undefined;
  const [activeTab, setActiveTab] = useState<'overview' | 'tax' | 'documents'>('overview');

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; filename: string; type: string; size: string } | null>(null);

  // Section verifications for all 3 steps
  const [sectionVerifications, setSectionVerifications] = useState<Record<'overview' | 'tax' | 'documents', SectionVerificationState>>({
    overview: { status: 'VERIFIED', verifiedAt: 'Live Verified', reviewer: 'Admin' },
    tax: { status: 'VERIFIED', verifiedAt: 'MCA & GST Verified', reviewer: 'Admin' },
    documents: { status: 'VERIFIED', verifiedAt: 'All 4 Docs Verified', reviewer: 'Admin' },
  });

  if (!company) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white font-heading">Company Not Found</h2>
        <Button onClick={() => navigate(ROUTES.ADMIN.COMPANIES)} variant="secondary">
          Return to Companies
        </Button>
      </div>
    );
  }

  // Find linked user
  const linkedUser = company.userId
    ? users.find((u) => u.id === company.userId)
    : users.find(
        (u) =>
          u.email.toLowerCase() === (company.email || '').toLowerCase() ||
          u.email.toLowerCase() === (company.representativeEmail || '').toLowerCase() ||
          u.name.toLowerCase() === (company.representativeName || '').toLowerCase()
      );

  // Extract address parts
  const city = company.city || (company.headquarters ? company.headquarters.split(',')[0]?.trim() : 'Bengaluru');
  const state = company.state || (company.headquarters ? company.headquarters.split(',')[1]?.trim() : 'Karnataka');
  const country = company.country || 'India';
  const locationLink =
    company.locationLink ||
    `https://maps.google.com/?q=${encodeURIComponent(`${company.name} ${company.headquarters || 'Bengaluru'}`)}`;

  // Statutory Tax Defaults
  const panNumber = company.panNumber || 'AAACB' + (company.cinNumber ? company.cinNumber.slice(-4) : '4918') + 'K';
  const registrationNo = company.cinNumber || 'U72200KA2021PTC148920';
  const gstNumber = company.gstNumber || '29AABCS1429B1ZB';
  const incorporationDate = company.incorporationDate || `15/04/${company.foundedYear || 2021}`;
  const registrationAuthority = company.registrationAuthority || 'Ministry of Corporate Affairs (MCA) / Startup India';
  const recognitionNumber = company.recognitionNumber || `DPIIT-${company.cinNumber ? company.cinNumber.slice(-6) : '849201'}`;

  // Statutory Documents
  const documentList = [
    {
      id: 'doc_1',
      title: 'Certificate of Incorporation (COI)',
      filename: `COI_${company.name.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '1.8 MB',
      uploadedAt: company.joinedDate || '2024-01-15',
      authority: 'Registrar of Companies (ROC)',
      status: 'Verified',
    },
    {
      id: 'doc_2',
      title: 'Corporate PAN Card',
      filename: `PAN_${company.name.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '0.9 MB',
      uploadedAt: company.joinedDate || '2024-01-15',
      authority: 'Income Tax Department (ITD)',
      status: 'Verified',
    },
    {
      id: 'doc_3',
      title: 'GST Registration Certificate (REG-06)',
      filename: `GST_Certificate_${company.name.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '1.4 MB',
      uploadedAt: company.joinedDate || '2024-01-15',
      authority: 'Goods & Services Tax Network (GSTN)',
      status: 'Verified',
    },
    {
      id: 'doc_4',
      title: 'Startup Recognition Certificate (DPIIT / MSME)',
      filename: `Startup_Recognition_${company.name.replace(/\s+/g, '_')}.pdf`,
      type: 'PDF Document',
      size: '1.6 MB',
      uploadedAt: company.joinedDate || '2024-01-15',
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
        reviewer: 'Admin Reviewer',
      },
    }));

    success(`${sectionName} has been VERIFIED.`, 'Section Verified');

    // Advance tab
    if (stepNum === 1) {
      setActiveTab('tax');
    } else if (stepNum === 2) {
      setActiveTab('documents');
    } else {
      info('All 3 sections verified for this company entity.', 'Verification Complete');
    }
  };

  const handleRejectSection = (sectionKey: 'overview' | 'tax' | 'documents', sectionName: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();

    setSectionVerifications((prev) => ({
      ...prev,
      [sectionKey]: {
        status: 'REJECTED',
        verifiedAt: now,
        reviewer: 'Admin Reviewer',
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
    info(`${sectionName} verification marked as pending.`, 'Status Reset');
  };

  const handleToggleSuspend = () => {
    if (company.companyStatus === 'SUSPENDED') {
      setCompanyStatus(company.id, 'ACTIVE');
      setListingStatus(company.id, 'ACTIVE');
      setIsActivateModalOpen(false);
      success(`Company ${company.name} reactivated successfully.`, 'Status Updated');
    } else {
      setCompanyStatus(company.id, 'SUSPENDED');
      setListingStatus(company.id, 'SUSPENDED');
      setIsSuspendModalOpen(false);
      success(`Company ${company.name} and its listings have been suspended.`, 'Company Suspended');
    }
  };

  const handleDownloadDoc = (docTitle: string) => {
    info(`Downloading ${docTitle}...`);
  };

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
                  ? `Verified and signed off by ${verification.reviewer || 'Compliance Admin'} on ${verification.verifiedAt}.`
                  : verification.status === 'REJECTED'
                  ? `Marked as rejected by ${verification.reviewer || 'Compliance Admin'} on ${verification.verifiedAt}.`
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
        onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
        leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        className="text-xs text-slate-400 hover:text-white -mb-2"
      >
        Back to Companies
      </Button>

      {/* Hero Header Card */}
      <Card className="bg-gradient-to-r from-teal-500/10 via-[#0c2130] to-cyan-500/10 border-[#17384e] shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 p-[2px] shrink-0 shadow-md">
                <div className="w-full h-full bg-[#091b27] rounded-[14px] flex items-center justify-center font-bold text-teal-400 text-xl">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading">
                    {company.name}
                  </h1>
                  <StatusBadge status={company.verificationStatus} />
                  <StatusBadge status={company.companyStatus} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                  <span className="font-mono text-teal-400 font-semibold">{company.id}</span>
                  <span>•</span>
                  <span>Type: <strong className="text-slate-200 font-semibold">{company.companyType || 'Startup'}</strong></span>
                  <span>•</span>
                  <span>Industry: <strong className="text-slate-200 font-semibold">{company.industry}</strong></span>
                  <span>•</span>
                  <span>Scale: <strong className="text-slate-200 font-semibold">{company.companySize}</strong></span>
                  <span>•</span>
                  <span>Established: <strong className="text-slate-200 font-semibold">{company.foundedYear}</strong></span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.ADMIN.COMPANY_EDIT(company.id))}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Entity
              </Button>

              {company.companyStatus === 'SUSPENDED' ? (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => setIsActivateModalOpen(true)}
                  leftIcon={<PlayCircle className="w-4 h-4" />}
                >
                  Reactivate Company
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsSuspendModalOpen(true)}
                  leftIcon={<PauseCircle className="w-4 h-4" />}
                >
                  Suspend Company
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 3 Step Tabs matching Onboarding with Verification Badges */}
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
                : documentList.length,
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
              {/* 1. Primary User / Registered User Section */}
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader
                  title="Primary Account Owner / Registered User"
                  subtitle="The platform user under whose name this organization was onboarded."
                />
                <CardBody className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#091b27] border border-[#17384e]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-lg shadow-inner">
                        {(linkedUser?.name || company.representativeName || 'AU').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100 font-heading">
                            {linkedUser?.name || company.representativeName || 'Authorized Signatory'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                            {linkedUser?.role ? linkedUser.role.replace('_', ' ') : 'REGISTERED USER'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {linkedUser?.email || company.representativeEmail || company.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-300 sm:border-l sm:border-[#17384e] sm:pl-4">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Contact Phone</span>
                        <span className="font-semibold text-slate-200 mt-0.5 block">
                          {linkedUser?.phone || company.representativePhone || company.phone}
                        </span>
                      </div>
                      {linkedUser && (
                        <div>
                          <span className="text-[11px] text-slate-400 block font-medium">Status</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        </div>
                      )}
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
                        {company.legalName || company.name}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Company Brand Name</span>
                      <span className="text-sm font-bold text-teal-400 mt-1 block">{company.name}</span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Company Type</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        {company.companyType || 'Startup'}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Industry Sector</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">{company.industry}</span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Company Size</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">{company.companySize}</span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Establish Year</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        📅 {company.foundedYear}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      About / Executive Description
                    </span>
                    <div className="bg-[#091b27] p-4 rounded-xl border border-[#17384e] text-sm text-slate-300 leading-relaxed">
                      {company.description}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* 3. Contact & Location Information */}
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader
                  title="Contact & Location Information"
                  subtitle="Official communication and geographic coordinates"
                />
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Official Mail</span>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-sm font-semibold text-teal-400 hover:underline mt-1 inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-teal-400" /> {company.email}
                      </a>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Contact Phone</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {company.phone}
                      </span>
                    </div>
                    <div className="bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Website Link</span>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-cyan-400 hover:underline mt-1 inline-flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-cyan-400" /> {company.website}
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
                        <span className="truncate">View Location on Map</span>
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

            {/* Right Column Status & Verification Metrics */}
            <div className="space-y-6">
              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader title="Profile Completion & Status" />
                <CardBody className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-4xl font-extrabold font-heading text-teal-400">
                      {company.profileCompletion || 100}%
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All Onboarding Steps Complete
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#091b27] overflow-hidden border border-[#17384e]">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 rounded-full"
                      style={{ width: `${company.profileCompletion || 100}%` }}
                    />
                  </div>
                  <div className="pt-4 border-t border-[#17384e] space-y-3 text-xs text-slate-400">
                    <div className="flex justify-between items-center">
                      <span>Listing Visibility:</span>
                      <span className="px-2 py-0.5 rounded-md font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                        {company.listingStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Account Verification:</span>
                      <span className="px-2 py-0.5 rounded-md font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                        {company.verificationStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Onboarding Date:</span>
                      <strong className="text-slate-200">{formatDate(company.joinedDate)}</strong>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-[#0c2130] border-[#17384e]">
                <CardHeader title="Compliance Checklist" />
                <CardBody className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                    <span className="text-slate-300">Basic Overview Verified</span>
                    <Check className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                    <span className="text-slate-300">Tax & GST Identified</span>
                    <Check className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                    <span className="text-slate-300">Statutory Docs Uploaded</span>
                    <Check className="w-4 h-4 text-teal-400" />
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
              title="Tax Related & Statutory Details"
              subtitle="Statutory registrations, identification numbers, and regulatory authority details"
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
                      {company.legalName || company.name}
                    </strong>
                    <p className="leading-relaxed">
                      {company.registeredAddress || `${city}, ${state}, ${country}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Section 2 Verify Card */}
          {renderSectionVerificationCard('tax', 'Tax & Statutory Compliance Details', 2)}
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
                {documentList.map((doc) => (
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
                <span>Entity: <strong className="text-slate-200">{company.name}</strong></span>
                <span>CIN: <strong className="text-teal-400 font-mono">{registrationNo}</strong></span>
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

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleToggleSuspend}
        title={`Suspend ${company.name}?`}
        message={`Are you sure you want to suspend this company? Its directory listing will be immediately hidden from the public platform and access will be restricted.`}
        confirmText="Confirm Suspension"
        variant="danger"
      />

      {/* Reactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        onConfirm={handleToggleSuspend}
        title={`Reactivate ${company.name}?`}
        message={`Reactivating this company will restore its live public listing on Project X.`}
        confirmText="Reactivate Company"
        variant="success"
      />
    </div>
  );
};
