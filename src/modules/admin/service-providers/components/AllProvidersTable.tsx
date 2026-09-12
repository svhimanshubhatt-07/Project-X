import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../../../shared/components/ui/Card';
import { Button } from '../../../../shared/components/ui/Button';
import { Tabs } from '../../../../shared/components/ui/Tabs';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { Modal } from '../../../../shared/components/ui/Modal';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { useServiceProviders } from '../../../../features/service-providers/hooks/useServiceProviders';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import { usePagination } from '../../../../shared/hooks/usePagination';
import { useToast } from '../../../../app/providers/ToastProvider';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Star,
  Search,
  Eye,
} from 'lucide-react';
import { ServiceProviderRecord } from '../../../../shared/services/mockDataStore';

export const AllProvidersTable: React.FC = () => {
  const { serviceProviders, setServiceProviderStatus, addServiceProvider } = useServiceProviders();
  const { success } = useToast();
  const navigate = useNavigate();

  const [activeStatusTab, setActiveStatusTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State for New Service Provider
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    category: 'Cloud Infrastructure & DevOps',
    location: '',
    contactPerson: '',
    email: '',
    phone: '',
    pricing: '₹3,500 - ₹5,000 / hr',
    description: '',
    website: 'https://',
    services: 'Cloud Migration, Kubernetes, FinOps',
  });

  // Collect unique categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(serviceProviders.map((s) => s.category)));
  }, [serviceProviders]);

  const filteredProviders = useMemo(() => {
    return serviceProviders.filter((sp) => {
      if (activeStatusTab === 'ACTIVE' && sp.status !== 'ACTIVE') return false;
      if (activeStatusTab === 'PENDING' && sp.status !== 'PENDING') return false;
      if (activeStatusTab === 'SUSPENDED' && sp.status !== 'SUSPENDED') return false;

      if (categoryFilter !== 'ALL' && sp.category !== categoryFilter) return false;

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          sp.name.toLowerCase().includes(q) ||
          sp.legalName.toLowerCase().includes(q) ||
          sp.category.toLowerCase().includes(q) ||
          sp.location.toLowerCase().includes(q) ||
          sp.services.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [serviceProviders, activeStatusTab, categoryFilter, debouncedSearch]);

  const { items } = usePagination(filteredProviders, 8);

  const handleToggleStatus = (sp: ServiceProviderRecord) => {
    const nextStatus = sp.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setServiceProviderStatus(sp.id, nextStatus);
    success(`Service provider ${sp.name} set to ${nextStatus}.`);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceProvider({
      name: formData.name,
      legalName: formData.legalName || formData.name,
      category: formData.category,
      rating: 5.0,
      reviewsCount: 1,
      location: formData.location || 'Bengaluru, India',
      services: formData.services.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'ACTIVE',
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      pricing: formData.pricing,
      completedProjects: 0,
      verified: true,
      description: formData.description,
      website: formData.website,
    });
    setIsAddModalOpen(false);
    success('Service provider enrolled successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Add Button and Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          variant="status-cards"
          activeTab={activeStatusTab}
          onChange={setActiveStatusTab}
          tabs={[
            {
              id: 'ALL',
              label: 'All Providers',
              count: serviceProviders.length,
              icon: <Briefcase className="w-4 h-4 text-cyan-400" />,
            },
            {
              id: 'ACTIVE',
              label: 'Verified & Active',
              count: serviceProviders.filter((s) => s.status === 'ACTIVE').length,
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            },
            {
              id: 'PENDING',
              label: 'Pending Verification',
              count: serviceProviders.filter((s) => s.status === 'PENDING').length,
              icon: <Clock className="w-4 h-4 text-amber-400" />,
            },
          ]}
        />

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shrink-0 self-start sm:self-center"
        >
          Add Service Provider
        </Button>
      </div>

      {/* Providers Table View */}
      <Card>
        <div className="p-4 border-b border-[#143144] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search providers by name, capabilities, location..."
              className="w-full pl-9 pr-4 py-2 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-table-header)] bg-[var(--bg-table-header)]">
                  <th className="py-3.5 px-6 text-[var(--text-table-header)] font-semibold uppercase tracking-wider">PROVIDER NAME</th>
                  <th className="py-3.5 px-6 text-[var(--text-table-header)] font-semibold uppercase tracking-wider">CATEGORY</th>
                  <th className="py-3.5 px-6 text-[var(--text-table-header)] font-semibold uppercase tracking-wider">CONTACT PERSON</th>
                  <th className="py-3.5 px-6 text-[var(--text-table-header)] font-semibold uppercase tracking-wider">STATUS</th>
                  <th className="py-3.5 px-6 text-[var(--text-table-header)] font-semibold uppercase tracking-wider">RATING</th>
                  <th className="py-3.5 px-6 text-[var(--text-table-header)] font-semibold uppercase tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-table-row)]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[var(--text-table-muted)]">
                      No service providers found matching criteria.
                    </td>
                  </tr>
                ) : (
                  items.map((sp) => (
                    <tr key={sp.id} className="hover:bg-[var(--bg-table-row-hover)] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {sp.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-[var(--text-table-body)]">{sp.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {sp.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-200 font-medium">{sp.contactPerson}</span>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={sp.status} size="sm" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{sp.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/service-providers/${sp.id}`)}
                            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
                            title="View Service Provider Details"
                            aria-label="View Service Provider Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Button
                            size="sm"
                            variant={sp.status === 'ACTIVE' ? 'outline' : 'success'}
                            onClick={() => handleToggleStatus(sp)}
                            className="text-xs"
                          >
                            {sp.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Add Provider Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Service Provider"
        size="lg"
      >
        <form onSubmit={handleCreateProvider} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Provider / Business Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Cloud Solutions"
              required
            />
            <Input
              label="Legal Corporate Name"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              placeholder="e.g. Apex Cloud Solutions Pvt Ltd"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Category"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              options={[
                { value: 'Cloud Infrastructure & DevOps', label: 'Cloud Infrastructure & DevOps' },
                { value: 'Legal & Corporate Governance', label: 'Legal & Corporate Governance' },
                { value: 'Finance, Tax & Audit', label: 'Finance, Tax & Audit' },
                { value: 'Cybersecurity & Compliance', label: 'Cybersecurity & Compliance' },
                { value: 'AI & Data Science', label: 'AI & Data Science' },
                { value: 'Logistics & Supply Chain', label: 'Logistics & Supply Chain' },
              ]}
            />
            <Input
              label="Location / City"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bengaluru, Karnataka"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Full name"
              required
            />
            <Input
              label="Business Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@vendor.io"
              required
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hourly / Contract Pricing"
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
              placeholder="e.g. ₹3,500 - ₹5,000 / hr"
            />
            <Input
              label="Website URL"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://vendor.io"
            />
          </div>

          <Input
            label="Key Services (comma separated)"
            value={formData.services}
            onChange={(e) => setFormData({ ...formData, services: e.target.value })}
            placeholder="e.g. Cloud Migration, Kubernetes, SOC2 Compliance"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Overview / Business Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe technical capabilities, enterprise experience, and focus areas..."
              className="w-full px-4 py-2.5 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143144]">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Provider Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
