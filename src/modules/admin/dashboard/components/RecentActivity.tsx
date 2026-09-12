import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  const activities = [
    { id: '1', initials: 'RS', user: 'Rahul Sharma', action: 'Created new company', time: '2 mins ago', bg: 'bg-indigo-600' },
    { id: '2', initials: 'PX', user: 'Priya Kapoor', action: 'Updated company details', time: '14 mins ago', bg: 'bg-blue-600' },
    { id: '3', initials: 'AU', user: 'Admin User', action: 'Approved verification', time: '1 hour ago', bg: 'bg-cyan-600' },
    { id: '4', initials: 'VG', user: 'Vikram Gupta', action: 'Added new stakeholder', time: '3 hours ago', bg: 'bg-teal-600' },
    { id: '5', initials: 'NM', user: 'Neha Malhotra', action: 'Updated CMS content', time: '5 hours ago', bg: 'bg-sky-600' },
  ];

  return (
    <Card className="h-full bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl">
      <CardHeader
        title="Recent Activities"
        action={
          <button
            onClick={() => navigate(ROUTES.ADMIN.AUDIT_LOGS)}
            className="text-xs font-semibold text-[var(--brand-primary)] hover:text-emerald-300 transition-colors"
          >
            View All
          </button>
        }
      />
      <CardBody className="p-0">
        <div className="divide-y divide-[var(--border-divider)]">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(ROUTES.ADMIN.AUDIT_LOGS)}
              className="p-4 sm:px-6 hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-8 h-8 rounded-full ${act.bg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}>
                  {act.initials}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-[var(--brand-primary)] transition-colors truncate">
                      {act.user}
                    </span>
                    <span className="text-xs text-slate-300 font-normal truncate">
                      {act.action}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
