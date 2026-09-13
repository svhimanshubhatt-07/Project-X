import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes.constants';

export const ServiceVerificationPage: React.FC = () => {
  return <Navigate to={ROUTES.ADMIN.APPLICATIONS} replace />;
};

export default ServiceVerificationPage;
