import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../../../shared/components/ui/Card';
import { Button } from '../../../../shared/components/ui/Button';
import { Modal } from '../../../../shared/components/ui/Modal';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import { useServiceProviders } from '../../../../features/service-providers/hooks/useServiceProviders';
import { ROUTES } from '../../../../shared/constants/routes.constants';
import {
  Briefcase,
  Search,
  Cpu,
  Scale,
  DollarSign,
  Lock,
  Sparkles,
  Truck,
  Star,
  Check,
  ChevronDown,
  Layers,
} from 'lucide-react';

export interface ServiceTypeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  deliveryTime: string;
  deliverables: string[];
  providerIds: string[];
}

export const INITIAL_SERVICE_TYPES: ServiceTypeItem[] = [
  // Cloud Infrastructure & DevOps
  {
    id: 'srv_01',
    name: 'AWS & GCP Cloud Migration',
    category: 'Cloud Infrastructure & DevOps',
    description: 'Zero-downtime lift-and-shift and cloud-native re-architecting for enterprise workloads with automated failover.',
    pricing: '₹3,500 - ₹5,500 / hr',
    deliveryTime: '2 - 6 Weeks',
    deliverables: ['Cloud Architecture Plan', 'Terraform Infrastructure as Code', 'Zero-Downtime Data Migration', 'Cost Governance Setup'],
    providerIds: ['sp_01'],
  },
  {
    id: 'srv_02',
    name: 'Kubernetes & Container Orchestration',
    category: 'Cloud Infrastructure & DevOps',
    description: 'Production-grade multi-cluster Kubernetes deployments with Istio service mesh, GitOps pipelines, and auto-scaling.',
    pricing: '₹4,000 - ₹6,000 / hr',
    deliveryTime: '3 - 8 Weeks',
    deliverables: ['Production K8s Cluster Blueprint', 'ArgoCD / Flux GitOps CI/CD', 'Observability Stack (Prometheus/Grafana)', 'Security Hardening'],
    providerIds: ['sp_01'],
  },
  {
    id: 'srv_03',
    name: 'Cost Optimization & FinOps',
    category: 'Cloud Infrastructure & DevOps',
    description: 'Comprehensive cloud spending audit, reserved instance management, idle asset de-provisioning, and monthly cost anomaly detection.',
    pricing: '₹3,000 - ₹4,500 / hr',
    deliveryTime: '1 - 2 Weeks',
    deliverables: ['Cloud Spend Audit Report', 'FinOps Tagging Strategy', 'RI & Savings Plan Modeling', 'Automated Budget Alerts'],
    providerIds: ['sp_01'],
  },
  {
    id: 'srv_04',
    name: 'CI/CD Automation & DevOps Pipelines',
    category: 'Cloud Infrastructure & DevOps',
    description: 'Automated build, test, and release engineering pipelines with built-in security scans (SAST/DAST) and instant rollbacks.',
    pricing: '₹3,200 - ₹5,000 / hr',
    deliveryTime: '2 - 4 Weeks',
    deliverables: ['GitHub Actions / GitLab CI Pipeline', 'Automated Container Security Scans', 'Staging & Production Deploy Matrix', 'Team Runbooks'],
    providerIds: ['sp_01'],
  },

  // Legal & Corporate Governance
  {
    id: 'srv_05',
    name: 'MCA Filings & Secretarial Audit',
    category: 'Legal & Corporate Governance',
    description: 'End-to-end statutory annual filings, board minutes, ROC compliances, Director KYC, and secretarial governance audits.',
    pricing: '₹25,000 - ₹60,000 / filing',
    deliveryTime: '5 - 10 Days',
    deliverables: ['AOC-4 & MGT-7 Filings', 'Secretarial Compliance Certificate', 'Board & AGM Resolution Drafting', 'Statutory Registers Update'],
    providerIds: ['sp_02'],
  },
  {
    id: 'srv_06',
    name: 'Startup Incorporation & SHA Drafting',
    category: 'Legal & Corporate Governance',
    description: 'Complete DPIIT-recognized incorporation, Shareholders Agreements (SHA), ESOP policy structuring, and Cap Table advisory.',
    pricing: '₹40,000 - ₹1,20,000 / pkg',
    deliveryTime: '1 - 3 Weeks',
    deliverables: ['Certificate of Incorporation', 'Bespoke Shareholders Agreement', 'ESOP Pool Scheme & Grant Letters', 'Founders Alignment Deed'],
    providerIds: ['sp_02'],
  },
  {
    id: 'srv_07',
    name: 'IP & Trademark Registration',
    category: 'Legal & Corporate Governance',
    description: 'Brand trademark search, provisional patent drafting, copyright filing, and protection against intellectual property infringement.',
    pricing: '₹15,000 - ₹45,000 / mark',
    deliveryTime: '2 - 4 Weeks',
    deliverables: ['TM Search & Clearance Report', 'Trademark Application Filing', 'Response to Examination Reports', 'Cease & Desist Notices (if needed)'],
    providerIds: ['sp_02'],
  },
  {
    id: 'srv_08',
    name: 'Regulatory Compliance & DPIIT Advisory',
    category: 'Legal & Corporate Governance',
    description: 'Specialized regulatory advisory for cross-border investments, FEMA/RBI compliance, startup tax exemptions (Section 80-IAC).',
    pricing: '₹4,000 - ₹8,000 / hr',
    deliveryTime: '2 - 4 Weeks',
    deliverables: ['FDI / FEMA Form FC-GPR Filing', 'Section 80-IAC Tax Exemption Dossier', 'Angel Tax Exemption Advisory', 'Regulatory Opinion Letter'],
    providerIds: ['sp_02'],
  },

  // Finance, Tax & Audit
  {
    id: 'srv_09',
    name: 'Statutory & Tax Audit',
    category: 'Finance, Tax & Audit',
    description: 'Independent financial statements audit in accordance with Indian Accounting Standards (Ind AS) and Income Tax Act compliance.',
    pricing: '₹75,000 - ₹2,50,000 / audit',
    deliveryTime: '3 - 6 Weeks',
    deliverables: ['Independent Auditor Report', 'Tax Audit Report (Form 3CD)', 'Internal Financial Controls Assessment', 'Management Representation Letter'],
    providerIds: ['sp_03'],
  },
  {
    id: 'srv_10',
    name: 'GST & Transfer Pricing Advisory',
    category: 'Finance, Tax & Audit',
    description: 'Complex Goods and Services Tax advisory, monthly GSTR reconciliation, transfer pricing benchmarking, and international tax treaties.',
    pricing: '₹5,000 - ₹10,000 / hr',
    deliveryTime: 'Ongoing / 1 - 2 Weeks',
    deliverables: ['GSTR-9 & 9C Annual Reconciliation', 'Transfer Pricing Study Report (Form 3CEB)', 'Input Tax Credit (ITC) Optimization', 'GST Audit Defense Dossier'],
    providerIds: ['sp_03'],
  },
  {
    id: 'srv_11',
    name: 'Due Diligence & Business Valuation',
    category: 'Finance, Tax & Audit',
    description: 'Comprehensive financial, tax, and legal due diligence for fundraising rounds, along with DCF and Rule 11UA valuation certificates.',
    pricing: '₹1,50,000 - ₹4,00,000 / project',
    deliveryTime: '2 - 4 Weeks',
    deliverables: ['Financial & Tax Due Diligence Report', 'Registered Valuer DCF Valuation Certificate', 'Historical EBITDA Normalization', 'Working Capital Peg Analysis'],
    providerIds: ['sp_03'],
  },
  {
    id: 'srv_12',
    name: 'Virtual CFO Advisory Services',
    category: 'Finance, Tax & Audit',
    description: 'Part-time fractional CFO leadership managing investor reporting, cash flow modeling, unit economics, and board presentations.',
    pricing: '₹60,000 - ₹1,80,000 / mo',
    deliveryTime: 'Monthly Retainer',
    deliverables: ['Monthly MIS & Cash Burn Forecast', 'Unit Economics & CAC/LTV Model', 'Investor Board Deck Preparation', 'Banking & Debt Syndication Support'],
    providerIds: ['sp_03'],
  },

  // Cybersecurity & Compliance
  {
    id: 'srv_13',
    name: 'SOC2 & ISO 27001 Certification',
    category: 'Cybersecurity & Compliance',
    description: 'Gap assessment, policy drafting, evidence collection, and pre-audit readiness for SOC 2 Type II and ISO/IEC 27001:2022 standards.',
    pricing: '₹2,00,000 - ₹5,00,000 / cert',
    deliveryTime: '6 - 12 Weeks',
    deliverables: ['Information Security Policy Pack', 'SOC 2 Type II Readiness Report', 'Continuous Compliance Tool Setup', 'Auditor Evidence Review'],
    providerIds: ['sp_04'],
  },
  {
    id: 'srv_14',
    name: 'Vulnerability Assessment & Pen Testing (VAPT)',
    category: 'Cybersecurity & Compliance',
    description: 'Rigorous black-box and white-box penetration testing for web apps, mobile apps, and cloud APIs with CERT-In signed certificates.',
    pricing: '₹50,000 - ₹1,50,000 / test',
    deliveryTime: '1 - 3 Weeks',
    deliverables: ['CERT-In Empaneled VAPT Report', 'Proof-of-Concept Exploit Steps', 'Remediation Verification & Retest', 'Safe-to-Host Security Certificate'],
    providerIds: ['sp_04'],
  },
  {
    id: 'srv_15',
    name: 'Cloud Security & IAM Hardening',
    category: 'Cybersecurity & Compliance',
    description: 'AWS/GCP security posture management, IAM least-privilege enforcement, S3 bucket lockdowns, and KMS encryption key rotation.',
    pricing: '₹4,500 - ₹7,500 / hr',
    deliveryTime: '2 - 4 Weeks',
    deliverables: ['Cloud Security Benchmark Audit', 'Automated GuardDuty / SecurityHub Setup', 'IAM Least-Privilege Remediation', 'Threat Detection Playbooks'],
    providerIds: ['sp_04'],
  },
  {
    id: 'srv_16',
    name: 'Zero Trust Architecture Advisory',
    category: 'Cybersecurity & Compliance',
    description: 'Design and rollout of micro-segmented networks, single sign-on (SSO), multi-factor authentication (MFA), and zero-trust remote access.',
    pricing: '₹5,000 - ₹8,500 / hr',
    deliveryTime: '4 - 8 Weeks',
    deliverables: ['Zero Trust Architecture Blueprint', 'Okta / Azure AD SSO Integration', 'Software-Defined Perimeter (SDP) Setup', 'Endpoint Compliance Validation'],
    providerIds: ['sp_04'],
  },

  // AI & Data Science
  {
    id: 'srv_17',
    name: 'Custom LLM Fine-Tuning & Prompt Ops',
    category: 'AI & Data Science',
    description: 'Domain-specific fine-tuning of Llama 3, Mistral, and Claude models on proprietary company datasets with RLHF alignment.',
    pricing: '₹6,000 - ₹12,000 / hr',
    deliveryTime: '3 - 6 Weeks',
    deliverables: ['Curated Dataset Pre-Processing', 'LoRA / QLoRA Fine-Tuned Weights', 'Inference Benchmarking & Eval Matrix', 'Private Host API Deployment'],
    providerIds: ['sp_05'],
  },
  {
    id: 'srv_18',
    name: 'Computer Vision Pipeline Development',
    category: 'AI & Data Science',
    description: 'Real-time object detection, OCR extraction, anomaly detection, and facial recognition models optimized with TensorRT.',
    pricing: '₹5,500 - ₹11,000 / hr',
    deliveryTime: '4 - 10 Weeks',
    deliverables: ['Annotated Vision Dataset & Pipeline', 'TensorRT Optimized ONNX Model', 'Real-Time Video Stream Inference Node', 'Accuracy & Latency SLA Report'],
    providerIds: ['sp_05'],
  },
  {
    id: 'srv_19',
    name: 'Predictive Analytics & Forecasting Models',
    category: 'AI & Data Science',
    description: 'Time-series demand forecasting, customer churn prediction, and algorithmic pricing engines built on XGBoost and Deep Learning.',
    pricing: '₹5,000 - ₹9,500 / hr',
    deliveryTime: '3 - 6 Weeks',
    deliverables: ['Feature Engineering Pipeline', 'Production Predictive Model & API', 'Model Drift Monitoring Dashboard', 'Business Impact & ROI Simulation'],
    providerIds: ['sp_05'],
  },
  {
    id: 'srv_20',
    name: 'Edge AI & Embedded Acceleration',
    category: 'AI & Data Science',
    description: 'Quantization and porting of neural networks to NVIDIA Jetson, Coral TPU, and Raspberry Pi embedded hardware with low latency.',
    pricing: '₹6,500 - ₹12,500 / hr',
    deliveryTime: '4 - 8 Weeks',
    deliverables: ['Quantized INT8 / FP16 Model Weights', 'Jetson / Edge Device Runtime Driver', 'Thermal & Power Optimization Benchmarks', 'Firmware Flash Package'],
    providerIds: ['sp_05'],
  },

  // Logistics & Supply Chain
  {
    id: 'srv_21',
    name: 'Pan-India Express Fulfillment & 3PL',
    category: 'Logistics & Supply Chain',
    description: 'Same-day and next-day multi-city delivery networks with bonded warehouse storage, barcode scanning, and real-time shipment APIs.',
    pricing: 'Custom Contract',
    deliveryTime: 'SLA: 24 - 48 Hours',
    deliverables: ['Warehousing & Inventory Management', 'Automated Pick, Pack & Dispatch', 'Real-Time GPS Tracking Webhooks', 'Automated Proof of Delivery (POD)'],
    providerIds: ['sp_06'],
  },
  {
    id: 'srv_22',
    name: 'Cold-Chain Warehousing & Transport',
    category: 'Logistics & Supply Chain',
    description: 'Temperature-controlled pharmaceutical and perishable food logistics with IoT temperature logging and backup generators.',
    pricing: 'Custom Contract',
    deliveryTime: 'Continuous SLA',
    deliverables: ['2°C to 8°C & -20°C Cold Storage', 'IoT Real-Time Temperature Logs', 'Validated Thermal Packaging Box', 'Hazard & Spillage Contingency Protocol'],
    providerIds: ['sp_06'],
  },
  {
    id: 'srv_23',
    name: 'Reverse Logistics & Returns Automation',
    category: 'Logistics & Supply Chain',
    description: 'Automated return merchandise authorization (RMA), doorstep QC check, refurbishment routing, and automated customer refund triggers.',
    pricing: 'Custom Contract',
    deliveryTime: 'SLA: 3 - 5 Days',
    deliverables: ['Doorstep Quality Inspection App', 'Restocking & Refurbishment Sorting', 'Return Fraud Mitigation Rules', 'ERP Inventory Resync API'],
    providerIds: ['sp_06'],
  },
  {
    id: 'srv_24',
    name: 'Customs Clearance & Freight Forwarding',
    category: 'Logistics & Supply Chain',
    description: 'Air and ocean cargo forwarding, Bill of Entry clearance at major ports, tariff classification, and bonded cross-docking.',
    pricing: 'Custom Contract',
    deliveryTime: '2 - 7 Days',
    deliverables: ['HSN Code Harmonization & Duty Calc', 'Port & Airport Bill of Entry Clearance', 'Bill of Lading Documentation', 'Multi-Modal Bonded Transit'],
    providerIds: ['sp_06'],
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Cloud Infrastructure & DevOps': <Cpu className="w-4 h-4 text-emerald-400" />,
  'Legal & Corporate Governance': <Scale className="w-4 h-4 text-teal-400" />,
  'Finance, Tax & Audit': <DollarSign className="w-4 h-4 text-amber-400" />,
  'Cybersecurity & Compliance': <Lock className="w-4 h-4 text-rose-400" />,
  'AI & Data Science': <Sparkles className="w-4 h-4 text-purple-400" />,
  'Logistics & Supply Chain': <Truck className="w-4 h-4 text-cyan-400" />,
};

const CATEGORIES = [
  'Cloud Infrastructure & DevOps',
  'Legal & Corporate Governance',
  'Finance, Tax & Audit',
  'Cybersecurity & Compliance',
  'AI & Data Science',
  'Logistics & Supply Chain',
];

export const ServiceListCatalog: React.FC = () => {
  const { serviceProviders } = useServiceProviders();
  const navigate = useNavigate();
  const [serviceTypes] = useState<ServiceTypeItem[]>(INITIAL_SERVICE_TYPES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 200);
  const [selectedService, setSelectedService] = useState<ServiceTypeItem | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredServices = useMemo(() => {
    return serviceTypes.filter((srv) => {
      if (selectedCategory !== 'ALL' && srv.category !== selectedCategory) {
        return false;
      }
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = srv.name.toLowerCase().includes(q);
        const matchesCat = srv.category.toLowerCase().includes(q);
        const matchesDesc = srv.description.toLowerCase().includes(q);
        const matchesDeliv = srv.deliverables.some((d) => d.toLowerCase().includes(q));
        return matchesName || matchesCat || matchesDesc || matchesDeliv;
      }
      return true;
    });
  }, [serviceTypes, selectedCategory, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Top Left Dropdown Pill Button & Top Right Add Services */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group relative px-4 py-2.5 rounded-2xl transition-all duration-200 flex items-center gap-3 select-none whitespace-nowrap text-xs sm:text-sm font-semibold border shrink-0 cursor-pointer bg-gradient-to-b from-[#072b22] to-[#041a14] border-[var(--brand-primary)]/90 text-white shadow-[0_0_18px_rgba(0,229,153,0.22)] ring-1 ring-[var(--brand-primary)]/40 hover:border-[var(--brand-primary)]"
          >
            <span className="flex items-center justify-center shrink-0 text-[var(--brand-primary)]">
              {selectedCategory === 'ALL' ? (
                <Briefcase className="w-4 h-4 text-[var(--brand-primary)]" />
              ) : (
                CATEGORY_ICONS[selectedCategory] || <Cpu className="w-4 h-4 text-[var(--brand-primary)]" />
              )}
            </span>

            <span className="text-white font-semibold">
              {selectedCategory === 'ALL' ? 'All Services' : selectedCategory}
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-tight transition-all bg-emerald-950/80 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40 shadow-inner">
              {filteredServices.length}
            </span>

            <ChevronDown
              className={`w-3.5 h-3.5 text-[var(--brand-primary)] transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-[var(--brand-primary)]' : ''
              }`}
            />
          </button>

          {/* Interactive Category Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[var(--bg-table)] border border-[var(--border-table)] shadow-2xl z-50 py-1.5 backdrop-blur-xl divide-y divide-[var(--border-divider)] animate-in fade-in zoom-in-95 duration-150">
              <div className="p-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40 font-semibold'
                      : 'text-slate-200 hover:bg-[var(--bg-surface-hover)] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-[var(--brand-primary)]" />
                    <span>All Services</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedCategory === 'ALL'
                      ? 'bg-[var(--bg-card-inner)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                      : 'bg-[var(--bg-card-inner)] text-slate-300 border border-[var(--border-subtle)]'
                  }`}>
                    {serviceTypes.length}
                  </span>
                </button>
              </div>

              <div className="p-1 space-y-1">
                {CATEGORIES.map((cat) => {
                  const count = serviceTypes.filter((s) => s.category === cat).length;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40 font-semibold'
                          : 'text-slate-200 hover:bg-[var(--bg-surface-hover)] hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="shrink-0">{CATEGORY_ICONS[cat] || <Cpu className="w-3.5 h-3.5" />}</span>
                        <span className="truncate">{cat}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-[var(--bg-card-inner)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                          : 'bg-[var(--bg-card-inner)] text-slate-300 border border-[var(--border-subtle)]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar Card */}
      <Card className="bg-[var(--bg-table)] border border-[var(--border-table)]">
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service types, capabilities, or deliverables..."
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Showing <span className="font-bold text-[var(--brand-primary)]">{filteredServices.length}</span> of {serviceTypes.length} service types
          </span>
        </div>
      </Card>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          const empaneledProviders = serviceProviders.filter(
            (sp) =>
              service.providerIds.includes(sp.id) ||
              sp.category === service.category ||
              sp.services.some((s) => s.toLowerCase().includes(service.name.toLowerCase()))
          );

          return (
            <Card
              key={service.id}
              className="bg-[var(--bg-table)] border border-[var(--border-table)] hover:border-[var(--brand-primary)]/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <CardBody className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                    {CATEGORY_ICONS[service.category] || <Layers className="w-3.5 h-3.5" />}
                    {service.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-[var(--bg-card-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {service.deliveryTime}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors font-heading">
                    {service.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables */}
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
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card className="py-12 text-center text-slate-400 bg-[var(--bg-table)] border border-[var(--border-table)]">
          <p>No services found matching your criteria.</p>
        </Card>
      )}

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
                  {CATEGORY_ICONS[selectedService.category] || <Cpu className="w-3.5 h-3.5" />}
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

            <div className="space-y-2 pt-2 border-t border-[var(--border-divider)]">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                Empaneled Service Providers:
              </span>
              <div className="space-y-2">
                {serviceProviders
                  .filter(
                    (p) =>
                      selectedService.providerIds.includes(p.id) ||
                      p.category === selectedService.category ||
                      p.services.some((s) => s.toLowerCase().includes(selectedService.name.toLowerCase()))
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between hover:border-[var(--brand-primary)]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[var(--brand-primary)] font-bold flex items-center justify-center text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-100 block">{p.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {p.location} • {p.contactPerson}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{p.rating}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedService(null);
                            navigate(`/admin/service-providers/${p.id}`);
                          }}
                          className="text-xs text-[var(--brand-primary)] hover:text-emerald-300"
                        >
                          View Provider →
                        </Button>
                      </div>
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
