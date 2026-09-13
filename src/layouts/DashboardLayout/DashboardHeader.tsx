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
    <header className="sticky top-0 z-20 h-20 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#273244] px-6 sm:px-8 flex items-center justify-between gap-6 shadow-md">
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#111827] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#667085]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search companies, users, stakeholders..."
            className="w-full h-11 pl-10 pr-4 bg-[#111827] text-xs sm:text-sm text-[#F3F4F6] placeholder-[#667085] rounded-xl border border-[#273244] hover:border-[#374151] focus:border-[#3B82F6] focus:bg-[#111827] outline-none transition-all"
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
          className="relative p-2.5 rounded-xl border border-[#273244] bg-[#111827] hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#F3F4F6] shadow-sm transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#0B0F14]">
              3
            </span>
          )}
        </button>

        {/* Help / Support Icon Button */}
        <button
          onClick={() => window.open('https://docs.projectx.internal', '_blank')}
          className="p-2.5 rounded-xl border border-[#273244] bg-[#111827] hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#F3F4F6] shadow-sm transition-colors hidden sm:flex"
          title="Help & Support"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#273244] bg-[#111827] hover:border-[#374151] hover:bg-[#1F2937] shadow-sm transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-slate-950 font-extrabold flex items-center justify-center text-xs shadow-sm">
                VR
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#F3F4F6]">{user?.name || 'Vikramaditya Roy'}</span>
                <span className="text-[10px] font-medium text-[#9CA3AF]">
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
