import { useState, useEffect } from 'react';
import { mockDataStore, NotificationRecord, NotificationTemplateRecord } from '../../../shared/services/mockDataStore';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => mockDataStore.getNotifications());
  const [templates, setTemplates] = useState<NotificationTemplateRecord[]>(() => mockDataStore.getTemplates());

  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      setNotifications(mockDataStore.getNotifications());
      setTemplates(mockDataStore.getTemplates());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    notifications,
    templates,
    markNotificationRead: (id: string) => mockDataStore.markNotificationRead(id),
    updateTemplate: (id: string, updates: Partial<NotificationTemplateRecord>) =>
      mockDataStore.updateTemplate(id, updates),
    addTemplate: (tmpl: Omit<NotificationTemplateRecord, 'id' | 'lastUpdated'>) =>
      mockDataStore.addTemplate(tmpl),
  };
}
