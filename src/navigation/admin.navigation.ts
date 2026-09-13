import { MenuItem } from '../shared/types/common.types';
import { ROUTES } from '../shared/constants/routes.constants';

export const ADMIN_NAVIGATION: MenuItem[] = [
  {
    id: 'admin-dashboard',
    title: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: 'Home',
  },
  {
    id: 'admin-verification',
    title: 'Verification',
    path: ROUTES.ADMIN.APPLICATIONS,
    icon: 'ShieldCheck',
  },
  {
    id: 'admin-companies',
    title: 'All Companies',
    path: ROUTES.ADMIN.COMPANIES,
    icon: 'Building2',
  },
  {
    id: 'admin-users',
    title: 'All Users',
    path: ROUTES.ADMIN.USERS,
    icon: 'Users',
  },
  {
    id: 'admin-service-providers',
    title: 'Service Providers',
    path: '#service-providers',
    icon: 'Briefcase',
    children: [
      {
        id: 'admin-all-providers',
        title: 'All Service Providers',
        path: ROUTES.ADMIN.SERVICE_PROVIDERS,
        icon: 'List',
      },
      {
        id: 'admin-service-list',
        title: 'Service List',
        path: `${ROUTES.ADMIN.SERVICE_PROVIDERS}?tab=services`,
        icon: 'Layers',
      },
    ],
  },
  {
    id: 'admin-reports',
    title: 'Reports',
    path: ROUTES.ADMIN.REPORTS,
    icon: 'FileSpreadsheet',
  },
  {
    id: 'admin-notifications',
    title: 'Notifications',
    path: '#notifications',
    icon: 'Bell',
    children: [
      {
        id: 'admin-all-notifications',
        title: 'All Notifications',
        path: ROUTES.ADMIN.NOTIFICATIONS,
        icon: 'List',
      },
      {
        id: 'admin-send-notification',
        title: 'Send Notification',
        path: `${ROUTES.ADMIN.NOTIFICATIONS}?action=send`,
        icon: 'Send',
      },
    ],
  },
  {
    id: 'admin-profile-settings',
    title: 'Profile & Settings',
    path: '#settings',
    icon: 'Settings',
    children: [
      {
        id: 'admin-my-profile',
        title: 'My Profile',
        path: ROUTES.ADMIN.ACCOUNT,
        icon: 'User',
      },
      {
        id: 'admin-general-settings',
        title: 'General Settings',
        path: `${ROUTES.ADMIN.SETTINGS}?tab=general`,
        icon: 'Sliders',
      },
    ],
  },
];


