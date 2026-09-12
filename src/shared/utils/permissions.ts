import { ROLES, UserRole } from '../constants/roles.constants';
import { Permission, PERMISSIONS } from '../constants/permissions.constants';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.MANAGE_APPLICATIONS,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.MANAGE_LISTINGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_CMS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.COMPANY_OWNER]: [
    PERMISSIONS.COMPANY_OWNER_ACCESS,
    PERMISSIONS.EDIT_MY_COMPANY,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

export function hasPermission(userRole?: UserRole | null, permission?: Permission): boolean {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function isAdmin(userRole?: UserRole | null): boolean {
  return userRole === ROLES.ADMIN;
}

export function isCompanyOwner(userRole?: UserRole | null): boolean {
  return userRole === ROLES.COMPANY_OWNER;
}
