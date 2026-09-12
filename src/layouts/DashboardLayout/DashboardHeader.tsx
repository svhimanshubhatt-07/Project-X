import React, { useState } from 'react';
import { Menu, Bell, LogOut, Shield, Briefcase, User as UserIcon, HelpCircle } from 'lucide-react';
import { useAuth } from '../../features/authentication/hooks/useAuth';
import { Avatar } from '../../shared/components/ui/Avatar';
import { Dropdown } from '../../shared/components/ui/Dropdown';
import { ROLES } from '../../shared/constants/roles.constants';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes.constants';

export interface DashboardHeaderProps {
  onToggleMobileSidebar: () => void;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleMobileSidebar, className }) => {
  const { user, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications] = useState(3);

  const handleRoleSwitch = (targetRole: 'ADMIN' | 'COMPANY_OWNER') => {
    quickLogin(targetRole);
    if (targetRole === 'ADMIN') {
      navigate(ROUTES.ADMIN.DASHBOARD);
    } else {
      navigate(ROUTES.COMPANY_OWNER.DASHBOARD);
    }
  };

  const handleAccountClick = () => {
    if (user?.role === ROLES.ADMIN) {
      navigate(ROUTES.ADMIN.ACCOUNT);
    } else {
      navigate(ROUTES.COMPANY_OWNER.ACCOUNT);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-bg-header/90 backdrop-blur-md border-b border-border-divider px-6 sm:px-8 flex items-center justify-between gap-6 shadow-md">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl text-content-secondary hover:text-content-primary hover:bg-bg-surface transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search companies, users, stakeholders..."
            className="w-full h-11 pl-10 pr-4 bg-bg-surface text-sm text-content-primary placeholder-content-muted rounded-xl border border-border-subtle hover:border-border-strong focus:border-brand-primary focus:bg-bg-surfaceHover focus:ring-2 focus:ring-brand-glow outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Help, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Notifications Icon Button */}
        <button
          onClick={() => {
            if (user?.role === ROLES.ADMIN) {
              navigate(ROUTES.ADMIN.NOTIFICATIONS);
            } else {
              navigate(ROUTES.COMPANY_OWNER.NOTIFICATIONS);
            }
          }}
          className="relative p-2.5 rounded-xl border border-border-subtle bg-bg-surface hover:bg-bg-surfaceHover text-content-secondary hover:text-content-primary shadow-sm transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-bg-app">
              3
            </span>
          )}
        </button>

        {/* Help / Support Icon Button */}
        <button
          onClick={() => window.open('https://docs.projectx.internal', '_blank')}
          className="p-2.5 rounded-xl border border-border-subtle bg-bg-surface hover:bg-bg-surfaceHover text-content-secondary hover:text-content-primary shadow-sm transition-colors hidden sm:flex"
          title="Help & Support"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-border-subtle bg-bg-surface hover:border-border-strong hover:bg-bg-surfaceHover shadow-sm transition-all cursor-pointer">
              <Avatar name={user?.name || 'Vikramaditya Roy'} size="sm" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-content-primary">{user?.name || 'Vikramaditya Roy'}</span>
                <span className="text-[10px] font-medium text-content-secondary">
                  {user?.role === ROLES.ADMIN ? 'Administrator' : 'Company Owner'}
                </span>
              </div>
            </div>
          }
          items={[
            {
              id: 'profile',
              label: 'Account & Settings',
              icon: <UserIcon className="w-4 h-4" />,
              onClick: handleAccountClick,
            },
            {
              id: 'switch-admin',
              label: 'Switch to Admin View',
              icon: <Shield className="w-4 h-4 text-brand-primary" />,
              onClick: () => handleRoleSwitch('ADMIN'),
            },
            {
              id: 'switch-owner',
              label: 'Switch to Owner View',
              icon: <Briefcase className="w-4 h-4 text-brand-primary" />,
              onClick: () => handleRoleSwitch('COMPANY_OWNER'),
            },
            {
              id: 'div-1',
              label: '',
              divider: true,
            },
            {
              id: 'logout',
              label: 'Sign Out',
              icon: <LogOut className="w-4 h-4" />,
              danger: true,
              onClick: () => logout(),
            },
          ]}
        />
      </div>
    </header>
  );
};
