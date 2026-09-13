import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  const activities = [
    { id: '1', initials: 'RS', user: 'Rahul Sharma', action: 'Created new company', time: '2 mins ago', bg: 'bg-[#3B82F6]' },
    { id: '2', initials: 'PX', user: 'Priya Kapoor', action: 'Updated company details', time: '14 mins ago', bg: 'bg-[#2563EB]' },
    { id: '3', initials: 'AU', user: 'Admin User', action: 'Approved verification', time: '1 hour ago', bg: 'bg-[#14B8A6]' },
    { id: '4', initials: 'VG', user: 'Vikram Gupta', action: 'Added new stakeholder', time: '3 hours ago', bg: 'bg-[#0D9488]' },
    { id: '5', initials: 'NM', user: 'Neha Malhotra', action: 'Updated CMS content', time: '5 hours ago', bg: 'bg-[#0284C7]' },
  ];

  return (
    <Card className="h-full bg-[#111827] border border-[#273244] shadow-xl">
      <CardHeader
        title="Recent Activities"
        action={
          <button
            onClick={() => navigate(ROUTES.ADMIN.AUDIT_LOGS)}
            className="text-xs font-semibold text-[#22C55E] hover:underline transition-all"
          >
            View All
          </button>
        }
      />
      <CardBody className="p-0">
        <div className="divide-y divide-[#273244]">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(ROUTES.ADMIN.AUDIT_LOGS)}
              className="p-3.5 sm:px-5 hover:bg-[#1F2937] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-8 h-8 rounded-full ${act.bg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}>
                  {act.initials}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F3F4F6] group-hover:text-[#3B82F6] transition-colors truncate">
                      {act.user}
                    </span>
                    <span className="text-xs text-[#9CA3AF] font-normal truncate">
                      {act.action}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-medium text-[#9CA3AF] shrink-0 whitespace-nowrap">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
