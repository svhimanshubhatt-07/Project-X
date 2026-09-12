import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useServiceProviders } from '../../../features/service-providers/hooks/useServiceProviders';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Briefcase,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  ShieldCheck,
  Building,
  Award,
} from 'lucide-react';

export const ServiceProviderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getServiceProviderById, setServiceProviderStatus } = useServiceProviders();
  const { success } = useToast();

  const provider = getServiceProviderById(id || 'sp_01') || getServiceProviderById('sp_01');

  if (!provider) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Service provider record not found.</p>
        <Button className="mt-4" onClick={() => navigate('/admin/service-providers')}>
          Back to Providers List
        </Button>
      </div>
    );
  }

  const handleToggleStatus = () => {
    const next = provider.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setServiceProviderStatus(provider.id, next);
    success(`Provider status set to ${next}.`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={provider.name}
        subtitle={`Empaneled Technical Partner - ${provider.category}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Service Providers', path: '/admin/service-providers' },
          { label: provider.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/service-providers')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant={provider.status === 'ACTIVE' ? 'outline' : 'primary'}
              size="sm"
              onClick={handleToggleStatus}
            >
              {provider.status === 'ACTIVE' ? 'Suspend Provider' : 'Activate Provider'}
            </Button>
          </div>
        }
      />

      {/* Hero Overview Card */}
      <Card className="bg-[#0c2130] border border-[#17384e] shadow-xl">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-2xl font-extrabold shrink-0 shadow-inner">
                {provider.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-100 font-heading">{provider.name}</h2>
                  <StatusBadge status={provider.status} size="sm" />
                </div>
                <p className="text-xs text-slate-400 mt-1">{provider.legalName}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-teal-300">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" /> {provider.location}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {provider.rating} ({provider.reviewsCount} reviews)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> Enrolled {provider.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] min-w-[200px]">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Billing Rate</span>
              <div className="text-lg font-bold text-teal-300 font-mono mt-0.5">{provider.pricing}</div>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                ✓ {provider.completedProjects} Completed Projects
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Services & Description */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Provider Overview" />
            <CardBody className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">{provider.description}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Specialized Capabilities & Service Offerings" />
            <CardBody className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block">{srv}</span>
                      <span className="text-[11px] text-slate-400">Verified Capability</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Contact & Verification */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Key Contact Person" />
            <CardBody className="space-y-3.5">
              <div>
                <span className="text-xs text-slate-400 block">Designated Representative</span>
                <span className="text-sm font-semibold text-slate-100">{provider.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>{provider.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>{provider.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-400">
                <Globe className="w-3.5 h-3.5" />
                <a href={provider.website} target="_blank" rel="noreferrer" className="underline hover:text-teal-300">
                  {provider.website}
                </a>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Compliance & Verification" />
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Platform Identity & Background Checked</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs">
                <Award className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Verified Service Level Agreement</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
