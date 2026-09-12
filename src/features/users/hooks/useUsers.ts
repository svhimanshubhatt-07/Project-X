import { useState, useEffect } from 'react';
import { mockDataStore, PlatformUserRecord } from '../../../shared/services/mockDataStore';

export function useUsers() {
  const [users, setUsers] = useState<PlatformUserRecord[]>(() => mockDataStore.getUsers());

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setUsers(mockDataStore.getUsers());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    users,
    getUserById: (id: string) => mockDataStore.getUserById(id),
    updateUser: (id: string, updates: Partial<PlatformUserRecord>) =>
      mockDataStore.updateUser(id, updates),
    addUser: (user: Omit<PlatformUserRecord, 'id' | 'registrationDate' | 'lastLoginDate'>) =>
      mockDataStore.addUser(user),
    setUserStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') =>
      mockDataStore.setUserStatus(id, status),
  };
}
