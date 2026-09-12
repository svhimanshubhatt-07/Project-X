import { RouteObject } from 'react-router-dom';
import { LoginPage } from '../../pages/auth/login/LoginPage';
import { ForgotPasswordPage } from '../../pages/auth/forgot-password/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/reset-password/ResetPasswordPage';
import { ROUTES } from '../../shared/constants/routes.constants';

export const authRoutes: RouteObject[] = [
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
];
