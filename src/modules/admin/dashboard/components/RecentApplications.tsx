import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { Button } from '../../../../shared/components/ui/Button';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { useOnboarding } from '../../../../features/onboarding/hooks/useOnboarding';
import { formatDate } from '../../../../shared/utils/formatDate';
import { ArrowRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export const RecentApplications: React.FC = () => {
  const { applications } = useOnboarding();
  const navigate = useNavigate();

  const recentApps = applications.slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader
        title="Recent Onboarding Submissions"
        subtitle="Latest entity verification packets submitted by applicants."
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.APPLICATIONS)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All Applications
          </Button>
        }
      />
      <CardBody className="p-0">
        <div className="divide-y divide-[var(--border-divider)]">
          {recentApps.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(ROUTES.ADMIN.APPLICATION_DETAILS(app.id))}
              className="p-4 sm:px-6 hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[var(--brand-primary)] text-xs shrink-0 shadow-xs">
                  {app.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-slate-100 truncate">{app.companyName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{app.applicantName}</span>
                    <span>•</span>
                    <span className="text-[var(--brand-primary)]">{app.industry}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-300">{formatDate(app.submissionDate)}</span>
                  <span className="text-[10px] text-slate-500">{app.id}</span>
                </div>
                <StatusBadge status={app.status} size="sm" />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white border-[var(--border-subtle)]"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
