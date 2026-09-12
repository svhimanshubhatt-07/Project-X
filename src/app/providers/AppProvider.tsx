import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { ToastProvider } from './ToastProvider';
import { QueryProvider } from './QueryProvider';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </BrowserRouter>
  );
};
