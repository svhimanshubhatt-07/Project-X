export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  MORE_INFORMATION_REQUIRED: 'MORE_INFORMATION_REQUIRED',
  RESUBMITTED: 'RESUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ApplicationStatus = keyof typeof APPLICATION_STATUS;

export const COMPANY_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
} as const;

export type CompanyStatus = keyof typeof COMPANY_STATUS;

export const LISTING_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ListingStatus = keyof typeof LISTING_STATUS;

export const VERIFICATION_STATUS = {
  VERIFIED: 'VERIFIED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  ACTION_REQUIRED: 'ACTION_REQUIRED',
} as const;

export type VerificationStatus = keyof typeof VERIFICATION_STATUS;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatus = keyof typeof USER_STATUS;
