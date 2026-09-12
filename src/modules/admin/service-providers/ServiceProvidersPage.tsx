import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Button } from '../../../shared/components/ui/Button';
import { Plus } from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { AllProvidersTable } from './components/AllProvidersTable';
import { ServiceListCatalog } from './components/ServiceListCatalog';

export const ServiceProvidersPage: React.FC = () => {
  const navigate = useNavigate();
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
        actions={
          isServicesView ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.SERVICE_CREATE)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Services
            </Button>
          ) : undefined
        }
      />

      {isServicesView ? <ServiceListCatalog /> : <AllProvidersTable />}
    </div>
  );
};

