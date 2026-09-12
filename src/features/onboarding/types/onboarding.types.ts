import { ApplicationStatus } from '../../../shared/constants/status.constants';

export interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'ACTION_REQUIRED';
  fileSize: number;
  url?: string;
  comment?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  authorRole: string;
  note: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  remarks?: string;
}

export interface OnboardingApplication {
  id: string;
  companyName: string;
  applicantName: string;
  companyType: string;
  industry: string;
  businessCategory: string;
  submissionDate: string;
  status: ApplicationStatus;
  lastUpdated: string;
  logoUrl?: string;

  // Detailed sections
  companyInfo: {
    description: string;
    foundedYear: number;
    companySize: string;
    website: string;
    businessEmail: string;
    businessPhone: string;
    headquarters: string;
    locations: string[];
  };

  businessInfo: {
    businessModel: string;
    products: string[];
    services: string[];
    technologies: string[];
    targetMarket: string;
    businessDescription: string;
  };

  legalInfo: {
    legalName: string;
    registrationType: string;
    registrationNumber: string;
    incorporationDate: string;
    registeredAddress: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };

  gstInfo: {
    gstNumber: string;
    cinNumber: string;
    panNumber: string;
    isVerified: boolean;
  };

  representative: {
    fullName: string;
    designation: string;
    email: string;
    phone: string;
    relationship: string;
  };

  documents: CompanyDocument[];
  internalNotes: InternalNote[];
  timeline: TimelineEvent[];
}
