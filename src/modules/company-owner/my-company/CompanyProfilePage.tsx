import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Scale,
  FileText,
  UserCheck,
  ShieldCheck,
  Edit3,
  Calendar,
  Layers,
  Cpu,
  Copy,
  ExternalLink,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  Download,
  Users,
  Briefcase,
  ChevronRight,
  Eye,
  TrendingUp,
  BookmarkCheck,
  Lock,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { companies } = useCompanies();
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'legal' | 'digital' | 'governance'>('overview');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard!`, 'Copied');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Verified Company Profile"
        subtitle="Manage public corporate credentials, executive bio, proprietary offerings, and verified identifiers."
        breadcrumbs={[{ label: 'Dashboard', path: ROUTES.COMPANY_OWNER.DASHBOARD }, { label: 'My Company' }]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_LISTING)}
              leftIcon={<ExternalLink className="w-3.5 h-3.5 text-teal-400" />}
            >
              Public Listing
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY_EDIT)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
          </div>
        }
      />

      {/* Hero Corporate Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2637] via-[#091e2c] to-[#071622] border border-[#173d56] shadow-2xl p-6 sm:p-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/15 to-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company Main Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo Emblem */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-500 p-[2px] shadow-xl shadow-teal-500/20">
                <div className="w-full h-full bg-[#071723] rounded-[14px] flex items-center justify-center font-extrabold text-teal-300 text-2xl sm:text-3xl font-heading tracking-wider">
                  {myCompany?.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#091e2c]" title="MCA & Platform Verified">
                <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
            </div>

            {/* Entity Names & Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  {myCompany?.name}
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED ENTITY</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>Public Directory Live</span>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <button
                  onClick={() => copyToClipboard(myCompany?.id || '', 'Company ID')}
                  className="flex items-center gap-1.5 font-mono text-teal-400 bg-[#091b27] px-2.5 py-1 rounded-lg border border-[#17384e] hover:border-teal-500/40 transition-colors cursor-pointer group"
                >
                  <span>{myCompany?.id}</span>
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-teal-300" />
                </button>
                <span className="text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  <span>{myCompany?.industry}</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{myCompany?.companySize}</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Founded {myCompany?.foundedYear}</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{myCompany?.headquarters}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#173d56]">
            <div className="px-4 py-3 rounded-2xl bg-[#091b27]/80 border border-[#17384e] text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Health Score</span>
              <span className="text-xl font-extrabold text-cyan-400 font-heading">
                {myCompany?.profileCompletion || 92}%
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">High Confidence</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-[#091b27]/80 border border-[#17384e] text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Views</span>
              <span className="text-xl font-extrabold text-purple-300 font-heading">
                {myCompany?.profileViews.toLocaleString() || '14,850'}
              </span>
              <span className="text-[9px] text-teal-400 font-semibold block mt-0.5">Top 5% AI Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Corporate Credentials & Verification Dossier (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Verified Identifiers Card */}
          <Card className="bg-[#0c2130] border-[#17384e] shadow-xl overflow-hidden">
            <div className="p-4 border-b border-[#143144] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading">Corporate Identifiers</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% MCA Validated
              </span>
            </div>
            <CardBody className="p-4 space-y-3.5">
              {/* CIN */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">CIN (Corporate Identity)</span>
                  <span className="font-mono text-xs font-bold text-teal-300 block mt-0.5">
                    {myCompany?.cinNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(myCompany?.cinNumber || '', 'CIN Number')}
                  className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 transition-colors"
                  title="Copy CIN"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* GSTIN */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">GSTIN Identifier</span>
                  <span className="font-mono text-xs font-bold text-slate-200 block mt-0.5">
                    {myCompany?.gstNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(myCompany?.gstNumber || '', 'GSTIN Number')}
                  className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 transition-colors"
                  title="Copy GSTIN"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Legal Entity Type */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Entity Classification</span>
                <span className="font-semibold text-slate-200">{myCompany?.companyType}</span>
              </div>

              {/* ROC Jurisdiction */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">ROC Office</span>
                <span className="font-semibold text-teal-300">ROC Karnataka (Active)</span>
              </div>
            </CardBody>
          </Card>

          {/* Contact & Registered Office */}
          <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
            <div className="p-4 border-b border-[#143144] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white font-heading">Direct Endpoints</h3>
              </div>
            </div>
            <CardBody className="p-4 space-y-3">
              <a
                href={myCompany?.website}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Official Website</span>
                    <span className="font-semibold text-slate-200 group-hover:text-teal-300">
                      {myCompany?.website.replace('https://', '')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300" />
              </a>

              <a
                href={`mailto:${myCompany?.email}`}
                className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Corporate Inquiries</span>
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                      {myCompany?.email}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
              </a>

              <a
                href={`tel:${myCompany?.phone}`}
                className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Direct Line</span>
                    <span className="font-semibold text-slate-200 group-hover:text-amber-300">
                      {myCompany?.phone}
                    </span>
                  </div>
                </div>
                <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300" />
              </a>

              {/* Registered Address */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" /> Registered HQ Address
                  </span>
                  <button
                    onClick={() => copyToClipboard(myCompany?.registeredAddress || '', 'Registered Address')}
                    className="text-slate-400 hover:text-teal-300 transition-colors"
                    title="Copy Address"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {myCompany?.registeredAddress}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Authorized Officer Badge Card */}
          <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
            <div className="p-4 border-b border-[#143144] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading">Authorized Signatory</h3>
              </div>
              <span className="text-[10px] text-teal-400 font-semibold">Primary Contact</span>
            </div>
            <CardBody className="p-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-sm">
                  {myCompany?.representativeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">{myCompany?.representativeName}</h4>
                  <p className="text-xs font-semibold text-teal-400 mt-0.5">{myCompany?.representativeDesignation}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Authorized Director & MCA Signatory</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Interactive Tab Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Modern Visual Tab Bar */}
          <div className="p-1.5 rounded-2xl bg-[#091b27] border border-[#17384e] grid grid-cols-2 sm:grid-cols-5 gap-1.5 shadow-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2130]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2130]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Products & Tech</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'legal'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2130]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Legal & GST</span>
            </button>

            <button
              onClick={() => setActiveTab('digital')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'digital'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2130]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Digital Presence</span>
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'governance'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2130]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Governance</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Bio Card */}
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl overflow-hidden">
                <div className="p-5 border-b border-[#143144] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <h3 className="text-base font-bold text-white font-heading">Executive Bio & Positioning</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY_EDIT)}
                    className="text-xs text-teal-400 hover:text-teal-300"
                    leftIcon={<Edit3 className="w-3 h-3" />}
                  >
                    Edit Bio
                  </Button>
                </div>
                <CardBody className="p-6 space-y-4">
                  <div className="relative p-5 rounded-2xl bg-gradient-to-r from-[#091b27] to-[#0b2130] border border-[#17384e] leading-relaxed text-slate-200 text-sm">
                    <p className="italic">
                      "{myCompany?.description}"
                    </p>
                  </div>

                  {/* Core Value Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-[11px] font-bold text-teal-400 block mb-1">🎯 Primary Focus</span>
                      <p className="text-xs text-slate-300">Precision aerospace robotic automation & spatial kinematics.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-[11px] font-bold text-cyan-400 block mb-1">⚙️ Delivery Model</span>
                      <p className="text-xs text-slate-300">Enterprise Hardware Deployments + SaaS Telemetry Stack.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-[11px] font-bold text-purple-400 block mb-1">🌍 Target Market</span>
                      <p className="text-xs text-slate-300">Global Tier-1 Aerospace Manufacturers & Defense Contractors.</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Corporate Metadata Grid */}
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144]">
                  <h3 className="text-base font-bold text-white font-heading">Entity Parameters & Operating Classification</h3>
                </div>
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Incorporation Year</span>
                      <span className="text-base font-bold text-white mt-1 block">{myCompany?.foundedYear}</span>
                      <span className="text-[10px] text-teal-400 mt-1 block">3+ Years Continuous Operation</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Team Scale</span>
                      <span className="text-base font-bold text-white mt-1 block">{myCompany?.companySize}</span>
                      <span className="text-[10px] text-cyan-400 mt-1 block">Engineering Heavy (65%)</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Operating Headquarters</span>
                      <span className="text-base font-bold text-white mt-1 block">{myCompany?.headquarters}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">DeepTech Innovation Zone</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 2: PRODUCTS & TECH */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Products Catalog */}
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">Proprietary Products & Solutions</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Flagship hardware and autonomous software products.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {myCompany?.products.length} Products Active
                  </span>
                </div>
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myCompany?.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-sm">
                            0{idx + 1}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Enterprise Ready
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-heading group-hover:text-teal-300 transition-colors">
                          {product}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          Industrial-grade autonomous deployment with real-time telemetry and safety verification.
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Services & Solutions */}
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144]">
                  <h3 className="text-base font-bold text-white font-heading">Enterprise Services & Capabilities</h3>
                </div>
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myCompany?.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center gap-3 text-xs font-semibold text-slate-200"
                      >
                        <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Engineering & Technology Stack */}
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144]">
                  <h3 className="text-base font-bold text-white font-heading">Engineering & Technology Architecture</h3>
                </div>
                <CardBody className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2.5">
                    {myCompany?.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-xs font-bold text-cyan-300 border border-cyan-500/25 flex items-center gap-2"
                      >
                        <Cpu className="w-3.5 h-3.5 text-teal-400" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 3: LEGAL & GST */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-400" />
                    <h3 className="text-base font-bold text-white font-heading">Statutory & MCA Compliance Records</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fully Cleared
                  </span>
                </div>
                <CardBody className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Full Legal Registered Entity</span>
                      <span className="text-sm font-bold text-white mt-1 block">{myCompany?.legalName}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e]">
                      <span className="text-xs text-slate-400 font-medium block">Corporate Status</span>
                      <span className="text-sm font-bold text-emerald-400 mt-1 block">Active & Compliant (ROC-KA)</span>
                    </div>
                  </div>

                  {/* Verified Document Vault */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Verified Documents Vault
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-teal-400" />
                          <div>
                            <span className="text-xs font-bold text-white block">Certificate of Incorporation</span>
                            <span className="text-[10px] text-emerald-400">Verified by MCA Officer</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-teal-400" onClick={() => navigate(ROUTES.COMPANY_OWNER.DOCUMENTS)}>
                          View
                        </Button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-400" />
                          <div>
                            <span className="text-xs font-bold text-white block">GST Registration Certificate</span>
                            <span className="text-[10px] text-emerald-400">Active Taxpayer</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-purple-400" onClick={() => navigate(ROUTES.COMPANY_OWNER.DOCUMENTS)}>
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 4: DIGITAL PRESENCE */}
          {activeTab === 'digital' && (
            <div className="space-y-6">
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144]">
                  <h3 className="text-base font-bold text-white font-heading">Corporate Portals & Online Channels</h3>
                </div>
                <CardBody className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] space-y-2">
                    <span className="text-xs text-slate-400 font-semibold block">Primary Web Portal</span>
                    <a href={myCompany?.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-teal-400 hover:underline flex items-center gap-1.5">
                      {myCompany?.website} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] space-y-2">
                    <span className="text-xs text-slate-400 font-semibold block">Technical API / Docs</span>
                    <span className="text-sm font-bold text-slate-300 block">
                      api.novasystems.io/v2/docs
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] space-y-2">
                    <span className="text-xs text-slate-400 font-semibold block">Official Inquiries</span>
                    <span className="text-sm font-bold text-cyan-300 block">
                      {myCompany?.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] space-y-2">
                    <span className="text-xs text-slate-400 font-semibold block">Platform Listing Visibility</span>
                    <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Indexed & Featured
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 5: GOVERNANCE */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
                <div className="p-5 border-b border-[#143144] flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-heading">Corporate Governance & Management</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(ROUTES.COMPANY_OWNER.DASHBOARD)}
                    className="text-xs"
                  >
                    Assign Manager
                  </Button>
                </div>
                <CardBody className="p-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#091b27] border border-teal-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold text-base">
                        {myCompany?.representativeName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-heading">{myCompany?.representativeName}</h4>
                        <span className="text-xs text-teal-400 font-semibold block">{myCompany?.representativeDesignation}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Primary Owner & Executive Authority</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      Full Access Owner
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
