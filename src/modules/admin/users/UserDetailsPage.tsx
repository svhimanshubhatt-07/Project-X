import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  Users,
  ShieldCheck,
  Shield,
  Briefcase,
  Globe,
  Mail,
  Phone,
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  Copy,
  ArrowLeft,
  KeyRound,
  UserX,
  UserCheck,
  ExternalLink,
  Lock,
  FileText,
  BadgeCheck,
  Building2,
  Sparkles,
  MapPin,
  Eye,
  Activity,
} from 'lucide-react';

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, getUserById, setUserStatus, updateUser } = useUsers();
  const { companies } = useCompanies();
  const { success, info } = useToast();

  const user = (id ? getUserById(id) : null) || users[0];
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || 'REGISTERED_USER');
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Find company if user is a COMPANY_OWNER or associated with a company
  const company = user
    ? companies.find((c) => c.id === user.companyId || (user.companyName && c.name.toLowerCase() === user.companyName.toLowerCase()))
    : null;

  if (!user) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">User Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The requested user profile does not exist or was removed.</p>
        <Button onClick={() => navigate(ROUTES.ADMIN.USERS)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Platform Users
        </Button>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard!`);
  };

  const handleToggleStatus = () => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUserStatus(user.id, nextStatus);
    success(`Account status for ${user.name} updated to ${nextStatus}.`);
  };

  const handleRoleChange = () => {
    if (selectedRole !== user.role) {
      updateUser(user.id, { role: selectedRole });
      setIsChangingRole(false);
      success(`User role updated to ${selectedRole.replace(/_/g, ' ')}.`);
    } else {
      setIsChangingRole(false);
    }
  };

  const isWebsiteVisitor = user.role === 'VISITOR' || user.role === 'REGISTERED_USER';
  const isCompanyOwner = user.role === 'COMPANY_OWNER';
  const isAdminOrManager = user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'REVIEWER' || user.role === 'STAKEHOLDER';

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'VISITOR':
        return 'Website Visitor';
      case 'REGISTERED_USER':
        return 'Website Registered User';
      case 'COMPANY_OWNER':
        return 'Company Owner';
      case 'STAKEHOLDER':
        return 'Executive Stakeholder';
      case 'ADMIN':
        return 'Platform Administrator';
      case 'SERVICE_PROVIDER':
        return 'Service Provider';
      default:
        return role.replace(/_/g, ' ');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'VISITOR':
      case 'REGISTERED_USER':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'COMPANY_OWNER':
        return <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />;
      default:
        return <Briefcase className="w-4 h-4 text-purple-400" />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'COMPANY_OWNER':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'VISITOR':
      case 'REGISTERED_USER':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'STAKEHOLDER':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Breadcrumbs */}
      <PageHeader
        title={user.name}
        subtitle={
          isWebsiteVisitor
            ? `Website User Registration • Basic Profile Dossier`
            : isCompanyOwner
            ? `Verified Company Owner Dossier • ${user.companyName || 'Corporate Profile'}`
            : `Platform Staff & Access Dossier • ${getRoleLabel(user.role)}`
        }
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
          { label: 'Platform Users', path: ROUTES.ADMIN.USERS },
          { label: user.name },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.USERS)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => info(`Password reset instructions dispatched to ${user.email}.`, 'Reset Dispatched')}
              leftIcon={<KeyRound className="w-3.5 h-3.5 text-amber-400" />}
            >
              Reset Password
            </Button>
            {user.role !== 'ADMIN' && (
              <Button
                variant={user.status === 'ACTIVE' ? 'outline' : 'primary'}
                size="sm"
                onClick={handleToggleStatus}
                leftIcon={user.status === 'ACTIVE' ? <UserX className="w-4 h-4 text-rose-400" /> : <UserCheck className="w-4 h-4" />}
              >
                {user.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
              </Button>
            )}
          </div>
        }
      />

      {/* Hero Banner Card */}
      <Card className="overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl">
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group shrink-0">
                <Avatar name={user.name} size="xl" className="w-20 h-20 sm:w-24 sm:h-24 text-2xl font-bold border-2 border-[var(--border-subtle)]" />
                <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md">
                  <StatusBadge status={user.status} size="sm" showIconOnly />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading tracking-tight">
                    {user.name}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRoleBadgeStyle(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {getRoleLabel(user.role)}
                  </span>
                  <StatusBadge status={user.status} size="sm" />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                  <button
                    onClick={() => copyToClipboard(user.id, 'User ID')}
                    className="flex items-center gap-1.5 font-mono text-[var(--brand-primary)] bg-[var(--bg-card-inner)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 transition-colors cursor-pointer group"
                    title="Copy User ID"
                  >
                    <span>{user.id}</span>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-[var(--brand-primary)]" />
                  </button>
                  <span className="text-slate-300 flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{user.email}</span>
                  </span>
                  {user.phone && (
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{user.phone}</span>
                    </span>
                  )}
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>Registered: {user.registrationDate}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border-divider)] w-full lg:w-auto">
              <div className="px-4 py-3 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-center min-w-[120px] flex-1 lg:flex-initial">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Last Active</span>
                <span className="text-sm font-bold text-teal-300 font-heading block mt-0.5">
                  {user.lastLoginDate}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Session Status</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* =========================================================================
          CASE 1: WEBSITE VISITOR / BASIC REGISTERED USER
          (Simple data: Name, Email, Phone, Registration Date, Auth Source, Security)
          ========================================================================= */}
      {isWebsiteVisitor && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Registration Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <CardHeader
                title="Registration Information"
                subtitle="Basic details submitted during website user signup"
                action={
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-300">
                    Direct Website Signup
                  </span>
                }
              />
              <CardBody className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Full Name</span>
                    <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registered Email</span>
                    <span className="text-sm font-semibold text-cyan-300 font-mono">{user.email}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Phone Number</span>
                    <span className="text-sm font-semibold text-slate-200">{user.phone || 'Not Provided during signup'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registration Method</span>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      Email & Password Signup
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registered Date</span>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      {user.registrationDate}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Last Active</span>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {user.lastLoginDate}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Account Status & Security (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <CardHeader
                title="Account Status & Actions"
                subtitle="Visitor account authentication controls"
              />
              <CardBody className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Current Status</span>
                    <span className="text-[11px] text-slate-400">Account login access</span>
                  </div>
                  <StatusBadge status={user.status} size="sm" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Account Type</span>
                    <span className="text-[11px] text-slate-400">Public portal visitor</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Free / Basic
                  </span>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    variant={user.status === 'ACTIVE' ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full text-xs"
                    onClick={handleToggleStatus}
                  >
                    {user.status === 'ACTIVE' ? 'Suspend Visitor Account' : 'Activate Visitor Account'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 2: COMPANY OWNER
          (Full Owner Information, Owned Company Profile, MCA/CIN/GST, Listing Status, Legal Dossier)
          ========================================================================= */}
      {isCompanyOwner && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Owned Company & Corporate Profile (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Owned Company Overview */}
            <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <CardHeader
                title="Owned Corporate Enterprise"
                subtitle="Organization presence registered and managed by this account owner"
                action={
                  company ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id))}
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      View Company Profile
                    </Button>
                  ) : null
                }
              />
              <CardBody className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center font-extrabold text-[var(--brand-primary)] text-xl shrink-0 shadow-inner">
                      {(company?.name || user.companyName || 'CO').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        <span>{company?.name || user.companyName}</span>
                        {company?.verificationStatus === 'VERIFIED' && (
                          <BadgeCheck className="w-4 h-4 text-emerald-400" />
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {company?.brandName ? `Brand: ${company.brandName}` : user.designation || 'Company Owner'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {company && <StatusBadge status={company.verificationStatus} size="sm" />}
                    {company && <StatusBadge status={company.listingStatus} size="sm" />}
                  </div>
                </div>

                {/* Corporate Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Owner Designation</span>
                    <span className="text-sm font-semibold text-slate-100">{user.designation || 'Founder & CEO'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">CIN Number</span>
                    <span className="text-sm font-semibold text-teal-300 font-mono">{company?.cinNumber || 'U72900DL2021PTC389123'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Industry Sector</span>
                    <span className="text-sm font-semibold text-slate-200">{company?.industry || 'CleanTech & Energy'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Company Size / Scale</span>
                    <span className="text-sm font-semibold text-slate-200">{company?.companySize || '51-200 Employees'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Headquarters</span>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {company?.headquarters || 'Bengaluru, Karnataka'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Founded Year</span>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {company?.foundedYear || '2021'}
                    </span>
                  </div>
                </div>

                {/* Owner Operational Clearances */}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Authorized Owner Permissions & Capabilities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Company Profile & Bio Updates</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Public Marketplace Listing Management</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Legal Compliance & Document Uploads</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Inbound Connection & Deal Management</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Owner Profile & Direct Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <CardHeader
                title="Owner Account Credentials"
                subtitle="Sign-in and primary communications"
              />
              <CardBody className="p-5 space-y-3.5">
                <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Owner Name</span>
                  <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Owner Direct Email</span>
                  <span className="text-xs font-semibold text-cyan-300 font-mono">{user.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Direct Phone</span>
                  <span className="text-xs font-semibold text-slate-200">{user.phone || '+91 98250 44332'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Account Onboarded</span>
                  <span className="text-xs font-semibold text-slate-200">{user.registrationDate}</span>
                </div>

                <div className="pt-2">
                  <Button
                    variant={user.status === 'ACTIVE' ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full text-xs"
                    onClick={handleToggleStatus}
                  >
                    {user.status === 'ACTIVE' ? 'Suspend Owner Account' : 'Activate Owner Account'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 3: MANAGER / REVIEWER / ADMIN / STAKEHOLDER
          (Staff / Operational Reviewer / Administration Information)
          ========================================================================= */}
      {isAdminOrManager && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Staff Duties & Permissions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <CardHeader
                title="Administrative & Operational Profile"
                subtitle="Staff clearance boundaries, supervisory roles, and review privileges"
                action={
                  !isChangingRole ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangingRole(true)}
                    >
                      Change Role
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setIsChangingRole(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={handleRoleChange}>
                        Save Role
                      </Button>
                    </div>
                  )
                }
              />
              <CardBody className="p-6 space-y-6">
                {/* Role Changer Selector */}
                {isChangingRole && (
                  <div className="p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--brand-primary)]/40 space-y-3">
                    <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider block">
                      Select Platform Role
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: 'ADMIN', label: 'Platform Administrator', desc: 'Full authority to approve onboarding, manage listings, and supervise users.' },
                        { id: 'STAKEHOLDER', label: 'Executive Stakeholder', desc: 'Read-only access to audit logs, platform reports, and metrics.' },
                        { id: 'COMPANY_OWNER', label: 'Company Owner', desc: 'Manages entity profile, listings, and verification docs.' },
                        { id: 'REGISTERED_USER', label: 'Website Registered User', desc: 'Public directory discovery and portal browsing.' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRole(r.id)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            selectedRole === r.id
                              ? 'bg-[var(--brand-primary)]/15 border-[var(--brand-primary)] text-slate-100 shadow-md'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-100">{r.label}</div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">{r.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Designation</span>
                    <span className="text-sm font-semibold text-slate-100">{user.designation || 'Platform Reviewer'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Department / Unit</span>
                    <span className="text-sm font-semibold text-cyan-300">Compliance & Verification Board</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Security Clearance</span>
                    <span className="text-sm font-semibold text-emerald-400">Level 4 (Supervisory Access)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Scope</span>
                    <span className="text-sm font-semibold text-slate-200">Onboarding & Corporate Listings</span>
                  </div>
                </div>

                {/* Clearances */}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Administrative Review Authorities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Onboarding Application Approvals & Rejections</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Document & MCA Verification Sign-Off</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Listing Visibility & Delisting Operations</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span>Audit Trail & Compliance Log Inspection</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Staff Security (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <CardHeader
                title="Staff Access Control"
                subtitle="Privilege governance & security"
              />
              <CardBody className="p-5 space-y-3.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Status</span>
                    <span className="text-[11px] text-slate-400">Account status</span>
                  </div>
                  <StatusBadge status={user.status} size="sm" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Hardware 2FA</span>
                    <span className="text-[11px] text-slate-400">Required for Staff</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Enforced
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => info(`Audit logs for staff member ${user.id} requested.`, 'Logs Loaded')}
                    leftIcon={<Activity className="w-3.5 h-3.5 text-teal-400" />}
                  >
                    View Staff Audit Activity
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
