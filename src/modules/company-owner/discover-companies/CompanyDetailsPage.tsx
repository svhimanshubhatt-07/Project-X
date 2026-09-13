import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ExternalLink,
  UserPlus,
  Send,
  Copy,
  Calendar,
  Users,
  Briefcase,
  Cpu,
  Zap,
  Sparkles,
  CheckCircle2,
  Scale,
  UserCheck,
  Award,
  Bell,
  Clock,
  Layers,
  Share2,
} from 'lucide-react';

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById, companies } = useCompanies();
  const { success, info } = useToast();

  const [isRequestSent, setIsRequestSent] = useState(false);
  const company = id ? getCompanyById(id) || companies.find((c) => c.id === id) : companies[0];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard!`);
  };

  const handleSendConnectionRequest = () => {
    setIsRequestSent(true);
    success(`Connection request sent successfully to ${company?.name}!`);
  };

  if (!company) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#091b27] border border-[#17384e] flex items-center justify-center mx-auto text-teal-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading">Company Not Found</h2>
        <p className="text-xs text-slate-400">The requested verified enterprise profile could not be located in the ecosystem directory.</p>
        <Button
          onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={company.name}
        subtitle="Verified Enterprise Profile & Discovery Dossier"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.COMPANY_OWNER.DASHBOARD },
          { label: 'Discover Companies', path: ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES },
          { label: company.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Directory
            </Button>
            {isRequestSent ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 cursor-default"
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendConnectionRequest}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Send Connection Request
              </Button>
            )}
          </div>
        }
      />

      {/* Hero Corporate Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2637] via-[#091e2c] to-[#071622] border border-[#173d56] shadow-2xl p-6 sm:p-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/15 to-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo Emblem */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-indigo-500 p-[2px] shadow-xl shadow-teal-500/20">
                <div className="w-full h-full bg-[#071723] rounded-[14px] flex items-center justify-center font-extrabold text-teal-300 text-2xl sm:text-3xl font-heading tracking-wider">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div
                className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#091e2c]"
                title="MCA & Platform Verified"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
            </div>

            {/* Entity Names & Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  {company.name}
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED ENTITY</span>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <button
                  onClick={() => copyToClipboard(company.id, 'Company ID')}
                  className="flex items-center gap-1.5 font-mono text-teal-400 bg-[#091b27] px-2.5 py-1 rounded-lg border border-[#17384e] hover:border-teal-500/40 transition-colors cursor-pointer"
                >
                  <span>{company.id}</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
                <span className="text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  <span>{company.industry}</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{company.companySize}</span>
                </span>
                {company.foundedYear && (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Founded {company.foundedYear}</span>
                  </span>
                )}
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{company.headquarters.split(',')[0]}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action & Stats */}
          <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#173d56]">
            {isRequestSent ? (
              <Button
                variant="outline"
                size="md"
                className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 w-full sm:w-auto cursor-default"
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              >
                Request Sent
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSendConnectionRequest}
                leftIcon={<UserPlus className="w-4 h-4" />}
                className="shadow-[0_0_20px_rgba(0,229,153,0.3)] w-full sm:w-auto"
              >
                Send Connection Request
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Corporate Identifiers, Contact & Leadership */}
        <div className="lg:col-span-4 space-y-6">
          {/* Statutory Identifiers */}
          <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
            <div className="p-4 border-b border-[#143144] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading">Corporate Identifiers</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% MCA Validated
              </span>
            </div>
            <CardBody className="p-4 space-y-3">
              {/* CIN */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    CIN Number
                  </span>
                  <span className="font-mono text-xs font-bold text-teal-300 block mt-0.5">
                    {company.cinNumber || 'U72900KA2023PTC178942'}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(company.cinNumber || 'U72900KA2023PTC178942', 'CIN Number')}
                  className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 transition-colors"
                  title="Copy CIN"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* GSTIN */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    GSTIN Identifier
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-200 block mt-0.5">
                    {company.gstNumber || '29AAGCN4482R1Z8'}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(company.gstNumber || '29AAGCN4482R1Z8', 'GSTIN Number')}
                  className="p-1.5 rounded-lg hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 transition-colors"
                  title="Copy GSTIN"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Legal Entity Type */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Entity Type</span>
                <span className="font-semibold text-slate-200">{company.companyType || 'Private Limited'}</span>
              </div>
            </CardBody>
          </Card>

          {/* Contact & Registered Endpoints */}
          <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
            <div className="p-4 border-b border-[#143144]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white font-heading">Direct Endpoints</h3>
              </div>
            </div>
            <CardBody className="p-4 space-y-3">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Official Website</span>
                    <span className="font-semibold text-slate-200 group-hover:text-teal-300 truncate">
                      {company.website.replace('https://', '')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300" />
              </a>

              <a
                href={`mailto:${company.email}`}
                className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Corporate Email</span>
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                      {company.email}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
              </a>

              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 flex items-center justify-between text-xs transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Direct Line</span>
                      <span className="font-semibold text-slate-200 group-hover:text-amber-300">
                        {company.phone}
                      </span>
                    </div>
                  </div>
                  <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300" />
                </a>
              )}

              {/* Location */}
              <div className="p-3 rounded-xl bg-[#091b27] border border-[#17384e] text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" /> Headquarters Address
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {company.registeredAddress || company.headquarters}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Key Executive / Authorized Signatory */}
          {company.representativeName && (
            <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
              <div className="p-4 border-b border-[#143144] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-heading">Primary Signatory</h3>
                </div>
              </div>
              <CardBody className="p-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-sm shrink-0">
                    {company.representativeName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{company.representativeName}</h4>
                    <p className="text-xs font-semibold text-teal-400 mt-0.5 truncate">
                      {company.representativeDesignation || 'Authorized Signatory & Director'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right Column (8 cols): Executive Bio, Products, Services & Tech */}
        <div className="lg:col-span-8 space-y-6">
          {/* Executive Bio & Overview */}
          <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
            <CardHeader
              title="Executive Overview & Capability Statement"
              subtitle="Verified business domain and operational scope"
            />
            <CardBody className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] text-slate-200 text-xs sm:text-sm leading-relaxed">
                {company.description}
              </div>

              {/* Operating Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e]">
                  <span className="text-[11px] font-bold text-teal-400 block mb-1">🎯 Primary Focus</span>
                  <p className="text-xs text-slate-300">{company.industry} DeepTech Solutions.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e]">
                  <span className="text-[11px] font-bold text-cyan-400 block mb-1">🏢 Organization Scale</span>
                  <p className="text-xs text-slate-300">{company.companySize} verified professionals.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e]">
                  <span className="text-[11px] font-bold text-purple-400 block mb-1">🛡️ Compliance Grade</span>
                  <p className="text-xs text-slate-300">100% MCA Verified Statutory Tier.</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Flagship Products */}
          {company.products && company.products.length > 0 && (
            <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
              <div className="p-5 border-b border-[#143144] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Proprietary Products & Solutions</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Commercial products available in ecosystem</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {company.products.length} Products
                </span>
              </div>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#091b27] border border-[#17384e] hover:border-teal-500/40 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs">
                          0{idx + 1}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active Product
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-heading group-hover:text-teal-300 transition-colors">
                        {product}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Standardized production deployment with verified SLAs and enterprise integration.
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Enterprise Services */}
          {company.services && company.services.length > 0 && (
            <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
              <div className="p-5 border-b border-[#143144] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Enterprise Capabilities & Services</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Specialized technical and consulting services</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {company.services.length} Capabilities
                </span>
              </div>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.services.map((service, idx) => (
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
          )}

          {/* Engineering Tech Stack */}
          {company.technologies && company.technologies.length > 0 && (
            <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
              <CardHeader
                title="Engineering Architecture & Tech Stack"
                subtitle="Technologies, frameworks, and deployment standards utilized by this enterprise"
              />
              <CardBody className="p-6">
                <div className="flex flex-wrap gap-2.5">
                  {company.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-xs font-bold text-cyan-300 border border-cyan-500/25 flex items-center gap-2 shadow-xs"
                    >
                      <Cpu className="w-3.5 h-3.5 text-teal-400" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
