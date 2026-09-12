export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  APPLICATIONS: {
    LIST: '/applications',
    DETAILS: (id: string) => `/applications/${id}`,
    APPROVE: (id: string) => `/applications/${id}/approve`,
    REJECT: (id: string) => `/applications/${id}/reject`,
    REQUEST_INFO: (id: string) => `/applications/${id}/request-info`,
    ADD_NOTE: (id: string) => `/applications/${id}/notes`,
  },
  COMPANIES: {
    LIST: '/companies',
    DETAILS: (id: string) => `/companies/${id}`,
    UPDATE: (id: string) => `/companies/${id}`,
    STATUS: (id: string) => `/companies/${id}/status`,
    MY_COMPANY: '/companies/my-company',
  },
  LISTINGS: {
    LIST: '/listings',
    DETAILS: (id: string) => `/listings/${id}`,
    STATUS: (id: string) => `/listings/${id}/status`,
  },
  DOCUMENTS: {
    LIST: '/documents',
    DETAILS: (id: string) => `/documents/${id}`,
    VERIFY: (id: string) => `/documents/${id}/verify`,
    UPLOAD: '/documents/upload',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
  ANALYTICS: {
    ADMIN_STATS: '/analytics/admin/stats',
    COMPANY_STATS: '/analytics/company/stats',
  },
  AUDIT_LOGS: {
    LIST: '/audit-logs',
  },
};
