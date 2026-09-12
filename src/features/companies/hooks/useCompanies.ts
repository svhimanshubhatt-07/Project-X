import { useState, useEffect } from 'react';
import { mockDataStore, CompanyRecord } from '../../../shared/services/mockDataStore';
import { CompanyStatus, ListingStatus } from '../../../shared/constants/status.constants';

export function useCompanies() {
  const [companies, setCompanies] = useState<CompanyRecord[]>(() => mockDataStore.getCompanies());

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setCompanies(mockDataStore.getCompanies());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    companies,
    getCompanyById: (id: string) => mockDataStore.getCompanyById(id),
    addCompany: (company: Partial<CompanyRecord>) => mockDataStore.addCompany(company),
    updateCompany: (id: string, updates: Partial<CompanyRecord>) => mockDataStore.updateCompany(id, updates),
    setCompanyStatus: (id: string, status: CompanyStatus) => mockDataStore.setCompanyStatus(id, status),
    setListingStatus: (id: string, status: ListingStatus) => mockDataStore.setListingStatus(id, status),
  };
}
