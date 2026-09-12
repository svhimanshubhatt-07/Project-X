import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { StatCard } from '../../../shared/components/dashboard/StatCard';
import { DateRangeFilter } from '../../../shared/components/dashboard/DateRangeFilter';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { Eye, Compass, TrendingUp, Users, Target, Sparkles } from 'lucide-react';

export const CompanyAnalyticsPage: React.FC = () => {
  const { companies } = useCompanies();
  const { user } = useAuth();

  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];

  const [timePeriod, setTimePeriod] = useState('30d');
  const [startDate, setStartDate] = useState('2026-02-09');
  const [endDate, setEndDate] = useState('2026-03-09');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Visibility & Discovery Analytics"
        subtitle="Track corporate profile impressions, search keyword discovery, and verified partner engagement."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Analytics' }]}
      />

      {/* Date Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0c2130] border border-[#17384e] shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Tabs
          variant="enclosed"
          activeTab={timePeriod}
          onChange={setTimePeriod}
          tabs={[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
          ]}
        />

        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Profile Impressions"
          value={myCompany?.profileViews.toLocaleString() || '14,850'}
          icon={<Eye className="w-5 h-5 text-cyan-400" />}
          trend={{ value: '+24.5%', isPositive: true, label: 'vs last period' }}
          variant="purple"
        />

        <StatCard
          title="Listing Click-Throughs"
          value={myCompany?.listingViews.toLocaleString() || '8,920'}
          icon={<Compass className="w-5 h-5 text-teal-400" />}
          trend={{ value: '+18.2%', isPositive: true }}
          variant="orange"
        />

        <StatCard
          title="Conversion to Direct Inquiry"
          value="12.4%"
          icon={<Target className="w-5 h-5 text-emerald-400" />}
          trend={{ value: 'Industry top 10%', isPositive: true }}
          variant="emerald"
        />
      </div>

      {/* Analytics Visualization */}
      <Card className="bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg">
        <CardHeader
          title="Impressions Over Time"
          subtitle="Showing daily profile views vs. listing search impressions."
        />
        <CardBody>
          <div className="h-64 flex flex-col justify-between pt-4">
            <div className="flex items-end justify-between h-48 gap-3 px-2">
              {[
                { label: 'Week 1', profile: 2400, listing: 1800 },
                { label: 'Week 2', profile: 3100, listing: 2200 },
                { label: 'Week 3', profile: 4200, listing: 2900 },
                { label: 'Week 4', profile: 5150, listing: 3820 },
              ].map((w, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-2 h-full">
                    {/* Profile bar */}
                    <div
                      className="w-4 sm:w-8 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md transition-all group-hover:brightness-110 shadow-xs shadow-emerald-500/20"
                      style={{ height: `${(w.profile / 6000) * 100}%` }}
                    />
                    {/* Listing bar */}
                    <div
                      className="w-4 sm:w-8 bg-gradient-to-t from-cyan-600 to-teal-500 rounded-t-md transition-all group-hover:brightness-110 shadow-xs"
                      style={{ height: `${(w.listing / 6000) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{w.label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border-divider)] pt-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  Profile Impressions
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Directory Clicks
                </span>
              </div>
              <span className="text-emerald-400 font-semibold">+32% Search Discovery Growth</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
