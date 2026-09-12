import { useState, useEffect } from 'react';
import { mockDataStore, AuditLogRecord } from '../../../shared/services/mockDataStore';

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLogRecord[]>(() => mockDataStore.getAuditLogs());

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setLogs(mockDataStore.getAuditLogs());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    logs,
  };
}
