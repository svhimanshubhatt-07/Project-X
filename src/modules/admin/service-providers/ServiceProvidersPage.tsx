import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { AllProvidersTable } from './components/AllProvidersTable';
import { ServiceListCatalog } from './components/ServiceListCatalog';

export const ServiceProvidersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [isServicesView, setIsServicesView] = useState(tabParam === 'services');

  useEffect(() => {
    setIsServicesView(tabParam === 'services');
  }, [tabParam]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isServicesView ? 'Services List & Catalog' : 'All Service Providers'}
        subtitle={
          isServicesView
            ? 'Browse all standardized service offerings, capabilities, and deliverables with category filter.'
            : 'Manage empaneled service vendors, technical partners, and professional advisors.'
        }
        breadcrumbs={
          isServicesView
            ? [
                { label: 'Dashboard', path: '/admin/dashboard' },
                { label: 'Service Providers', path: '/admin/service-providers' },
                { label: 'Service List' },
              ]
            : [
                { label: 'Dashboard', path: '/admin/dashboard' },
                { label: 'Service Providers' },
              ]
        }
      />

      {isServicesView ? <ServiceListCatalog /> : <AllProvidersTable />}
    </div>
  );
};
