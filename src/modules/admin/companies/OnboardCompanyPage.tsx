import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  Building2,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  Check,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileCheck,
  Sparkles,
  Calendar,
  Award,
  User,
} from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export const OnboardCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCompany } = useCompanies();
  const { users } = useUsers();
  const { success, error, info } = useToast();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State adhering exactly to the user's requirements
  const [formData, setFormData] = useState({
    // Step 1: Overview
    userId: '', // Primary User / Account Owner
    organizationName: '',
    companyName: '',
    type: 'Startup', // Startup or Company
    industry: 'Tech',
    size: '11-50',
    establishYear: new Date().getFullYear().toString(),
    description: '',
    // Contact details
    mail: '',
    phone: '',
    websiteLink: 'https://',
    locationLink: '',
    city: '',
    state: '',
    country: 'India',

    // Step 2: Tax Related Details
    registrationNo: '',
    panNumber: '',
    gstNumber: '',
    incorporationDate: '',
    registrationAuthority: 'MCA / Startup India',
    recognitionNumber: '',
  });

  const selectedUser = users.find((u) => u.id === formData.userId);

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setFormData((prev) => ({
      ...prev,
      userId,
      mail: user?.email ? user.email : prev.mail,
      phone: user?.phone ? user.phone : prev.phone,
      organizationName: prev.organizationName ? prev.organizationName : (user?.companyName || ''),
      companyName: prev.companyName ? prev.companyName : (user?.companyName || ''),
    }));
  };

  // Step 3: Documents Upload State
  const [documents, setDocuments] = useState<{
    incorporationCert: UploadedDoc | null;
    panCard: UploadedDoc | null;
    gstCert: UploadedDoc | null;
    startupRecognitionCert: UploadedDoc | null;
  }>({
    incorporationCert: null,
    panCard: null,
    gstCert: null,
    startupRecognitionCert: null,
  });

  const handleSimulateUpload = (key: keyof typeof documents, docLabel: string) => {
    const mockFile: UploadedDoc = {
      id: `doc_${Date.now()}`,
      name: `${docLabel}_${formData.companyName ? formData.companyName.replace(/\s+/g, '_') : 'Company'}.pdf`,
      type: 'PDF Document',
      size: `${(Math.random() * 1.5 + 0.8).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setDocuments((prev) => ({ ...prev, [key]: mockFile }));
    info(`Uploaded: ${mockFile.name}`);
  };

  const handleRemoveDoc = (key: keyof typeof documents) => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
  };

  // Validations
  const validateStep1 = () => {
    if (!formData.companyName.trim()) {
      error('Please enter the Company Name.');
      return false;
    }
    if (!formData.mail.trim()) {
      error('Please enter the Official Contact Mail.');
      return false;
    }
    if (!formData.city.trim()) {
      error('Please enter the City.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.panNumber.trim() && !formData.registrationNo.trim()) {
      error('Please enter at least Registration No or PAN Number.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const createdCompany = addCompany({
      name: formData.companyName,
      legalName: formData.organizationName || formData.companyName,
      industry: formData.industry,
      companyType: formData.type,
      companySize: formData.size,
      headquarters: `${formData.city}, ${formData.state}`,
      foundedYear: parseInt(formData.establishYear, 10) || new Date().getFullYear(),
      website: formData.websiteLink,
      email: formData.mail,
      phone: formData.phone || (selectedUser?.phone || '+91 98765 43210'),
      verificationStatus: 'VERIFIED',
      companyStatus: 'ACTIVE',
      listingStatus: 'PUBLISHED',
      description: formData.description || `${formData.companyName} is an empaneled ${formData.type} operating in the ${formData.industry} industry.`,
      representativeName: selectedUser ? selectedUser.name : 'Authorized Signatory',
      representativeEmail: selectedUser ? selectedUser.email : formData.mail,
      representativePhone: selectedUser ? selectedUser.phone : formData.phone,
      gstNumber: formData.gstNumber || '29AABCS1429B1ZB',
      cinNumber: formData.registrationNo || 'U72200KA2023PTC174829',
      registeredAddress: `${formData.city}, ${formData.state}, ${formData.country}`,
      profileCompletion: 100,
    });

    success(`Company "${createdCompany.name}" onboarded successfully!`);
    navigate(ROUTES.ADMIN.COMPANIES);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Onboard New Company"
        subtitle="Complete the 3-step registration: Overview & Contact, Tax & Statutory Details, and Statutory Document Uploads."
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Companies', path: ROUTES.ADMIN.COMPANIES },
          { label: 'Onboard Company' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Cancel & Return
          </Button>
        }
      />

      {/* 3-Step Wizard Navigation Stepper */}
      <Card className="bg-[#091e2b] border-[#17384e] shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${currentStep === 1
                  ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                  : currentStep > 1
                    ? 'bg-[#0b2434] border-emerald-500/40 text-emerald-300'
                    : 'bg-[#081723] border-[#17384e] text-slate-400 opacity-60'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${currentStep === 1
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : currentStep > 1
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#143144] text-slate-400'
                  }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4 text-emerald-400" /> : '1'}
              </div>
              <div className="hidden sm:block truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider block text-teal-400/80">Step 1</span>
                <span className="text-xs font-bold text-slate-100">Overview & Contact</span>
              </div>
            </button>

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${currentStep === 2
                  ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                  : currentStep > 2
                    ? 'bg-[#0b2434] border-emerald-500/40 text-emerald-300'
                    : 'bg-[#081723] border-[#17384e] text-slate-400 opacity-60'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${currentStep === 2
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : currentStep > 2
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#143144] text-slate-400'
                  }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4 text-emerald-400" /> : '2'}
              </div>
              <div className="hidden sm:block truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider block text-teal-400/80">Step 2</span>
                <span className="text-xs font-bold text-slate-100">Tax & Registration</span>
              </div>
            </button>

            {/* Step 3 Pill */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2()) setCurrentStep(3);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${currentStep === 3
                  ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                  : 'bg-[#081723] border-[#17384e] text-slate-400 opacity-60'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${currentStep === 3
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'bg-[#143144] text-slate-400'
                  }`}
              >
                3
              </div>
              <div className="hidden sm:block truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider block text-teal-400/80">Step 3</span>
                <span className="text-xs font-bold text-slate-100">Document Upload</span>
              </div>
            </button>
          </div>
        </div>
      </Card>

      <form onSubmit={handleFinalSubmit} className="space-y-6">
        {/* ================= STEP 1: OVERVIEW & CONTACT ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Overview Section */}
            <Card>
              <CardHeader className="border-b border-[#143144] py-4 px-6 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Company Overview</h3>
                  <p className="text-[11px] text-slate-400">Basic organization structure, entity type, and classification</p>
                </div>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                {/* 1. Select User / Organization Owner */}
                <div className="p-4 rounded-xl bg-[#091b27] border border-teal-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-400" />
                      <label className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                        Select User (Organization Owner / Representative)
                      </label>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {users.length} Users Available
                    </span>
                  </div>

                  <Select
                    value={formData.userId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    options={[
                      { value: '', label: '-- Select Registered User / Website Visitor / Founder --' },
                      ...users.map((u) => {
                        const roleLabel =
                          u.role === 'VISITOR'
                            ? '🌐 Website Visitor'
                            : u.role === 'REGISTERED_USER'
                              ? '🌐 Website Signup'
                              : u.role === 'COMPANY_OWNER'
                                ? '🏢 Company Owner'
                                : u.role === 'STAKEHOLDER'
                                  ? '💼 Stakeholder'
                                  : u.role === 'ADMIN'
                                    ? '🛡️ Admin'
                                    : u.role;
                        return {
                          value: u.id,
                          label: `${u.name} • ${u.email} [${roleLabel}]`,
                        };
                      }),
                    ]}
                  />

                  {selectedUser && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0c2333] border border-teal-500/30 text-xs shadow-inner">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold flex items-center justify-center text-xs shadow-sm">
                          {selectedUser.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100">{selectedUser.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-mono text-[10px] border border-teal-500/30">
                              {selectedUser.role === 'REGISTERED_USER' ? 'Website User (Email/Password)' : selectedUser.role.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-slate-400 text-[11px] font-mono mt-0.5 block">
                            ✉ {selectedUser.email} {selectedUser.phone ? ` • 📞 ${selectedUser.phone}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                        <span className="text-teal-400 block font-semibold">Registered: {selectedUser.registrationDate}</span>
                        <span>{selectedUser.designation || 'Platform User'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Organization Name"
                    placeholder="e.g. Apex Enterprises Holdings"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                  <Input
                    label="Company Name"
                    placeholder="e.g. Apex Global Technologies"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Type (Startup / Company)"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    options={[
                      { value: 'Startup', label: 'Startup (Early / Seed Stage)' },
                      { value: 'Company', label: 'Company (Established Enterprise)' },
                      { value: 'Scaleup', label: 'Scaleup (Growth Stage)' },
                      { value: 'Corporate', label: 'Corporate Group' },
                    ]}
                  />

                  <Select
                    label="Industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    options={[
                      { value: 'Tech', label: 'Tech & SaaS' },
                      { value: 'Food Tech', label: 'Food Tech & QSR' },
                      { value: 'Health Tech', label: 'Health & BioTech' },
                      { value: 'Fintech', label: 'Fintech & Banking' },
                      { value: 'CleanTech', label: 'CleanTech & Energy' },
                      { value: 'Logistics', label: 'Logistics & Supply Chain' },
                      { value: 'EdTech', label: 'EdTech & Learning' },
                      { value: 'E-Commerce', label: 'E-Commerce & D2C' },
                    ]}
                  />

                  <Select
                    label="Size (Team Scale)"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    options={[
                      { value: '1-10', label: '1 - 10 Employees' },
                      { value: '11-50', label: '11 - 50 Employees' },
                      { value: '51-200', label: '51 - 200 Employees' },
                      { value: '201-500', label: '201 - 500 Employees' },
                      { value: '500+', label: '500+ Enterprise' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Establish Year"
                    type="number"
                    placeholder="e.g. 2022"
                    value={formData.establishYear}
                    onChange={(e) => setFormData({ ...formData, establishYear: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Description about Company
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a summary of company vision, primary products, target market, and focus areas..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </CardBody>
            </Card>

            {/* 2. Contact Section */}
            <Card>
              <CardHeader className="border-b border-[#143144] py-4 px-6 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Contact & Location Details</h3>
                  <p className="text-[11px] text-slate-400">Communication channels, geographic coordinates, and regional address</p>
                </div>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mail (Official Corporate Email)"
                    placeholder="contact@company.com"
                    type="email"
                    value={formData.mail}
                    onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone (Contact Number)"
                    placeholder="+91 98450 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Website Link"
                    placeholder="https://company.com"
                    value={formData.websiteLink}
                    onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                  />
                  <Input
                    label="Location Link (Google Maps / URL)"
                    placeholder="https://maps.google.com/?q=..."
                    value={formData.locationLink}
                    onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Karnataka"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="Country"
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Step 1 Proceed Button */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Tax Details
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: TAX RELATED DETAILS ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card>
              <CardHeader className="border-b border-[#143144] py-4 px-6 flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Tax & Registration Details</h3>
                  <p className="text-[11px] text-slate-400">Statutory tax identifiers, incorporation timestamp, and recognition credentials</p>
                </div>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Registration No (CIN / LLPIN)"
                    placeholder="e.g. U72200KA2023PTC174829"
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                    required
                  />
                  <Input
                    label="PAN Number"
                    placeholder="e.g. AABCA1234D"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    required
                  />
                  <Input
                    label="GST Number (GSTIN)"
                    placeholder="e.g. 29AABCA1234D1Z5"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Incorporation Date"
                    type="date"
                    value={formData.incorporationDate}
                    onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
                  />

                  <Select
                    label="Registration Authority"
                    value={formData.registrationAuthority}
                    onChange={(e) => setFormData({ ...formData, registrationAuthority: e.target.value })}
                    options={[
                      { value: 'MCA / Startup India', label: 'Ministry of Corporate Affairs (MCA) / Startup India' },
                      { value: 'Partnership Registrar', label: 'Registrar of Firms (Partnership)' },
                      { value: 'LLP Registrar', label: 'LLP Registry' },
                      { value: 'MSME / Udyam', label: 'MSME / Udyam Authority' },
                      { value: 'State Commercial Tax', label: 'State Commercial Tax Dept' },
                    ]}
                  />

                  <Input
                    label="Recognition Number (DPIIT / MSME No)"
                    placeholder="e.g. DIPP123456 / UDYAM-00123"
                    value={formData.recognitionNumber}
                    onChange={(e) => setFormData({ ...formData, recognitionNumber: e.target.value })}
                  />
                </div>

                <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-start gap-3 mt-4">
                  <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-teal-300 block mb-0.5">Automated Tax & Entity Validation</span>
                    Tax identifiers and statutory registration records will be verified against the official government registry.
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Step 2 Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Overview
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Document Uploads
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DOCUMENTS UPLOAD SECTION ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card>
              <CardHeader className="border-b border-[#143144] py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UploadCloud className="w-5 h-5 text-teal-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Documents Upload Section</h3>
                    <p className="text-[11px] text-slate-400">Upload statutory corporate certificates and verification records</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
                  {Object.values(documents).filter(Boolean).length} / 4 Attached
                </span>
              </CardHeader>

              <CardBody className="p-6 space-y-5">
                {/* 1. Incorporation Certificate */}
                <div className="p-4 bg-[#091b27] border border-[#17384e] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">Incorporation Certificate</span>
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Official Certificate of Incorporation (COI) issued by MCA / Registrar
                      </p>
                      {documents.incorporationCert && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{documents.incorporationCert.name} ({documents.incorporationCert.size})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {documents.incorporationCert ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveDoc('incorporationCert')}
                        className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSimulateUpload('incorporationCert', 'Incorporation_Certificate')}
                        leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Upload Certificate
                      </Button>
                    )}
                  </div>
                </div>

                {/* 2. PAN Card */}
                <div className="p-4 bg-[#091b27] border border-[#17384e] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">PAN Card</span>
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Scanned copy of corporate Permanent Account Number (PAN) Card
                      </p>
                      {documents.panCard && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{documents.panCard.name} ({documents.panCard.size})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {documents.panCard ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveDoc('panCard')}
                        className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSimulateUpload('panCard', 'Company_PAN')}
                        leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Upload PAN Card
                      </Button>
                    )}
                  </div>
                </div>

                {/* 3. GST Certificate */}
                <div className="p-4 bg-[#091b27] border border-[#17384e] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">GST Certificate</span>
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        GST Registration Certificate (Form GST REG-06)
                      </p>
                      {documents.gstCert && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{documents.gstCert.name} ({documents.gstCert.size})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {documents.gstCert ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveDoc('gstCert')}
                        className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSimulateUpload('gstCert', 'GST_Certificate')}
                        leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Upload GST Certificate
                      </Button>
                    )}
                  </div>
                </div>

                {/* 4. Startup Recognition Certificate */}
                <div className="p-4 bg-[#091b27] border border-[#17384e] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">Startup Recognition Certificate</span>
                        <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          Startup India / DPIIT
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        DPIIT Startup India Recognition Certificate or MSME Udyam Registration
                      </p>
                      {documents.startupRecognitionCert && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{documents.startupRecognitionCert.name} ({documents.startupRecognitionCert.size})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {documents.startupRecognitionCert ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveDoc('startupRecognitionCert')}
                        className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSimulateUpload('startupRecognitionCert', 'Startup_Recognition')}
                        leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Upload Recognition
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Final Confirmation & Complete Onboarding */}
            <Card className="bg-gradient-to-r from-[#0d2a3d] to-[#081b27] border-teal-500/40 shadow-xl">
              <CardBody className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block font-mono">
                      Ready for Activation
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Enrolling <span className="text-teal-300">{formData.companyName || 'New Company'}</span> ({formData.type})
                    </h4>
                    <p className="text-xs text-slate-300">
                      Entity will be verified and added to the platform directory with full compliance badges.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setCurrentStep(2)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back to Tax Details
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="shadow-lg shadow-teal-500/20"
                    >
                      Complete Onboarding
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </form>
    </div>
  );
};
