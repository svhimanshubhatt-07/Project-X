import React from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useOnboarding } from '../../../features/onboarding/hooks/useOnboarding';
import { formatDate, formatDateTime } from '../../../shared/utils/formatDate';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const OnboardingHistoryPage: React.FC = () => {
  const { applications } = useOnboarding();
  const myApp = applications[0]; // Nova Robotics application

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Company Onboarding History & Verification Timeline"
        subtitle="Chronological audit record of your initial application submission, reviewer remarks, and official approval."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Onboarding History' }]}
      />

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-[#0c2130] via-[#0e2738] to-[#0c2130] border-[#17384e] shadow-xl">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-teal-400 font-mono font-bold block mb-1">
                APPLICATION ID: {myApp?.id}
              </span>
              <h3 className="text-xl font-bold text-slate-100 font-heading">{myApp?.companyName}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Submitted on {formatDate(myApp?.submissionDate)} by {myApp?.applicantName}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block mb-1">Current State</span>
              <StatusBadge status={myApp?.status || 'APPROVED'} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Visual Timeline Card */}
      <Card>
        <CardHeader
          title="Verification Milestone Journey"
          subtitle="All lifecycle state transitions for your corporate entity."
        />
        <CardBody className="p-6">
          <div className="relative pl-6 space-y-8 before:absolute before:top-3 before:bottom-3 before:left-2.5 before:w-0.5 before:bg-[#17384e]">
            {myApp?.timeline.map((event, idx) => {
              const isLast = idx === myApp.timeline.length - 1;

              let iconBg = 'bg-[#091b27] text-slate-300 border-[#17384e]';
              if (event.status === 'APPROVED') iconBg = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
              if (event.status === 'MORE_INFORMATION_REQUIRED') iconBg = 'bg-teal-950/40 text-teal-400 border-teal-500/30';

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full border flex items-center justify-center ${iconBg} shadow-sm`}
                  >
                    {event.status === 'APPROVED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : event.status === 'MORE_INFORMATION_REQUIRED' ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Content Box */}
                  <div className="bg-[#091b27] p-4 rounded-2xl border border-[#17384e] space-y-1.5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100 font-heading">{event.title}</h4>
                        <StatusBadge status={event.status} size="sm" />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{formatDateTime(event.timestamp)}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>

                    {event.remarks && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#0c2130] border border-teal-500/30 text-xs text-teal-300 italic">
                        Reviewer Message: "{event.remarks}"
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Recorded by:</span>
                      <strong className="text-slate-200">{event.actor}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
