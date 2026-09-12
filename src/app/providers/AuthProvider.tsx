import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../../shared/types/auth.types';
import { authApi, MOCK_USERS } from '../../features/authentication/api/auth.api';
import { tokenService } from '../../shared/services/storage/token.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  quickLogin: (role: 'ADMIN' | 'COMPANY_OWNER') => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: 'ADMIN' | 'COMPANY_OWNER') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Default to admin for instant preview or read from token
    const savedToken = tokenService.getToken();
    if (savedToken?.includes('owner')) {
      return MOCK_USERS.companyOwner;
    }
    return MOCK_USERS.admin;
  });
  const [token, setToken] = useState<string | null>(() => tokenService.getToken() || 'mock_jwt_token_admin_project_x_2026');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!tokenService.getToken()) {
      tokenService.setToken('mock_jwt_token_admin_project_x_2026');
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      setToken(res.token);
      tokenService.setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: 'ADMIN' | 'COMPANY_OWNER') => {
    setIsLoading(true);
    try {
      const targetUser = role === 'ADMIN' ? MOCK_USERS.admin : MOCK_USERS.companyOwner;
      const targetToken = role === 'ADMIN' ? 'mock_jwt_token_admin_project_x_2026' : 'mock_jwt_token_company_owner_project_x_2026';
      setUser(targetUser);
      setToken(targetToken);
      tokenService.setToken(targetToken);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (role: 'ADMIN' | 'COMPANY_OWNER') => {
    quickLogin(role);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setToken(null);
      tokenService.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
