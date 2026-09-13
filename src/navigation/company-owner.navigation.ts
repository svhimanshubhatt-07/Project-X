import { MenuItem } from '../shared/types/common.types';
import { ROUTES } from '../shared/constants/routes.constants';

export const COMPANY_OWNER_NAVIGATION: MenuItem[] = [
  {
    id: 'owner-dashboard',
    title: 'Dashboard',
    path: ROUTES.COMPANY_OWNER.DASHBOARD,
    icon: 'Home',
  },
  {
    id: 'owner-my-company',
    title: 'My Company',
    path: ROUTES.COMPANY_OWNER.MY_COMPANY,
    icon: 'Building2',
  },
  {
    id: 'owner-my-services',
    title: 'My Services',
    path: ROUTES.COMPANY_OWNER.MY_SERVICES,
    icon: 'Layers',
  },
  {
    id: 'owner-documents',
    title: 'Documents',
    path: ROUTES.COMPANY_OWNER.DOCUMENTS,
    icon: 'Files',
  },
  {
    id: 'owner-connections',
    title: 'Connections',
    path: '#connections',
    icon: 'Users',
    children: [
      {
        id: 'owner-my-connections',
        title: 'My Connections',
        path: `${ROUTES.COMPANY_OWNER.CONNECTIONS}?tab=my-connections`,
        icon: 'Users',
      },
      {
        id: 'owner-connection-requests',
        title: 'Connection Requests',
        path: `${ROUTES.COMPANY_OWNER.CONNECTIONS}?tab=requests`,
        icon: 'UserCheck',
      },
    ],
  },
  {
    id: 'owner-discover-companies',
    title: 'Discover Companies',
    path: ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES,
    icon: 'Search',
  },
  {
    id: 'owner-notifications',
    title: 'Notifications',
    path: ROUTES.COMPANY_OWNER.NOTIFICATIONS,
    icon: 'Bell',
  },
  {
    id: 'owner-profile-settings',
    title: 'Profile & Settings',
    path: '#settings',
    icon: 'Settings',
    children: [
      {
        id: 'owner-my-profile',
        title: 'My Profile',
        path: `${ROUTES.COMPANY_OWNER.ACCOUNT}?tab=profile`,
        icon: 'User',
      },
      {
        id: 'owner-account-settings',
        title: 'Account Settings',
        path: `${ROUTES.COMPANY_OWNER.ACCOUNT}?tab=settings`,
        icon: 'Sliders',
      },
    ],
  },
];

