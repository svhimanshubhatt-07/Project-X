import React from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { useNotifications } from '../../../features/notifications/hooks/useNotifications';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useToast } from '../../../app/providers/ToastProvider';
import { Bell, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useNotifications();
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  // Show notifications for Company Owner
  const ownerNotifications = notifications.filter(
    (n) => n.recipientRole === 'COMPANY_OWNER' || n.recipientRole === 'ALL'
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Company Notifications & Alerts"
        subtitle="Verification milestones, listing status updates, and compliance communications."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Notifications' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              ownerNotifications.forEach((n) => markNotificationRead(n.id));
              success('All notifications marked as read.');
            }}
          >
            Mark All as Read
          </Button>
        }
      />

      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-[#143144]">
            {ownerNotifications.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                No notifications to display.
              </div>
            ) : (
              ownerNotifications.map((notif) => (
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
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-teal-400 ring-2 ring-teal-400/20" />}
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
    </div>
  );
};
