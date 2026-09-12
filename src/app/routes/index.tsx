import { RouteObject, Navigate } from 'react-router-dom';
import { authRoutes } from './auth.routes';
import { adminRoutes } from './admin.routes';
import { companyOwnerRoutes } from './company-owner.routes';
import { UnauthorizedPage } from '../../pages/unauthorized/UnauthorizedPage';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { ROUTES } from '../../shared/constants/routes.constants';

export const routes: RouteObject[] = [
  // Root Redirect
  {
    path: '/',
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },

  // Auth Routes
  ...authRoutes,

  // Role Protected Layouts
  adminRoutes,
  companyOwnerRoutes,

  // Common Errors
  {
    path: ROUTES.COMMON.UNAUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: ROUTES.COMMON.NOT_FOUND,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
