import React, { useState, ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { MobileSidebar } from './MobileSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { MenuItem } from '../../shared/types/common.types';
import clsx from 'clsx';

export interface DashboardLayoutProps {
  items: MenuItem[];
  children?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ items, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-app text-content-primary flex">
      {/* Desktop Sidebar */}
      <DashboardSidebar
        items={items}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        items={items}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Main Container */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <DashboardHeader onToggleMobileSidebar={() => setIsMobileOpen(true)} />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
};
