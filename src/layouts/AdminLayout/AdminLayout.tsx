import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminGuard } from '../../app/guards/AdminGuard';
import { DashboardLayout } from '../DashboardLayout/DashboardLayout';
import { ADMIN_NAVIGATION } from '../../navigation/admin.navigation';

export const AdminLayout: React.FC = () => {
  return (
    <AdminGuard>
      <DashboardLayout items={ADMIN_NAVIGATION}>
        <Outlet />
      </DashboardLayout>
    </AdminGuard>
  );
};
