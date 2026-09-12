import { Permission } from '../constants/permissions.constants';
import { hasPermission, isAdmin, isCompanyOwner } from '../utils/permissions';
import { UserRole } from '../constants/roles.constants';

export function usePermissions(userRole?: UserRole | null) {
  return {
    can: (permission: Permission) => hasPermission(userRole, permission),
    isAdmin: isAdmin(userRole),
    isCompanyOwner: isCompanyOwner(userRole),
    role: userRole,
  };
}
