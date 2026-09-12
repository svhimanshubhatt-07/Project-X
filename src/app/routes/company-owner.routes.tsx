import { RouteObject, Navigate } from 'react-router-dom';
import { CompanyOwnerLayout } from '../../layouts/CompanyOwnerLayout/CompanyOwnerLayout';
import { CompanyOwnerDashboardPage } from '../../modules/company-owner/dashboard/CompanyOwnerDashboardPage';
import { CompanyProfilePage } from '../../modules/company-owner/my-company/CompanyProfilePage';
import { EditCompanyPage } from '../../modules/company-owner/my-company/EditCompanyPage';
import { MyServicesPage } from '../../modules/company-owner/my-services/MyServicesPage';
import { CompanyAddServicePage } from '../../modules/company-owner/my-services/CompanyAddServicePage';
import { CompanyServiceDetailsPage } from '../../modules/company-owner/my-services/CompanyServiceDetailsPage';
import { ListingOverviewPage } from '../../modules/company-owner/my-listing/ListingOverviewPage';
import { CompanyDirectoryPage } from '../../modules/company-owner/discover-companies/CompanyDirectoryPage';
import { CompanyDetailsPage } from '../../modules/company-owner/discover-companies/CompanyDetailsPage';
import { DocumentsPage } from '../../modules/company-owner/documents/DocumentsPage';
import { ConnectionsPage } from '../../modules/company-owner/connections/ConnectionsPage';
import { OnboardingHistoryPage } from '../../modules/company-owner/onboarding-history/OnboardingHistoryPage';
import { CompanyAnalyticsPage } from '../../modules/company-owner/analytics/CompanyAnalyticsPage';
import { NotificationsPage } from '../../modules/company-owner/notifications/NotificationsPage';
import { AccountPage } from '../../modules/company-owner/account/AccountPage';

export const companyOwnerRoutes: RouteObject = {
  path: '/company',
  element: <CompanyOwnerLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/company/dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <CompanyOwnerDashboardPage />,
    },
    {
      path: 'my-company',
      element: <CompanyProfilePage />,
    },
    {
      path: 'my-company/edit',
      element: <EditCompanyPage />,
    },
    {
      path: 'my-services',
      element: <MyServicesPage />,
    },
    {
      path: 'my-services/create',
      element: <CompanyAddServicePage />,
    },
    {
      path: 'my-services/:id',
      element: <CompanyServiceDetailsPage />,
    },
    {
      path: 'my-listing',
      element: <ListingOverviewPage />,
    },
    {
      path: 'documents',
      element: <DocumentsPage />,
    },
    {
      path: 'connections',
      element: <ConnectionsPage />,
    },
    {
      path: 'discover',
      element: <CompanyDirectoryPage />,
    },
    {
      path: 'discover/:id',
      element: <CompanyDetailsPage />,
    },
    {
      path: 'onboarding-history',
      element: <OnboardingHistoryPage />,
    },
    {
      path: 'analytics',
      element: <CompanyAnalyticsPage />,
    },
    {
      path: 'notifications',
      element: <NotificationsPage />,
    },
    {
      path: 'account',
      element: <AccountPage />,
    },
    {
      path: 'settings',
      element: <AccountPage />,
    },
  ],
};
