import { useState, useEffect } from 'react';
import { mockDataStore, CompanyServiceVerificationRecord } from '../../../shared/services/mockDataStore';

export function useServiceVerifications() {
  const [services, setServices] = useState<CompanyServiceVerificationRecord[]>(() =>
    mockDataStore.getServiceVerifications()
  );

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setServices(mockDataStore.getServiceVerifications());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    services,
    getServiceById: (id: string) => mockDataStore.getServiceVerificationById(id),
    addCompanyService: (
      service: Omit<CompanyServiceVerificationRecord, 'id' | 'submissionDate'>
    ) => mockDataStore.addCompanyService(service),
    approveService: (id: string, remarks?: string) =>
      mockDataStore.approveServiceVerification(id, remarks),
    rejectService: (id: string, reason: string) =>
      mockDataStore.rejectServiceVerification(id, reason),
    setServiceStatus: (
      id: string,
      status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED',
      remarks?: string
    ) => mockDataStore.setServiceVerificationStatus(id, status, remarks),
  };
}
