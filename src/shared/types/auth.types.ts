import { UserRole } from '../constants/roles.constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyId?: string;
  companyName?: string;
  phone?: string;
  designation?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}
