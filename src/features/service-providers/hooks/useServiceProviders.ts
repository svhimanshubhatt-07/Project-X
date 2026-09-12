import { useState, useEffect } from 'react';
import { mockDataStore, ServiceProviderRecord } from '../../../shared/services/mockDataStore';

export function useServiceProviders() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderRecord[]>(() =>
    mockDataStore.getServiceProviders()
  );

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setServiceProviders(mockDataStore.getServiceProviders());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    serviceProviders,
    getServiceProviderById: (id: string) => mockDataStore.getServiceProviderById(id),
    addServiceProvider: (sp: Omit<ServiceProviderRecord, 'id' | 'joinedDate'>) =>
      mockDataStore.addServiceProvider(sp),
    updateServiceProvider: (id: string, updates: Partial<ServiceProviderRecord>) =>
      mockDataStore.updateServiceProvider(id, updates),
    setServiceProviderStatus: (id: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED') =>
      mockDataStore.setServiceProviderStatus(id, status),
  };
}
