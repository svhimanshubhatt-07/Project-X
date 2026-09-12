import { OnboardingApplication } from '../../features/onboarding/types/onboarding.types';
import { INITIAL_APPLICATIONS } from '../../features/onboarding/api/onboarding.mock';
import { ApplicationStatus, CompanyStatus, ListingStatus } from '../constants/status.constants';

// Data models
export interface CompanyRecord {
  id: string;
  applicationId?: string;
  name: string;
  legalName: string;
  industry: string;
  companyType: string;
  companySize: string;
  headquarters: string;
  foundedYear: number;
  website: string;
  email: string;
  phone: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'ACTION_REQUIRED';
  companyStatus: CompanyStatus;
  listingStatus: ListingStatus;
  description: string;
  products: string[];
  services: string[];
  technologies: string[];
  joinedDate: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  representativeDesignation: string;
  profileCompletion: number; // percentage
  profileViews: number;
  listingViews: number;
  gstNumber: string;
  cinNumber: string;
  registeredAddress: string;
}

export interface PlatformUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMPANY_OWNER' | 'STAKEHOLDER' | 'REGISTERED_USER' | 'VISITOR' | 'SERVICE_PROVIDER' | string;
  companyId?: string;
  companyName?: string;
  designation?: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  registrationDate: string;
  lastLoginDate: string;
  registrationSource?: 'WEBSITE_SIGNUP' | 'INVITATION' | 'DIRECT_ADMIN';
  companiesViewed?: number;
  interests?: string[];
}

export interface AuditLogRecord {
  id: string;
  user: string;
  role: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  remarks?: string;
}

export interface NotificationRecord {
  id: string;
  recipientRole: 'ADMIN' | 'COMPANY_OWNER' | 'ALL';
  recipientCompanyId?: string;
  type: string;
  title: string;
  message: string;
  sentDate: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationTemplateRecord {
  id: string;
  templateName: string;
  event: string;
  subject: string;
  body: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastUpdated: string;
}

export interface ServiceProviderRecord {
  id: string;
  name: string;
  legalName: string;
  category: string;
  rating: number;
  reviewsCount: number;
  location: string;
  services: string[];
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  contactPerson: string;
  email: string;
  phone: string;
  pricing: string;
  completedProjects: number;
  verified: boolean;
  description: string;
  joinedDate: string;
  website: string;
  logoUrl?: string;
}

export interface CMSSectionRecord {
  id: string;
  page: string;
  section: string;
  title: string;
  subtitle?: string;
  content: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedBy: string;
  lastUpdated: string;
}

// Initial Service Providers
export const INITIAL_SERVICE_PROVIDERS: ServiceProviderRecord[] = [
  {
    id: 'sp_01',
    name: 'Apex Cloud & DevOps Architecture',
    legalName: 'Apex Cloud Solutions Pvt Ltd',
    category: 'Cloud Infrastructure & DevOps',
    rating: 4.9,
    reviewsCount: 42,
    location: 'Bengaluru, Karnataka',
    services: ['AWS & GCP Cloud Migration', 'Kubernetes Deployment', 'Cost Optimization & FinOps', 'CI/CD Automation'],
    status: 'ACTIVE',
    contactPerson: 'Aditya Mathur',
    email: 'contact@apexcloud.io',
    phone: '+91 98450 11223',
    pricing: '₹3,500 - ₹6,000 / hr',
    completedProjects: 87,
    verified: true,
    description: 'Premier enterprise cloud consultancy delivering zero-downtime infrastructure migrations, multi-region Kubernetes clusters, and microservices architecture.',
    joinedDate: '2025-06-12',
    website: 'https://apexcloud.io',
  },
  {
    id: 'sp_02',
    name: 'Veritas Corporate Legal & MCA Compliance',
    legalName: 'Veritas Legal Partners LLP',
    category: 'Legal & Corporate Governance',
    rating: 4.8,
    reviewsCount: 36,
    location: 'Mumbai, Maharashtra',
    services: ['MCA Filings & Secretarial Audit', 'Startup Incorporation & SHA', 'IP & Trademark Registration', 'Regulatory Compliance'],
    status: 'ACTIVE',
    contactPerson: 'Sunita Raman',
    email: 'info@veritaslegal.in',
    phone: '+91 22 4567 8901',
    pricing: '₹4,000 - ₹8,000 / hr',
    completedProjects: 140,
    verified: true,
    description: 'Corporate law firm specialized in DPIIT recognized startups, board resolutions, investor term sheets, and MCA annual compliances.',
    joinedDate: '2025-04-18',
    website: 'https://veritaslegal.in',
  },
  {
    id: 'sp_03',
    name: 'Kreston Global Tax & Statutory Audit',
    legalName: 'Kreston Advisory Services India LLP',
    category: 'Finance, Tax & Audit',
    rating: 4.9,
    reviewsCount: 51,
    location: 'Delhi NCR, India',
    services: ['Statutory & Tax Audit', 'GST & Transfer Pricing', 'Due Diligence & Valuation', 'CFO Advisory Services'],
    status: 'ACTIVE',
    contactPerson: 'Rohan Deshmukh',
    email: 'tax@krestonindia.com',
    phone: '+91 11 2987 6543',
    pricing: '₹5,000 - ₹10,000 / hr',
    completedProjects: 210,
    verified: true,
    description: 'Chartered accountancy and auditing advisory supporting enterprise valuations, international tax treaties, and statutory compliances.',
    joinedDate: '2025-02-10',
    website: 'https://krestonindia.com',
  },
  {
    id: 'sp_04',
    name: 'CipherGuard Cyber Defense & VAPT',
    legalName: 'CipherGuard InfoSec Private Limited',
    category: 'Cybersecurity & Compliance',
    rating: 4.7,
    reviewsCount: 29,
    location: 'Hyderabad, Telangana',
    services: ['SOC2 & ISO 27001 Certification', 'Vulnerability Assessment & Pen Testing', 'Cloud Security Audits', 'Zero Trust Architecture'],
    status: 'ACTIVE',
    contactPerson: 'Karan Mehra',
    email: 'security@cipherguard.co',
    phone: '+91 40 3829 1040',
    pricing: '₹4,500 - ₹7,500 / hr',
    completedProjects: 64,
    verified: true,
    description: 'Cert-In empaneled cybersecurity testing agency delivering thorough penetration tests, automated compliance scanners, and defense audits.',
    joinedDate: '2025-08-05',
    website: 'https://cipherguard.co',
  },
  {
    id: 'sp_05',
    name: 'TensorFlow & GenAI Lab Services',
    legalName: 'NeuralScale Artificial Intelligence Labs',
    category: 'AI & Data Science',
    rating: 4.8,
    reviewsCount: 18,
    location: 'Bengaluru, Karnataka',
    services: ['Custom LLM Fine-Tuning', 'Computer Vision Pipeline Development', 'Predictive Analytics Models', 'Edge AI Acceleration'],
    status: 'ACTIVE',
    contactPerson: 'Dr. Shalini Swaminathan',
    email: 'lab@neuralscale.ai',
    phone: '+91 80 6712 9900',
    pricing: '₹6,000 - ₹12,000 / hr',
    completedProjects: 32,
    verified: true,
    description: 'Specialized deep learning research firm developing state-of-the-art vision and generative AI models for enterprise automation.',
    joinedDate: '2025-09-22',
    website: 'https://neuralscale.ai',
  },
  {
    id: 'sp_06',
    name: 'SwiftRoute 3PL & Supply Logistics',
    legalName: 'SwiftRoute Logistics India Pvt Ltd',
    category: 'Logistics & Supply Chain',
    rating: 4.6,
    reviewsCount: 24,
    location: 'Chennai, Tamil Nadu',
    services: ['Pan-India Express Fulfillment', 'Cold-Chain Warehousing', 'Reverse Logistics & Returns', 'Customs Clearance'],
    status: 'PENDING',
    contactPerson: 'Manoj Kumar',
    email: 'operations@swiftroute.in',
    phone: '+91 44 2819 0044',
    pricing: 'Custom Contract',
    completedProjects: 55,
    verified: false,
    description: 'Tech-enabled end-to-end multi-modal logistics with automated real-time GPS tracking and bonded storage facilities.',
    joinedDate: '2026-02-14',
    website: 'https://swiftroute.in',
  },
];

// Initial Companies
const INITIAL_COMPANIES: CompanyRecord[] = [
  {
    id: 'cmp_nova_01',
    applicationId: 'APP-2026-891',
    name: 'Nova Robotics & Aerospace AI',
    legalName: 'Nova Robotics & Aerospace Systems Private Limited',
    industry: 'Robotics & AI',
    companyType: 'Private Limited Company',
    companySize: '51-200 Employees',
    headquarters: 'Bengaluru, Karnataka, India',
    foundedYear: 2023,
    website: 'https://novasystems.io',
    email: 'contact@novasystems.io',
    phone: '+91 80 4123 9900',
    verificationStatus: 'VERIFIED',
    companyStatus: 'ACTIVE',
    listingStatus: 'ACTIVE',
    description: 'Pioneering autonomous robotic manipulators and spatial computing firmware for precision aerospace manufacturing lines.',
    products: ['NovaCore Spatial OS', 'NovaArm Apex-7', 'AeroGrip End-Effector'],
    services: ['Custom Cleanroom Integration', 'Robotic Fleet Telemetry SLA'],
    technologies: ['ROS2', 'Rust', 'TensorFlow', 'CUDA', 'WebRTC', 'RTOS'],
    joinedDate: '2026-03-04',
    representativeName: 'Dr. Sarah Vance',
    representativeEmail: 'sarah.vance@novasystems.io',
    representativePhone: '+91 91234 56789',
    representativeDesignation: 'Co-Founder & CEO',
    profileCompletion: 92,
    profileViews: 14850,
    listingViews: 8920,
    gstNumber: '29AABCN1234F1Z5',
    cinNumber: 'U72900KA2023PTC174829',
    registeredAddress: 'Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru 560100',
  },
  {
    id: 'cmp_aether_02',
    applicationId: 'APP-2026-892',
    name: 'Aether Cloud HyperScale',
    legalName: 'Aether Cloud Infrastructure Technologies India Limited',
    industry: 'Cloud Infrastructure',
    companyType: 'Public Limited Company',
    companySize: '201-500 Employees',
    headquarters: 'Mumbai, Maharashtra, India',
    foundedYear: 2021,
    website: 'https://aethercloud.tech',
    email: 'enterprise@aethercloud.tech',
    phone: '+91 22 6789 0123',
    verificationStatus: 'PENDING',
    companyStatus: 'PENDING',
    listingStatus: 'INACTIVE',
    description: 'Distributed bare-metal GPU computing cloud for foundation model training and high-throughput inference.',
    products: ['AetherCompute H100 Clusters', 'HyperMesh Storage'],
    services: ['Managed Kubernetes for AI', 'Direct Optical Connect'],
    technologies: ['Kubernetes', 'Ceph', 'NVIDIA NeMo', 'InfiniBand'],
    joinedDate: '2026-03-05',
    representativeName: 'David Chen',
    representativeEmail: 'david.chen@aethercloud.tech',
    representativePhone: '+91 98201 23456',
    representativeDesignation: 'Managing Director & VP APAC',
    profileCompletion: 78,
    profileViews: 6420,
    listingViews: 3100,
    gstNumber: '27AAACA5678B1Z2',
    cinNumber: 'L72200MH2021PLC354890',
    registeredAddress: 'Tower 3, Bandra-Kurla Complex, Bandra East, Mumbai 400051',
  },
  {
    id: 'cmp_zenith_03',
    name: 'Zenith Semiconductor Labs',
    legalName: 'Zenith Microelectronics Private Limited',
    industry: 'Semiconductors & Hardware',
    companyType: 'Private Limited Company',
    companySize: '501-1000 Employees',
    headquarters: 'Noida, Uttar Pradesh, India',
    foundedYear: 2019,
    website: 'https://zenithsemi.io',
    email: 'contact@zenithsemi.io',
    phone: '+91 120 456 7890',
    verificationStatus: 'VERIFIED',
    companyStatus: 'ACTIVE',
    listingStatus: 'ACTIVE',
    description: 'Fabless design center specializing in RISC-V edge accelerators and power management ICs.',
    products: ['Zenith-V Edge Neural Core', 'PowerShield PMIC'],
    services: ['ASIC Turnkey Design', 'Silicon Verification IP'],
    technologies: ['RISC-V', 'SystemVerilog', 'TSMC 7nm/12nm', 'Synopsys EDA'],
    joinedDate: '2025-11-12',
    representativeName: 'Rajesh Nair',
    representativeEmail: 'r.nair@zenithsemi.io',
    representativePhone: '+91 98711 00998',
    representativeDesignation: 'Chief Technology Officer',
    profileCompletion: 96,
    profileViews: 28400,
    listingViews: 17650,
    gstNumber: '09AAACZ1122K1Z9',
    cinNumber: 'U32100UP2019PTC112233',
    registeredAddress: 'Sector 62, Electronic City, Noida 201309',
  },
  {
    id: 'cmp_solaris_04',
    name: 'Solaris CleanGrid Energy',
    legalName: 'Solaris Renewable Grids India Limited',
    industry: 'CleanTech & Energy',
    companyType: 'Public Limited Company',
    companySize: '51-200 Employees',
    headquarters: 'Ahmedabad, Gujarat, India',
    foundedYear: 2020,
    website: 'https://solariscleangrid.com',
    email: 'hello@solariscleangrid.com',
    phone: '+91 79 2656 7890',
    verificationStatus: 'VERIFIED',
    companyStatus: 'ACTIVE',
    listingStatus: 'ACTIVE',
    description: 'Smart micro-inverters and utility-scale battery energy storage system telematics.',
    products: ['GridOptima V3', 'SolarisPowerPack 2MWh'],
    services: ['Virtual Power Plant Management', 'Grid Interconnect Audits'],
    technologies: ['IoT Gateway', 'Elixir', 'TimescaleDB', 'Modbus TCP'],
    joinedDate: '2025-08-20',
    representativeName: 'Meera Patel',
    representativeEmail: 'meera.p@solariscleangrid.com',
    representativePhone: '+91 98250 44332',
    representativeDesignation: 'Executive Director',
    profileCompletion: 88,
    profileViews: 11200,
    listingViews: 7340,
    gstNumber: '24AAACS9988P1Z3',
    cinNumber: 'L40100GJ2020PLC998877',
    registeredAddress: 'SG Highway, Bodakdev, Ahmedabad 380054',
  },
  {
    id: 'cmp_omni_05',
    applicationId: 'APP-2026-895',
    name: 'OmniLogix Autonomous Freight',
    legalName: 'OmniLogix Logistics Private Limited',
    industry: 'Logistics & Supply Chain',
    companyType: 'Private Limited Company',
    companySize: '1-10 Employees',
    headquarters: 'Chennai, Tamil Nadu, India',
    foundedYear: 2024,
    website: 'https://omnilogix.example.com',
    email: 'info@omnilogix.example.com',
    phone: '+91 44 2828 1111',
    verificationStatus: 'REJECTED',
    companyStatus: 'INACTIVE',
    listingStatus: 'INACTIVE',
    description: 'Long-haul freight routing portal.',
    products: ['OmniRoute'],
    services: ['Brokerage'],
    technologies: ['React', 'Node'],
    joinedDate: '2026-02-23',
    representativeName: 'Aarav Sharma',
    representativeEmail: 'aarav@omnilogix.example.com',
    representativePhone: '+91 98400 11223',
    representativeDesignation: 'Director',
    profileCompletion: 45,
    profileViews: 320,
    listingViews: 0,
    gstNumber: '33AAACT9999K1Z0',
    cinNumber: 'U60200TN2024PTC999999',
    registeredAddress: 'Anna Nagar, Chennai 600040',
  }
];

// Initial Users
const INITIAL_USERS: PlatformUserRecord[] = [
  {
    id: 'usr_admin_001',
    name: 'Vikramaditya Roy',
    email: 'admin@projectx.io',
    role: 'ADMIN',
    designation: 'Principal Platform Administrator',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
    registrationDate: '2025-01-10',
    lastLoginDate: '2026-03-09 14:10',
  },
  {
    id: 'usr_owner_002',
    name: 'Dr. Sarah Vance',
    email: 'sarah.vance@novasystems.io',
    role: 'COMPANY_OWNER',
    companyId: 'cmp_nova_01',
    companyName: 'Nova Robotics & Aerospace AI',
    designation: 'Co-Founder & CEO',
    phone: '+91 91234 56789',
    status: 'ACTIVE',
    registrationDate: '2026-03-01',
    lastLoginDate: '2026-03-09 12:45',
  },
  {
    id: 'usr_owner_003',
    name: 'David Chen',
    email: 'david.chen@aethercloud.tech',
    role: 'COMPANY_OWNER',
    companyId: 'cmp_aether_02',
    companyName: 'Aether Cloud HyperScale',
    designation: 'Managing Director & VP APAC',
    phone: '+91 98201 23456',
    status: 'ACTIVE',
    registrationDate: '2026-03-05',
    lastLoginDate: '2026-03-08 17:20',
  },
  {
    id: 'usr_owner_004',
    name: 'Rajesh Nair',
    email: 'r.nair@zenithsemi.io',
    role: 'COMPANY_OWNER',
    companyId: 'cmp_zenith_03',
    companyName: 'Zenith Semiconductor Labs',
    designation: 'Chief Technology Officer',
    phone: '+91 98711 00998',
    status: 'ACTIVE',
    registrationDate: '2025-11-12',
    lastLoginDate: '2026-03-07 10:15',
  },
  {
    id: 'usr_owner_005',
    name: 'Meera Patel',
    email: 'meera.p@solariscleangrid.com',
    role: 'COMPANY_OWNER',
    companyId: 'cmp_solaris_04',
    companyName: 'Solaris CleanGrid Energy',
    designation: 'Executive Director',
    phone: '+91 98250 44332',
    status: 'ACTIVE',
    registrationDate: '2025-08-20',
    lastLoginDate: '2026-03-09 08:30',
  },
  {
    id: 'usr_owner_006',
    name: 'Aarav Sharma',
    email: 'aarav@omnilogix.example.com',
    role: 'COMPANY_OWNER',
    companyId: 'cmp_omni_05',
    companyName: 'OmniLogix Autonomous Freight',
    designation: 'Director',
    phone: '+91 98400 11223',
    status: 'INACTIVE',
    registrationDate: '2026-02-20',
    lastLoginDate: '2026-02-23 16:00',
  },
  {
    id: 'usr_stakeholder_007',
    name: 'Ananya Singhania',
    email: 'ananya.s@elevationvc.com',
    role: 'STAKEHOLDER',
    companyId: 'cmp_nova_01',
    companyName: 'Nova Robotics & Aerospace AI',
    designation: 'Lead Series A Investor & Board Observer',
    phone: '+91 98111 22334',
    status: 'ACTIVE',
    registrationDate: '2026-01-15',
    lastLoginDate: '2026-03-08 19:40',
  },
  {
    id: 'usr_stakeholder_008',
    name: 'Kavita Menon',
    email: 'k.menon@venturepartners.in',
    role: 'STAKEHOLDER',
    companyId: 'cmp_zenith_03',
    companyName: 'Zenith Semiconductor Labs',
    designation: 'Institutional Board Director',
    phone: '+91 98222 33445',
    status: 'ACTIVE',
    registrationDate: '2025-10-05',
    lastLoginDate: '2026-03-07 14:15',
  },
  // Normal Registered Website Users (Email & Password Signups)
  {
    id: 'usr_reg_009',
    name: 'Rohan Gupta',
    email: 'rohan.gupta92@gmail.com',
    role: 'REGISTERED_USER',
    designation: 'Founder / Entrepreneur',
    phone: '+91 98190 23411',
    status: 'ACTIVE',
    registrationDate: '2026-03-08',
    lastLoginDate: '2026-03-10 11:20',
    registrationSource: 'WEBSITE_SIGNUP',
  },
  {
    id: 'usr_reg_010',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@outlook.com',
    role: 'REGISTERED_USER',
    designation: 'Managing Partner',
    phone: '+91 97400 55667',
    status: 'ACTIVE',
    registrationDate: '2026-03-06',
    lastLoginDate: '2026-03-09 16:45',
    registrationSource: 'WEBSITE_SIGNUP',
  },
  {
    id: 'usr_reg_011',
    name: 'Amit Verma',
    email: 'amit.verma@techinnovations.in',
    role: 'REGISTERED_USER',
    designation: 'Director & Product Lead',
    phone: '+91 98234 11229',
    status: 'ACTIVE',
    registrationDate: '2026-03-04',
    lastLoginDate: '2026-03-09 09:30',
    registrationSource: 'WEBSITE_SIGNUP',
  },
  {
    id: 'usr_reg_012',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@gmail.com',
    role: 'REGISTERED_USER',
    designation: 'Startup Founder',
    phone: '+91 99300 88776',
    status: 'ACTIVE',
    registrationDate: '2026-03-02',
    lastLoginDate: '2026-03-08 18:10',
    registrationSource: 'WEBSITE_SIGNUP',
  },
  {
    id: 'usr_reg_013',
    name: 'Karthik Raman',
    email: 'karthik.raman@protonmail.com',
    role: 'REGISTERED_USER',
    designation: 'Co-Founder',
    phone: '+91 94440 33211',
    status: 'ACTIVE',
    registrationDate: '2026-02-28',
    lastLoginDate: '2026-03-07 20:05',
    registrationSource: 'WEBSITE_SIGNUP',
  },
  {
    id: 'usr_reg_014',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@innovatehub.co',
    role: 'REGISTERED_USER',
    designation: 'Managing Director',
    phone: '+91 98110 44556',
    status: 'ACTIVE',
    registrationDate: '2026-02-25',
    lastLoginDate: '2026-03-06 14:00',
    registrationSource: 'WEBSITE_SIGNUP',
  },
  // Dedicated Normal Website Visitors (Browsing Company Details)
  {
    id: 'usr_vis_015',
    name: 'Rahul Mehra',
    email: 'rahul.mehra88@gmail.com',
    role: 'VISITOR',
    designation: 'Prospective Client / Explorer',
    companyName: 'Exploring AI & Robotics Vendors',
    phone: '+91 98199 77881',
    status: 'ACTIVE',
    registrationDate: '2026-03-09',
    lastLoginDate: '2026-03-10 15:30',
    registrationSource: 'WEBSITE_SIGNUP',
    companiesViewed: 18,
    interests: ['Robotics & AI', 'Cloud Infrastructure'],
  },
  {
    id: 'usr_vis_016',
    name: 'Deepa Natarajan',
    email: 'deepa.natarajan@outlook.com',
    role: 'VISITOR',
    designation: 'Procurement Specialist',
    companyName: 'Evaluating CleanTech Solutions',
    phone: '+91 97411 22334',
    status: 'ACTIVE',
    registrationDate: '2026-03-08',
    lastLoginDate: '2026-03-10 12:10',
    registrationSource: 'WEBSITE_SIGNUP',
    companiesViewed: 26,
    interests: ['CleanTech & Energy', 'Food Tech'],
  },
  {
    id: 'usr_vis_017',
    name: 'Vikrant Joshi',
    email: 'vikrant.joshi@rediffmail.com',
    role: 'VISITOR',
    designation: 'Supply Chain Consultant',
    companyName: 'Reviewing Logistics Startups',
    phone: '+91 98200 66554',
    status: 'ACTIVE',
    registrationDate: '2026-03-05',
    lastLoginDate: '2026-03-09 18:40',
    registrationSource: 'WEBSITE_SIGNUP',
    companiesViewed: 14,
    interests: ['Logistics & Supply Chain', 'SaaS'],
  },
  {
    id: 'usr_vis_018',
    name: 'Anjali Deshmukh',
    email: 'anjali.d@gmail.com',
    role: 'VISITOR',
    designation: 'Industry Analyst',
    companyName: 'Researching Verified Startups',
    phone: '+91 99200 33441',
    status: 'ACTIVE',
    registrationDate: '2026-03-04',
    lastLoginDate: '2026-03-08 17:25',
    registrationSource: 'WEBSITE_SIGNUP',
    companiesViewed: 35,
    interests: ['Fintech & Banking', 'Health Tech'],
  },
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'LOG-8842',
    user: 'Vikramaditya Roy',
    role: 'ADMIN',
    module: 'Onboarding Applications',
    action: 'APPROVE_APPLICATION',
    entityType: 'Application',
    entityId: 'APP-2026-891',
    previousValue: 'Status: UNDER_REVIEW',
    newValue: 'Status: APPROVED (Company Owner Portal Provisioned)',
    timestamp: '2026-03-04 14:20:12',
    ipAddress: '103.24.12.89',
    device: 'macOS Chrome 122.0',
    remarks: 'Verified incorporation docs, GST clearance, and direct founder identity.',
  },
  {
    id: 'LOG-8841',
    user: 'Dr. Sarah Vance',
    role: 'COMPANY_OWNER',
    module: 'My Company',
    action: 'UPDATE_COMPANY_PROFILE',
    entityType: 'Company',
    entityId: 'cmp_nova_01',
    previousValue: 'Founded: 2023, Locations: 2',
    newValue: 'Founded: 2023, Locations: 3 (Added Munich branch)',
    timestamp: '2026-03-05 16:40:00',
    ipAddress: '49.207.201.14',
    device: 'Windows 11 Edge 122.0',
  },
  {
    id: 'LOG-8840',
    user: 'Vikramaditya Roy',
    role: 'ADMIN',
    module: 'Onboarding Applications',
    action: 'REQUEST_MORE_INFORMATION',
    entityType: 'Application',
    entityId: 'APP-2026-893',
    previousValue: 'Status: UNDER_REVIEW',
    newValue: 'Status: MORE_INFORMATION_REQUIRED',
    timestamp: '2026-03-08 11:00:23',
    ipAddress: '103.24.12.89',
    device: 'macOS Chrome 122.0',
    remarks: 'Requested updated RBI Sandbox Annexure B documentation.',
  },
  {
    id: 'LOG-8839',
    user: 'Vikramaditya Roy',
    role: 'ADMIN',
    module: 'Listings',
    action: 'ACTIVATE_LISTING',
    entityType: 'Listing',
    entityId: 'LST-001 (Nova Robotics)',
    previousValue: 'Status: INACTIVE',
    newValue: 'Status: ACTIVE',
    timestamp: '2026-03-04 14:25:00',
    ipAddress: '103.24.12.89',
    device: 'macOS Chrome 122.0',
  },
  {
    id: 'LOG-8838',
    user: 'Vikramaditya Roy',
    role: 'ADMIN',
    module: 'CMS',
    action: 'UPDATE_HOMEPAGE_HERO',
    entityType: 'CMS Section',
    entityId: 'cms_hero_01',
    previousValue: 'Title: Find Top Enterprises',
    newValue: 'Title: Discover the Future of Technology Enterprises',
    timestamp: '2026-03-02 09:15:30',
    ipAddress: '103.24.12.89',
    device: 'macOS Chrome 122.0',
  }
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'NOTIF-01',
    recipientRole: 'ADMIN',
    type: 'APPLICATION_SUBMITTED',
    title: 'New Application Submitted: BioVance Therapeutics',
    message: 'Dr. Marcus Sterling submitted a new onboarding application for BioVance Therapeutics LLP.',
    sentDate: '2026-03-08 16:00',
    isRead: false,
    actionUrl: '/admin/applications/APP-2026-894',
  },
  {
    id: 'NOTIF-02',
    recipientRole: 'ADMIN',
    type: 'APPLICATION_RESUBMITTED',
    title: 'Application Updated: Quantum FinTech Labs',
    message: 'Pooja Verma uploaded additional requested regulatory documents.',
    sentDate: '2026-03-08 14:22',
    isRead: false,
    actionUrl: '/admin/applications/APP-2026-893',
  },
  {
    id: 'NOTIF-03',
    recipientRole: 'COMPANY_OWNER',
    recipientCompanyId: 'cmp_nova_01',
    type: 'APPLICATION_APPROVED',
    title: 'Congratulations! Your Company Onboarding is Approved',
    message: 'Nova Robotics & Aerospace AI has been verified by the Project X Admin team. Your company listing is now live.',
    sentDate: '2026-03-04 14:20',
    isRead: false,
    actionUrl: '/company/my-company',
  },
  {
    id: 'NOTIF-04',
    recipientRole: 'COMPANY_OWNER',
    recipientCompanyId: 'cmp_nova_01',
    type: 'LISTING_ACTIVATED',
    title: 'Listing Visibility Activated',
    message: 'Your company profile reached 1,200 new discovery impressions in the aerospace robotics category this week.',
    sentDate: '2026-03-06 09:00',
    isRead: true,
    actionUrl: '/company/analytics',
  }
];

// Notification Templates
const INITIAL_TEMPLATES: NotificationTemplateRecord[] = [
  {
    id: 'TMPL-01',
    templateName: 'Application Received Confirmation',
    event: 'APPLICATION_SUBMITTED',
    subject: 'Project X: Application Received for {{company_name}} (ID: {{application_id}})',
    body: 'Dear {{applicant_name}},\n\nThank you for submitting your onboarding application for {{company_name}}. Our verification team is reviewing your company credentials.\n\nBest regards,\nProject X Verification Team',
    status: 'ACTIVE',
    lastUpdated: '2026-02-15',
  },
  {
    id: 'TMPL-02',
    templateName: 'More Information Requested',
    event: 'MORE_INFORMATION_REQUIRED',
    subject: 'Action Required: Additional Information for {{company_name}}',
    body: 'Dear {{applicant_name}},\n\nDuring our review of your application {{application_id}}, we identified items requiring clarification:\n\n{{reviewer_remarks}}\n\nPlease log in to update and resubmit your details.\n\nProject X Review Board',
    status: 'ACTIVE',
    lastUpdated: '2026-02-18',
  },
  {
    id: 'TMPL-03',
    templateName: 'Company Approval & Dashboard Provisioning',
    event: 'APPLICATION_APPROVED',
    subject: 'Welcome to Project X! {{company_name}} is officially approved',
    body: 'Dear {{applicant_name}},\n\nCongratulations! Your application has been approved. Your verified company presence is active, and your Company Owner Dashboard is now unlocked.\n\nLog in: {{dashboard_url}}\n\nProject X Team',
    status: 'ACTIVE',
    lastUpdated: '2026-03-01',
  },
  {
    id: 'TMPL-04',
    templateName: 'Application Rejection Notice',
    event: 'APPLICATION_REJECTED',
    subject: 'Update regarding your application for {{company_name}}',
    body: 'Dear {{applicant_name}},\n\nFollowing our review of {{application_id}}, we regret to inform you that your application could not be approved at this time.\n\nReason: {{rejection_reason}}\n\nProject X Compliance',
    status: 'ACTIVE',
    lastUpdated: '2026-02-10',
  }
];


// CMS Sections
const INITIAL_CMS_SECTIONS: CMSSectionRecord[] = [
  {
    id: 'cms-sec-01',
    page: 'Homepage',
    section: 'Hero Banner',
    title: 'Discover & Verify High-Growth Technology Enterprises',
    subtitle: 'The premier verified discovery network for startups, established deeptech leaders, and enterprise partners.',
    content: 'Connect with verified companies backed by transparent regulatory compliance, audited financials, and authenticated technology stacks.',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-03-02',
  },
  {
    id: 'cms-sec-02',
    page: 'Homepage',
    section: 'Platform Highlights',
    title: 'Instant MCA & Compliance Verification',
    subtitle: 'Fast-track corporate onboarding with automated compliance checks.',
    content: 'Eliminate manual paperwork with direct government registry cross-checks and verified credentials.',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-03-01',
  },
  {
    id: 'cms-sec-03',
    page: 'About Us',
    section: 'Company Mission',
    title: 'Empowering Transparent Enterprise Commerce',
    subtitle: 'Bridging the trust gap between emerging tech providers and corporate enterprise buyers.',
    content: 'Project X provides an authoritative ecosystem where organizations verify their credentials, showcase innovations, and engage in high-value procurement.',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-02-28',
  },
  {
    id: 'cms-sec-04',
    page: 'Verification Guide',
    section: 'Verification SLA',
    title: 'Our 3-Stage Verification Process',
    subtitle: 'Step-by-step guidance on how compliance reviewers inspect corporate credentials.',
    content: '1. Identity Verification\n2. Financial & Legal Checks\n3. Final Compliance Clearance',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-02-20',
  },
  {
    id: 'cms-sec-05',
    page: 'Terms of Service',
    section: 'Enterprise Agreement',
    title: 'Project X Platform Terms & Regulatory Guidelines',
    subtitle: 'Terms governing membership, verified profiles, and directory access.',
    content: 'All verified companies agree to maintain accurate financial and statutory disclosures.',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-01-15',
  },
  {
    id: 'cms-sec-06',
    page: 'Contact Us',
    section: 'Support Directory',
    title: 'Reach Our Enterprise Verification Specialists',
    subtitle: 'Direct channels for corporate onboarding and compliance escalation.',
    content: 'Email: support@projectx.io\nHelpline: +91 80 4000 8800\nAddress: Indiranagar, Bengaluru 560038',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-01-10',
  },
  {
    id: 'cms-sec-07',
    page: 'Privacy Policy',
    section: 'Data Protection',
    title: 'Enterprise Data Security & Privacy Policy',
    subtitle: 'How Project X safeguards legal corporate documents and proprietary business information.',
    content: 'All uploaded legal documents are stored with end-to-end encryption and accessed strictly by certified reviewers.',
    status: 'PUBLISHED',
    updatedBy: 'Vikramaditya Roy',
    lastUpdated: '2026-01-05',
  }
];

class MockDataStore {
  private applications: OnboardingApplication[] = INITIAL_APPLICATIONS;
  private companies: CompanyRecord[] = INITIAL_COMPANIES;
  private serviceProviders: ServiceProviderRecord[] = INITIAL_SERVICE_PROVIDERS;
  private users: PlatformUserRecord[] = INITIAL_USERS;
  private auditLogs: AuditLogRecord[] = INITIAL_AUDIT_LOGS;
  private notifications: NotificationRecord[] = INITIAL_NOTIFICATIONS;
  private templates: NotificationTemplateRecord[] = INITIAL_TEMPLATES;

  private cmsSections: CMSSectionRecord[] = INITIAL_CMS_SECTIONS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load from localStorage if present
    try {
      const savedApps = localStorage.getItem('px_applications');
      if (savedApps) this.applications = JSON.parse(savedApps);

      const savedCmps = localStorage.getItem('px_companies');
      if (savedCmps) this.companies = JSON.parse(savedCmps);
    } catch (e) { }
  }

  private notify() {
    try {
      localStorage.setItem('px_applications', JSON.stringify(this.applications));
      localStorage.setItem('px_companies', JSON.stringify(this.companies));
    } catch (e) { }
    this.listeners.forEach((cb) => cb());
  }

  subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  // Applications
  getApplications(): OnboardingApplication[] {
    return [...this.applications];
  }

  getApplicationById(id: string): OnboardingApplication | undefined {
    return this.applications.find((a) => a.id === id);
  }

  approveApplication(id: string, notes?: string): boolean {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return false;

    app.status = 'APPROVED';
    app.lastUpdated = new Date().toISOString();

    if (notes) {
      app.internalNotes.push({
        id: `NOTE_${Date.now()}`,
        author: 'Vikramaditya Roy',
        authorRole: 'Admin',
        note: notes,
        timestamp: new Date().toISOString(),
      });
    }

    app.timeline.push({
      id: `TL_${Date.now()}`,
      status: 'APPROVED',
      title: 'Application Approved',
      description: 'Admin verified and approved application. Company profile listing activated.',
      timestamp: new Date().toISOString(),
      actor: 'Vikramaditya Roy (Admin)',
      remarks: notes,
    });

    // Also activate or add to companies list
    let comp = this.companies.find((c) => c.applicationId === id || c.name === app.companyName);
    if (comp) {
      comp.verificationStatus = 'VERIFIED';
      comp.companyStatus = 'ACTIVE';
      comp.listingStatus = 'ACTIVE';
    } else {
      this.companies.push({
        id: `cmp_${Date.now()}`,
        applicationId: app.id,
        name: app.companyName,
        legalName: app.legalInfo.legalName,
        industry: app.industry,
        companyType: app.companyType,
        companySize: app.companyInfo.companySize,
        headquarters: app.companyInfo.headquarters,
        foundedYear: app.companyInfo.foundedYear,
        website: app.companyInfo.website,
        email: app.companyInfo.businessEmail,
        phone: app.companyInfo.businessPhone,
        verificationStatus: 'VERIFIED',
        companyStatus: 'ACTIVE',
        listingStatus: 'ACTIVE',
        description: app.companyInfo.description,
        products: app.businessInfo.products,
        services: app.businessInfo.services,
        technologies: app.businessInfo.technologies,
        joinedDate: new Date().toISOString().split('T')[0],
        representativeName: app.representative.fullName,
        representativeEmail: app.representative.email,
        representativePhone: app.representative.phone,
        representativeDesignation: app.representative.designation,
        profileCompletion: 90,
        profileViews: 120,
        listingViews: 45,
        gstNumber: app.gstInfo.gstNumber,
        cinNumber: app.gstInfo.cinNumber,
        registeredAddress: app.legalInfo.registeredAddress,
      });
    }

    // Add audit log
    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Onboarding Applications',
      action: 'APPROVE_APPLICATION',
      entityType: 'Application',
      entityId: id,
      previousValue: 'Status: UNDER_REVIEW',
      newValue: 'Status: APPROVED',
      remarks: notes || 'Approved application and provisioned Company Owner clearance.',
    });

    // Add notification
    this.notifications.unshift({
      id: `NOTIF_${Date.now()}`,
      recipientRole: 'COMPANY_OWNER',
      type: 'APPLICATION_APPROVED',
      title: `Onboarding Approved: ${app.companyName}`,
      message: `Your company ${app.companyName} has been approved. Your listing is now active on Project X.`,
      sentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
    });

    this.notify();
    return true;
  }

  rejectApplication(id: string, reason: string): boolean {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return false;

    app.status = 'REJECTED';
    app.lastUpdated = new Date().toISOString();

    app.timeline.push({
      id: `TL_${Date.now()}`,
      status: 'REJECTED',
      title: 'Application Rejected',
      description: `Application rejected by Admin. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      actor: 'Vikramaditya Roy (Admin)',
      remarks: reason,
    });

    app.internalNotes.push({
      id: `NOTE_${Date.now()}`,
      author: 'Vikramaditya Roy',
      authorRole: 'Admin',
      note: `Rejection Reason: ${reason}`,
      timestamp: new Date().toISOString(),
    });

    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Onboarding Applications',
      action: 'REJECT_APPLICATION',
      entityType: 'Application',
      entityId: id,
      previousValue: 'Status: UNDER_REVIEW',
      newValue: 'Status: REJECTED',
      remarks: reason,
    });

    this.notify();
    return true;
  }

  requestMoreInfo(id: string, message: string, requiredItems: string[]): boolean {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return false;

    app.status = 'MORE_INFORMATION_REQUIRED';
    app.lastUpdated = new Date().toISOString();

    app.timeline.push({
      id: `TL_${Date.now()}`,
      status: 'MORE_INFORMATION_REQUIRED',
      title: 'More Information Requested',
      description: message,
      timestamp: new Date().toISOString(),
      actor: 'Vikramaditya Roy (Admin)',
      remarks: requiredItems.join(', '),
    });

    app.internalNotes.push({
      id: `NOTE_${Date.now()}`,
      author: 'Vikramaditya Roy',
      authorRole: 'Admin',
      note: `Requested Info: ${message}. Items: ${requiredItems.join(', ')}`,
      timestamp: new Date().toISOString(),
    });

    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Onboarding Applications',
      action: 'REQUEST_MORE_INFORMATION',
      entityType: 'Application',
      entityId: id,
      previousValue: 'Status: UNDER_REVIEW',
      newValue: 'Status: MORE_INFORMATION_REQUIRED',
      remarks: message,
    });

    this.notify();
    return true;
  }

  addInternalNote(applicationId: string, note: string): boolean {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return false;

    app.internalNotes.unshift({
      id: `NOTE_${Date.now()}`,
      author: 'Vikramaditya Roy',
      authorRole: 'Admin',
      note,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return true;
  }

  // Companies
  getCompanies(): CompanyRecord[] {
    return [...this.companies];
  }

  getCompanyById(id: string): CompanyRecord | undefined {
    return this.companies.find((c) => c.id === id);
  }

  addCompany(company: Partial<CompanyRecord>): CompanyRecord {
    const ensureStr = (val: unknown, fallback: string): string =>
      typeof val === 'string' && val.trim() ? val : fallback;

    const newCompany: CompanyRecord = {
      id: ensureStr(company.id, `comp_${Date.now()}`),
      name: ensureStr(company.name, 'New Company'),
      legalName: ensureStr(company.legalName, ensureStr(company.name, 'New Company Pvt Ltd')),
      industry: ensureStr(company.industry, 'Tech'),
      companyType: ensureStr(company.companyType, 'Startup'),
      companySize: ensureStr(company.companySize, '11-50 Employees'),
      headquarters: ensureStr(company.headquarters, 'Bengaluru, Karnataka'),
      foundedYear: typeof company.foundedYear === 'number' && !isNaN(company.foundedYear) ? company.foundedYear : new Date().getFullYear(),
      website: ensureStr(company.website, 'https://'),
      email: ensureStr(company.email, 'contact@company.com'),
      phone: ensureStr(company.phone, '+91 98765 43210'),
      verificationStatus: (company.verificationStatus as any) || 'VERIFIED',
      companyStatus: (company.companyStatus as any) || 'ACTIVE',
      listingStatus: (company.listingStatus as any) || 'PUBLISHED',
      description: ensureStr(company.description, 'Enterprise company registered on ProjectX.'),
      products: Array.isArray(company.products) ? company.products : [],
      services: Array.isArray(company.services) ? company.services : [],
      technologies: Array.isArray(company.technologies) ? company.technologies : [],
      joinedDate: ensureStr(company.joinedDate, new Date().toISOString().split('T')[0]),
      representativeName: ensureStr(company.representativeName, 'Admin Authorized'),
      representativeEmail: ensureStr(company.representativeEmail, ensureStr(company.email, 'admin@company.com')),
      representativePhone: ensureStr(company.representativePhone, ensureStr(company.phone, '+91 98765 43210')),
      representativeDesignation: ensureStr(company.representativeDesignation, 'Director / Founder'),
      profileCompletion: typeof company.profileCompletion === 'number' ? company.profileCompletion : 100,
      profileViews: typeof company.profileViews === 'number' ? company.profileViews : 0,
      listingViews: typeof company.listingViews === 'number' ? company.listingViews : 0,
      gstNumber: ensureStr(company.gstNumber, '29AABCS1429B1ZB'),
      cinNumber: ensureStr(company.cinNumber, 'U72200KA2023PTC174829'),
      registeredAddress: ensureStr(company.registeredAddress, 'Tech Park, Bengaluru'),
    };

    this.companies.unshift(newCompany);

    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Companies',
      action: 'ONBOARD_COMPANY',
      entityType: 'Company',
      entityId: newCompany.id,
      newValue: `Onboarded ${newCompany.name}`,
    });

    this.notify();
    return newCompany;
  }

  updateCompany(id: string, updates: Partial<CompanyRecord>): boolean {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    this.companies[idx] = { ...this.companies[idx], ...updates };

    this.addAuditLog({
      user: 'User / Owner',
      role: 'COMPANY_OWNER',
      module: 'Companies',
      action: 'UPDATE_COMPANY',
      entityType: 'Company',
      entityId: id,
      newValue: JSON.stringify(updates),
    });

    this.notify();
    return true;
  }

  setCompanyStatus(id: string, status: CompanyStatus): boolean {
    const comp = this.companies.find((c) => c.id === id);
    if (!comp) return false;

    const prev = comp.companyStatus;
    comp.companyStatus = status;

    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Companies',
      action: 'SET_COMPANY_STATUS',
      entityType: 'Company',
      entityId: id,
      previousValue: `Status: ${prev}`,
      newValue: `Status: ${status}`,
    });

    this.notify();
    return true;
  }

  setListingStatus(id: string, status: ListingStatus): boolean {
    const comp = this.companies.find((c) => c.id === id);
    if (!comp) return false;

    const prev = comp.listingStatus;
    comp.listingStatus = status;

    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Listings',
      action: 'SET_LISTING_STATUS',
      entityType: 'Listing',
      entityId: id,
      previousValue: `Status: ${prev}`,
      newValue: `Status: ${status}`,
    });

    this.notify();
    return true;
  }

  // Service Providers
  getServiceProviders(): ServiceProviderRecord[] {
    return [...this.serviceProviders];
  }

  getServiceProviderById(id: string): ServiceProviderRecord | undefined {
    return this.serviceProviders.find((sp) => sp.id === id);
  }

  addServiceProvider(sp: Omit<ServiceProviderRecord, 'id' | 'joinedDate'>): void {
    const newSp: ServiceProviderRecord = {
      id: `sp_0${this.serviceProviders.length + 1}`,
      joinedDate: new Date().toISOString().split('T')[0],
      ...sp,
    };
    this.serviceProviders.unshift(newSp);
    this.notify();
  }

  updateServiceProvider(id: string, updates: Partial<ServiceProviderRecord>): boolean {
    const idx = this.serviceProviders.findIndex((sp) => sp.id === id);
    if (idx === -1) return false;
    this.serviceProviders[idx] = { ...this.serviceProviders[idx], ...updates };
    this.notify();
    return true;
  }

  setServiceProviderStatus(id: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'): boolean {
    const sp = this.serviceProviders.find((s) => s.id === id);
    if (!sp) return false;
    sp.status = status;
    this.notify();
    return true;
  }

  // Users
  getUsers(): PlatformUserRecord[] {
    return [...this.users];
  }

  addUser(user: Omit<PlatformUserRecord, 'id' | 'registrationDate' | 'lastLoginDate'>): PlatformUserRecord {
    const newUser: PlatformUserRecord = {
      id: `usr_${Date.now()}`,
      registrationDate: new Date().toISOString().split('T')[0],
      lastLoginDate: 'Just now',
      ...user,
    };
    this.users.unshift(newUser);
    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Users',
      action: 'CREATE_USER',
      entityType: 'User',
      entityId: newUser.id,
      newValue: `Created user account for ${newUser.name} (${newUser.role})`,
    });
    this.notify();
    return newUser;
  }

  setUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'): boolean {
    const user = this.users.find((u) => u.id === id);
    if (!user) return false;

    const prev = user.status;
    user.status = status;

    this.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Users',
      action: 'SET_USER_STATUS',
      entityType: 'User',
      entityId: id,
      previousValue: `Status: ${prev}`,
      newValue: `Status: ${status}`,
    });

    this.notify();
    return true;
  }

  // Audit Logs
  getAuditLogs(): AuditLogRecord[] {
    return [...this.auditLogs];
  }

  addAuditLog(data: Omit<AuditLogRecord, 'id' | 'timestamp' | 'ipAddress' | 'device'> & { ipAddress?: string; device?: string }): void {
    const newLog: AuditLogRecord = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: data.ipAddress || '103.24.12.89',
      device: data.device || 'Windows 11 Chrome 122.0',
      ...data,
    };
    this.auditLogs.unshift(newLog);
  }

  // Notifications
  getNotifications(): NotificationRecord[] {
    return [...this.notifications];
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.notify();
    }
  }

  // Notification Templates
  getTemplates(): NotificationTemplateRecord[] {
    return [...this.templates];
  }

  updateTemplate(id: string, updates: Partial<NotificationTemplateRecord>): boolean {
    const idx = this.templates.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.templates[idx] = { ...this.templates[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
    this.notify();
    return true;
  }

  addTemplate(template: Omit<NotificationTemplateRecord, 'id' | 'lastUpdated'>): void {
    this.templates.push({
      id: `TMPL-0${this.templates.length + 1}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      ...template,
    });
    this.notify();
  }


  // CMS
  getCMSSections(): CMSSectionRecord[] {
    return [...this.cmsSections];
  }

  updateCMSSection(id: string, updates: Partial<CMSSectionRecord>): boolean {
    const idx = this.cmsSections.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.cmsSections[idx] = { ...this.cmsSections[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
    this.notify();
    return true;
  }
}

export const mockDataStore = new MockDataStore();
