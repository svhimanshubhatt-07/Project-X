import { User, LoginCredentials } from '../../../shared/types/auth.types';
import { ROLES } from '../../../shared/constants/roles.constants';

export const MOCK_USERS: Record<string, User> = {
  admin: {
    id: 'usr_admin_001',
    name: 'Vikramaditya Roy',
    email: 'admin@projectx.io',
    role: ROLES.ADMIN,
    avatarUrl: '',
    designation: 'Principal Platform Administrator',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    createdAt: '2025-01-10T09:00:00.000Z',
  },
  companyOwner: {
    id: 'usr_owner_002',
    name: 'Dr. Sarah Vance',
    email: 'sarah.vance@novasystems.io',
    role: ROLES.COMPANY_OWNER,
    companyId: 'cmp_nova_01',
    companyName: 'Nova Robotics & Aerospace AI',
    designation: 'Co-Founder & CEO',
    phone: '+91 91234 56789',
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    createdAt: '2025-06-15T10:30:00.000Z',
  },
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const email = credentials.email.toLowerCase().trim();

    if (email.includes('admin')) {
      return {
        user: MOCK_USERS.admin,
        token: 'mock_jwt_token_admin_project_x_2026',
      };
    }

    // Default to Company Owner for demo convenience
    return {
      user: MOCK_USERS.companyOwner,
      token: 'mock_jwt_token_company_owner_project_x_2026',
    };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  },

  async getMe(token?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (token && token.includes('admin')) {
      return MOCK_USERS.admin;
    }
    return MOCK_USERS.companyOwner;
  },
};
