import { useState, useEffect } from 'react';
import { mockDataStore } from '../../../shared/services/mockDataStore';
import { OnboardingApplication } from '../types/onboarding.types';

export function useOnboarding() {
  const [applications, setApplications] = useState<OnboardingApplication[]>(() => mockDataStore.getApplications());

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setApplications(mockDataStore.getApplications());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    applications,
    getApplicationById: (id: string) => mockDataStore.getApplicationById(id),
    approveApplication: (id: string, notes?: string) => mockDataStore.approveApplication(id, notes),
    rejectApplication: (id: string, reason: string) => mockDataStore.rejectApplication(id, reason),
    requestMoreInfo: (id: string, message: string, requiredItems: string[]) =>
      mockDataStore.requestMoreInfo(id, message, requiredItems),
    addInternalNote: (id: string, note: string) => mockDataStore.addInternalNote(id, note),
  };
}
