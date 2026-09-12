import React, { ReactNode } from 'react';
import clsx from 'clsx';

export interface DashboardContentProps {
  children: ReactNode;
  className?: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ children, className }) => {
  return (
    <main className={clsx('flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-fadeIn', className)}>
      {children}
    </main>
  );
};
