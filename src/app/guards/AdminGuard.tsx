import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/hooks/useAuth';
import { ROLES } from '../../shared/constants/roles.constants';
import { ROUTES } from '../../shared/constants/routes.constants';
import { Spinner } from '../../shared/components/ui/Spinner';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06131c] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to={ROUTES.COMMON.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
