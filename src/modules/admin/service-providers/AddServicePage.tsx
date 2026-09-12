import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useServiceVerifications } from '../../../features/services-verification/hooks/useServiceVerifications';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  Layers,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Trash2,
  Award,
  Sparkles,
  ShieldCheck,
  Search,
  Check,
  HelpCircle,
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Cleanroom & Industrial Robotics',
  'Cloud Infrastructure & DevOps',
  'AI Cloud Compute & LLMs',
  'Hardware & Silicon Design',
  'Energy & Grid Infrastructure',
  'BioTech & Pharmaceuticals',
  'Logistics & Supply Chain AI',
  'Legal & Corporate Compliance',
  'Cybersecurity & Audits',
];

const PRESET_CERTIFICATIONS = [
  'ISO 9001:2015',
  'ISO 14644-1 Cleanroom',
  'SOC 2 Type II',
  'ISO 27001',
  'BIS Certified',
  'CE Machinery Directive',
  'GLP Compliant',
  'FDA 21 CFR Part 11',
  'ROS2 Enterprise Certified',
  'TSMC OIP Validated',
];

export const AddServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { companies } = useCompanies();
  const { addCompanyService } = useServiceVerifications();
  const { success, error } = useToast();

  // Selected Company State
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [companySearchQuery, setCompanySearchQuery] = useState<string>('');

  // Service Form State
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [deliveryModel, setDeliveryModel] = useState('');
  const [pricingTier, setPricingTier] = useState('');
  const [slaCommitment, setSlaCommitment] = useState('');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Initial technical audit & scope calibration',
    'Dedicated deployment & telemetry dashboard access',
  ]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([
    'ISO 9001:2015',
  ]);
  const [customCert, setCustomCert] = useState('');
  const [initialStatus, setInitialStatus] = useState<'APPROVED' | 'PENDING'>('APPROVED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected company record
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  // Filtered companies for dropdown / search
  const filteredCompanies = companies.filter((c) => {
    if (!companySearchQuery) return true;
    const q = companySearchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.cinNumber && c.cinNumber.toLowerCase().includes(q)) ||
      (c.industry && c.industry.toLowerCase().includes(q))
    );
  });

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const toggleCertification = (cert: string) => {
    if (selectedCertifications.includes(cert)) {
      setSelectedCertifications(selectedCertifications.filter((c) => c !== cert));
    } else {
      setSelectedCertifications([...selectedCertifications, cert]);
    }
  };

  const handleAddCustomCert = () => {
    if (customCert.trim() && !selectedCertifications.includes(customCert.trim())) {
      setSelectedCertifications([...selectedCertifications, customCert.trim()]);
      setCustomCert('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      error('Please select a company to assign this service to.');
      return;
    }

    if (!serviceName.trim()) {
      error('Please enter the service name.');
      return;
    }

    if (!deliveryModel.trim()) {
      error('Please specify the delivery model.');
      return;
    }

    if (!pricingTier.trim()) {
      error('Please provide the pricing model or tier.');
      return;
    }

    if (!description.trim()) {
      error('Please write a service description.');
      return;
    }

    if (deliverables.length === 0) {
      error('Please add at least one deliverable item.');
      return;
    }

    setIsSubmitting(true);

    try {
      addCompanyService({
        serviceName: serviceName.trim(),
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        companyIndustry: selectedCompany.industry || 'Technology',
        category,
        deliveryModel: deliveryModel.trim(),
        pricingTier: pricingTier.trim(),
        status: initialStatus,
        description: description.trim(),
        deliverables,
        certifications: selectedCertifications,
        slaCommitment: slaCommitment.trim() || '99.9% availability SLA with dedicated technical support',
        reviewerRemarks: initialStatus === 'APPROVED' ? 'Directly created and approved by Admin.' : 'Awaiting review.',
        decidedDate: initialStatus === 'APPROVED' ? new Date().toISOString().split('T')[0] : undefined,
      });

      success(`Service "${serviceName}" successfully added for ${selectedCompany.name}!`);
      navigate(`${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services`);
    } catch (err) {
      error('Failed to add service. Please check the form and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title="Add Company Service"
        subtitle="Select a company and configure a new enterprise capability or standardized service for marketplace listing."
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
          { label: 'Service Providers', path: ROUTES.ADMIN.SERVICE_PROVIDERS },
          { label: 'Service List', path: `${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services` },
          { label: 'Add Service' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services`)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Service List
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: SELECT TARGET COMPANY */}
        <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
          <CardHeader
            title="Step 1: Select Target Company"
            subtitle="Choose the verified enterprise or vendor offering this service"
            action={
              selectedCompany ? (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Company Selected
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Required Selection
                </span>
              )
            }
          />
          <CardBody className="p-6 space-y-4">
            {/* Searchable Dropdown / Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider">
                Select Company <span className="text-rose-400">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-[var(--brand-primary)] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Select a registered company --</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id} className="bg-[#041a14] text-slate-100">
                        {comp.name} ({comp.industry || 'Tech'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={companySearchQuery}
                    onChange={(e) => setCompanySearchQuery(e.target.value)}
                    placeholder="Quick search company name or CIN..."
                    className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Selected Company Preview Box */}
            {selectedCompany ? (
              <div className="p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-150">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center font-extrabold text-[var(--brand-primary)] text-lg shrink-0">
                    {selectedCompany.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{selectedCompany.name}</span>
                      <StatusBadge status={selectedCompany.verificationStatus} size="sm" />
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                      <span>CIN: {selectedCompany.cinNumber || 'Verified MCA'}</span>
                      <span>•</span>
                      <span className="text-teal-300">{selectedCompany.industry}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-right">
                  <span className="text-slate-400 block">Headquarters</span>
                  <span className="text-slate-200 font-medium">{selectedCompany.headquarters || 'India'}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[var(--border-subtle)] text-center text-xs text-slate-400">
                Please pick a registered company from the list above to associate this service.
              </div>
            )}
          </CardBody>
        </Card>

        {/* STEP 2: SERVICE SPECIFICATION FORM */}
        <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
          <CardHeader
            title="Step 2: Service Specification & Capabilities"
            subtitle="Configure service scope, category, deliverables, and SLAs"
          />
          <CardBody className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service Title */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Service Title / Solution Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Custom Cleanroom Robotic Integration & Calibration"
                  className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              {/* Service Category */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Industry / Service Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-[var(--brand-primary)]"
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#041a14] text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Model */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Delivery Model <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryModel}
                  onChange={(e) => setDeliveryModel(e.target.value)}
                  placeholder="e.g., Turnkey On-Site Deployment / SaaS / Hybrid"
                  className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              {/* Pricing Tier */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Pricing Tier / Commercial Terms <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pricingTier}
                  onChange={(e) => setPricingTier(e.target.value)}
                  placeholder="e.g., Enterprise SLA (Annual) or ₹3,500 - ₹5,000 / hr"
                  className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              {/* SLA Commitment */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  SLA / Availability Commitment
                </label>
                <input
                  type="text"
                  value={slaCommitment}
                  onChange={(e) => setSlaCommitment(e.target.value)}
                  placeholder="e.g., 99.98% uptime SLA with < 2-hour on-site response"
                  className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>

              {/* Service Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Service Description & Overview <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive summary of what this enterprise solution delivers, technical architecture, and implementation workflows..."
                  className="w-full p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)] resize-none"
                />
              </div>
            </div>

            {/* Deliverables Section */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-divider)]">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Key Deliverables & Scope Checklist <span className="text-rose-400">*</span>
              </label>

              <div className="space-y-2">
                {deliverables.map((deliv, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                      <span className="truncate">{deliv}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove deliverable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add deliverable input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDeliverable();
                    }
                  }}
                  placeholder="Add a new deliverable item and press enter or Add..."
                  className="flex-1 p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDeliverable}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-divider)]">
              <label className="text-xs font-bold text-cyan-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Compliance Accreditations & Certifications
              </label>

              <div className="flex flex-wrap gap-2">
                {PRESET_CERTIFICATIONS.map((cert) => {
                  const isChecked = selectedCertifications.includes(cert);
                  return (
                    <button
                      type="button"
                      key={cert}
                      onClick={() => toggleCertification(cert)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[var(--brand-primary)]/15 border-[var(--brand-primary)] text-[var(--brand-primary)]'
                          : 'bg-[var(--bg-card-inner)] border-[var(--border-subtle)] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {cert}
                    </button>
                  );
                })}
              </div>

              {/* Custom Cert input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customCert}
                  onChange={(e) => setCustomCert(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCert();
                    }
                  }}
                  placeholder="Add custom certification / standard..."
                  className="flex-1 p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomCert}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Standard
                </Button>
              </div>
            </div>

            {/* Publication Status Selection */}
            <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-2 pt-3 border-t border-[var(--border-divider)]">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Initial Verification & Publication State
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInitialStatus('APPROVED')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    initialStatus === 'APPROVED'
                      ? 'bg-emerald-500/15 border-emerald-500 text-slate-100'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Direct Catalog Publication (Approved)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Service will immediately become active and visible in the public catalog and company profile.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInitialStatus('PENDING')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    initialStatus === 'PENDING'
                      ? 'bg-amber-500/15 border-amber-500 text-slate-100'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Flag for Verification (Pending Review)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Service will appear in the Service Verification queue for reviewer verification before publishing.
                  </p>
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--border-divider)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services`)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isSubmitting ? 'Adding Service...' : 'Add & Publish Service'}
          </Button>
        </div>
      </form>
    </div>
  );
};
