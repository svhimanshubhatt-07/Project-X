import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { useNotifications } from '../../../features/notifications/hooks/useNotifications';
import { mockDataStore } from '../../../shared/services/mockDataStore';
import { Bell, CheckCircle2, Clock, Mail, ShieldAlert, ArrowRight, Send, Plus } from 'lucide-react';
import { useToast } from '../../../app/providers/ToastProvider';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useNotifications();
  const { success } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const actionParam = searchParams.get('action');
  const [isSendModalOpen, setIsSendModalOpen] = useState(actionParam === 'send');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    if (actionParam === 'send') {
      setIsSendModalOpen(true);
    }
  }, [actionParam]);

  // Form State
  const [recipientRole, setRecipientRole] = useState<'ALL' | 'COMPANY_OWNER' | 'ADMIN'>('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('SYSTEM_BROADCAST');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'UNREAD' && n.isRead) return false;
      if (activeTab === 'ADMIN' && n.recipientRole !== 'ADMIN') return false;
      return true;
    });
  }, [notifications, activeTab]);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    mockDataStore.addAuditLog({
      user: 'Vikramaditya Roy',
      role: 'ADMIN',
      module: 'Notifications',
      action: 'DISPATCH_BROADCAST_NOTIFICATION',
      entityType: 'Notification',
      entityId: `NOTIF-${Date.now()}`,
      newValue: JSON.stringify({ recipientRole, title, type }),
    });

    success(`Broadcast notification "${title}" dispatched to ${recipientRole.replace('_', ' ')}.`);
    setIsSendModalOpen(false);
    setTitle('');
    setMessage('');
    if (actionParam === 'send') {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Notifications Center"
        subtitle="Live event dispatching, system alerts, application updates, and applicant notifications."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Notifications' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                notifications.forEach((n) => markNotificationRead(n.id));
                success('All notifications marked as read.');
              }}
            >
              Mark All as Read
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSendModalOpen(true)}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Notification
            </Button>
          </div>
        }
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            id: 'ALL',
            label: 'All Alerts',
            count: notifications.length,
            icon: <Bell className="w-4 h-4 text-cyan-400" />,
          },
          {
            id: 'UNREAD',
            label: 'Unread Alerts',
            count: notifications.filter((n) => !n.isRead).length,
            icon: <Mail className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'ADMIN',
            label: 'Admin Events',
            count: notifications.filter((n) => n.recipientRole === 'ADMIN').length,
            icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
          },
        ]}
      />

      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-[#143144]">
            {filteredNotifications.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                No notifications found in this view.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.actionUrl) navigate(notif.actionUrl);
                  }}
                  className={`p-5 hover:bg-[#0f2c40]/40 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                    !notif.isRead ? 'bg-[#091b27]/80' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-center text-teal-400 shrink-0 mt-0.5 shadow-inner">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-100">{notif.title}</h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-teal-400 ring-2 ring-teal-400/20" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block">{notif.sentDate}</span>
                    </div>
                  </div>

                  {notif.actionUrl && (
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-teal-400">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Send Notification Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          if (actionParam === 'send') setSearchParams({});
        }}
        title="Compose & Dispatch Platform Notification"
      >
        <form onSubmit={handleSendNotification} className="space-y-4">
          <Select
            label="Target Audience"
            value={recipientRole}
            onChange={(val) => setRecipientRole(val as any)}
            options={[
              { value: 'ALL', label: 'All Platform Users (Broadcast)' },
              { value: 'COMPANY_OWNER', label: 'Verified Company Owners Only' },
              { value: 'ADMIN', label: 'Platform Administrators & Reviewers' },
            ]}
          />

          <Select
            label="Notification Type"
            value={type}
            onChange={(val) => setType(val)}
            options={[
              { value: 'SYSTEM_BROADCAST', label: 'System Notice / Announcement' },
              { value: 'COMPLIANCE_UPDATE', label: 'Compliance & Verification Notice' },
              { value: 'SECURITY_ALERT', label: 'Security & Access Advisory' },
            ]}
          />

          <Input
            label="Notification Subject / Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled MCA Registry Sync Maintenance"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Message Content
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the full notification message to be delivered to user inboxes..."
              className="w-full px-4 py-2.5 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143144]">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSendModalOpen(false);
                if (actionParam === 'send') setSearchParams({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Dispatch Notification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
