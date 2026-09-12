import React from 'react';
import { Outlet } from 'react-router-dom';
import { CompanyOwnerGuard } from '../../app/guards/CompanyOwnerGuard';
import { DashboardLayout } from '../DashboardLayout/DashboardLayout';
import { COMPANY_OWNER_NAVIGATION } from '../../navigation/company-owner.navigation';

export const CompanyOwnerLayout: React.FC = () => {
  return (
    <CompanyOwnerGuard>
      <DashboardLayout items={COMPANY_OWNER_NAVIGATION}>
        <Outlet />
      </DashboardLayout>
    </CompanyOwnerGuard>
  );
};
