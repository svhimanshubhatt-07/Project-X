import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Modal } from '../../../shared/components/ui/Modal';
import { useServiceProviders } from '../../../features/service-providers/hooks/useServiceProviders';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { INITIAL_SERVICE_TYPES, ServiceTypeItem } from './components/ServiceListCatalog';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Layers,
  ArrowLeft,
  Check,
  CheckCircle2,
  Building2,
  MapPin,
  Star,
  Plus,
  Tag,
  ShieldCheck,
  Award,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const ServiceProviderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { serviceProviders, getServiceProviderById, setServiceProviderStatus } = useServiceProviders();
  const { services: verifiedServices } = useServiceVerifications();
  const { success } = useToast();

  const provider = (id ? getServiceProviderById(id) : null) || serviceProviders[0];

  const [selectedService, setSelectedService] = useState<ServiceTypeItem | null>(null);

  // Collect all service cards for this provider
  const providerServiceCards = useMemo(() => {
    if (!provider) return [];

    // 1. From INITIAL_SERVICE_TYPES
    const catalogMatches = INITIAL_SERVICE_TYPES.filter(
      (srv) =>
        srv.providerIds.includes(provider.id) ||
        srv.category.toLowerCase() === provider.category.toLowerCase() ||
        provider.services.some(
          (s) =>
            srv.name.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(srv.name.toLowerCase())
        )
    );

    // 2. From Verified Services in mock store
    const storeMatches = verifiedServices
      .filter(
        (s) =>
          s.companyId === provider.id ||
          s.companyName.toLowerCase() === provider.name.toLowerCase() ||
          s.companyName.toLowerCase() === provider.legalName.toLowerCase()
      )
      .map((s) => ({
        id: s.id,
        name: s.serviceName,
        category: s.category,
        description: s.description,
        pricing: s.pricingTier,
        deliveryTime: s.deliveryModel,
        deliverables: s.deliverables,
        providerIds: [provider.id],
      }));

    // Merge and deduplicate by name
    const combined = [...storeMatches, ...catalogMatches];
    const uniqueMap = new Map<string, ServiceTypeItem>();
    combined.forEach((item) => {
      if (!uniqueMap.has(item.name.toLowerCase())) {
        uniqueMap.set(item.name.toLowerCase(), item);
      }
    });

    // If still empty but provider has services string list, generate fallback cards
    if (uniqueMap.size === 0 && provider.services.length > 0) {
      provider.services.forEach((srvName, idx) => {
        uniqueMap.set(srvName.toLowerCase(), {
          id: `srv_custom_${idx}`,
          name: srvName,
          category: provider.category,
          description: `Enterprise-grade ${srvName} solution delivered with verified SLA, architecture compliance, and end-to-end technical support.`,
          pricing: provider.pricing || '₹3,500 - ₹5,000 / hr',
          deliveryTime: '2 - 4 Weeks',
          deliverables: [
            'Initial Architecture & Scope Calibration',
            'Full Implementation & Security Hardening',
            'Testing, Staging & Production Deployment',
            'Documentation & 24/7 SLA Telemetry',
          ],
          providerIds: [provider.id],
        });
      });
    }

    return Array.from(uniqueMap.values());
  }, [provider, verifiedServices]);

  if (!provider) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-heading">Service Provider Not Found</h2>
        <p className="text-sm text-slate-400">The requested provider profile does not exist.</p>
        <Button
          onClick={() => navigate(ROUTES.ADMIN.SERVICE_PROVIDERS)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Service Providers
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
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title={provider.name}
        subtitle={`Empaneled Service Provider — ${provider.category}`}
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
          { label: 'Service Providers', path: ROUTES.ADMIN.SERVICE_PROVIDERS },
          { label: provider.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.SERVICE_PROVIDERS)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Providers
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.SERVICE_CREATE)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Service
            </Button>
          </div>
        }
      />

      {/* 1. SERVICE PROVIDER / COMPANY SUMMARY CARD */}
      <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-primary)]/5 rounded-full blur-3xl pointer-events-none" />

        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#072b22] to-[#041a14] border border-[var(--brand-primary)]/40 flex items-center justify-center text-[var(--brand-primary)] font-extrabold text-2xl shrink-0 shadow-[0_0_20px_rgba(0,229,153,0.15)]">
                {provider.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading">
                    {provider.name}
                  </h1>
                  <StatusBadge status={provider.status} size="md" />
                </div>

                <p className="text-xs text-slate-400 mt-1">{provider.legalName}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" /> {provider.location}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[var(--brand-primary)] border border-emerald-500/30 font-semibold inline-flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {provider.category}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {provider.rating} ({provider.reviewsCount || 42} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-left min-w-[150px]">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Standard Pricing</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-300 font-mono block mt-0.5">{provider.pricing}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 2. SERVICES SECTION & ALL SERVICE CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--brand-primary)]" />
              <span>Listed Services & Offerings</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30">
                {providerServiceCards.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              All active enterprise capabilities and standardized service solutions offered by {provider.name}.
            </p>
          </div>
        </div>

        {/* SERVICE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {providerServiceCards.map((service) => (
            <Card
              key={service.id}
              className="bg-[var(--bg-table)] border border-[var(--border-table)] hover:border-[var(--brand-primary)]/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <CardBody className="space-y-4 p-5">
                {/* Category & Delivery Pill */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {service.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-[var(--bg-card-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {service.deliveryTime}
                  </span>
                </div>

                {/* Service Name & Scope Description */}
                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors font-heading">
                    {service.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Key Deliverables */}
                <div className="space-y-1.5 pt-3 border-t border-[var(--border-divider)]">
                  <span className="text-[11px] font-semibold text-slate-300 block">Deliverables:</span>
                  <div className="space-y-1">
                    {service.deliverables.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                    {service.deliverables.length > 3 && (
                      <span className="text-[10px] text-[var(--brand-primary)] font-semibold block pl-5">
                        +{service.deliverables.length - 3} more deliverables
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>

              {/* Bottom Pricing & View Details Action */}
              <div className="px-5 py-3.5 bg-[var(--bg-card-inner)]/80 border-t border-[var(--border-divider)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Pricing Standard</span>
                  <span className="text-xs font-bold text-emerald-300 font-mono">{service.pricing}</span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(ROUTES.ADMIN.SERVICE_DETAILS(service.id))}
                  className="text-xs text-[var(--brand-primary)] hover:text-emerald-300 font-semibold"
                >
                  View Details →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {providerServiceCards.length === 0 && (
          <Card className="py-12 text-center text-slate-400 bg-[var(--bg-table)] border border-[var(--border-table)]">
            <p>No services registered for this provider yet.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.SERVICE_CREATE)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="mt-4"
            >
              Add First Service
            </Button>
          </Card>
        )}
      </div>

      {/* Selected Service Specification Modal */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title="Service Offering Specification"
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {selectedService.category}
                </span>
                <h2 className="text-xl font-bold text-slate-100 mt-2 font-heading">{selectedService.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Standard Pricing</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">{selectedService.pricing}</span>
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-xl text-xs text-slate-300 leading-relaxed">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Scope of Work & Capabilities
              </span>
              {selectedService.description}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                Standard Deliverables & Milestones:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-lg text-xs text-slate-200">
                    <Check className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-divider)]">
              <Button type="button" variant="outline" onClick={() => setSelectedService(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

