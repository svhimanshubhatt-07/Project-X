import { RouteObject, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout/AdminLayout';
import { AdminDashboardPage } from '../../modules/admin/dashboard/AdminDashboardPage';
import { ApplicationsPage } from '../../modules/admin/onboarding-applications/ApplicationsPage';
import { ApplicationDetailsPage } from '../../modules/admin/onboarding-applications/ApplicationDetailsPage';
import { ServiceVerificationPage } from '../../modules/admin/service-verification/ServiceVerificationPage';
import { ServiceDetailsPage } from '../../modules/admin/service-verification/ServiceDetailsPage';
import { CompaniesPage } from '../../modules/admin/companies/CompaniesPage';
import { OnboardCompanyPage } from '../../modules/admin/companies/OnboardCompanyPage';
import { CompanyDetailsPage } from '../../modules/admin/companies/CompanyDetailsPage';
import { EditCompanyPage } from '../../modules/admin/companies/EditCompanyPage';
import { ListingsPage } from '../../modules/admin/listings/ListingsPage';
import { ServiceProvidersPage } from '../../modules/admin/service-providers/ServiceProvidersPage';
import { ServiceProviderDetailsPage } from '../../modules/admin/service-providers/ServiceProviderDetailsPage';
import { AddServicePage } from '../../modules/admin/service-providers/AddServicePage';
import { UsersPage } from '../../modules/admin/users/UsersPage';
import { CreateUserPage } from '../../modules/admin/users/CreateUserPage';
import { UserDetailsPage } from '../../modules/admin/users/UserDetailsPage';
import { DocumentsPage } from '../../modules/admin/documents/DocumentsPage';
import { NotificationsPage } from '../../modules/admin/notifications/NotificationsPage';
import { NotificationTemplatesPage } from '../../modules/admin/notification-templates/NotificationTemplatesPage';
import { ReportsPage } from '../../modules/admin/reports/ReportsPage';
import { AuditLogsPage } from '../../modules/admin/audit-logs/AuditLogsPage';
import { CMSPage } from '../../modules/admin/cms/CMSPage';
import { SettingsPage } from '../../modules/admin/settings/SettingsPage';
import { AdminAccountPage } from '../../modules/admin/account/AdminAccountPage';

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <AdminDashboardPage />,
    },
    {
      path: 'applications',
      element: <ApplicationsPage />,
    },
    {
      path: 'applications/:id',
      element: <ApplicationDetailsPage />,
    },
    {
      path: 'service-verification',
      element: <ServiceVerificationPage />,
    },
    {
      path: 'service-verification/:id',
      element: <ServiceDetailsPage />,
    },
    {
      path: 'services/:id',
      element: <ServiceDetailsPage />,
    },
    {
      path: 'companies',
      element: <CompaniesPage />,
    },
    {
      path: 'companies/onboard',
      element: <OnboardCompanyPage />,
    },
    {
      path: 'companies/:id',
      element: <CompanyDetailsPage />,
    },
    {
      path: 'companies/:id/edit',
      element: <EditCompanyPage />,
    },
    {
      path: 'listings',
      element: <ListingsPage />,
    },
    {
      path: 'service-providers',
      element: <ServiceProvidersPage />,
    },
    {
      path: 'service-providers/:id',
      element: <ServiceProviderDetailsPage />,
    },
    {
      path: 'services/create',
      element: <AddServicePage />,
    },
    {
      path: 'users',
      element: <UsersPage />,
    },
    {
      path: 'users/create',
      element: <CreateUserPage />,
    },
    {
      path: 'users/:id',
      element: <UserDetailsPage />,
    },
    {
      path: 'documents',
      element: <DocumentsPage />,
    },
    {
      path: 'notifications',
      element: <NotificationsPage />,
    },
    {
      path: 'notification-templates',
      element: <NotificationTemplatesPage />,
    },
    {
      path: 'reports',
      element: <ReportsPage />,
    },
    {
      path: 'audit-logs',
      element: <AuditLogsPage />,
    },
    {
      path: 'cms',
      element: <CMSPage />,
    },
    {
      path: 'settings',
      element: <SettingsPage />,
    },
    {
      path: 'account',
      element: <AdminAccountPage />,
    },
  ],
};
