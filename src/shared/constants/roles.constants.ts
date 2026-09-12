export const ROLES = {
  ADMIN: 'ADMIN',
  COMPANY_OWNER: 'COMPANY_OWNER',
} as const;

export type UserRole = keyof typeof ROLES;
