export const PERMISSIONS = {
  ADMIN_ACCESS: 'admin:access',
  COMPANY_OWNER_ACCESS: 'company_owner:access',
  MANAGE_APPLICATIONS: 'applications:manage',
  MANAGE_COMPANIES: 'companies:manage',
  MANAGE_LISTINGS: 'listings:manage',
  MANAGE_USERS: 'users:manage',
  MANAGE_DOCUMENTS: 'documents:manage',
  MANAGE_CMS: 'cms:manage',
  MANAGE_SETTINGS: 'settings:manage',
  VIEW_AUDIT_LOGS: 'audit_logs:view',
  EDIT_MY_COMPANY: 'my_company:edit',
  VIEW_ANALYTICS: 'analytics:view',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
