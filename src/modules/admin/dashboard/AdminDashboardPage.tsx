import React from 'react';
import { PlatformStatistics } from './components/PlatformStatistics';
import { RegistrationChart } from './components/RegistrationChart';
import { ApplicationStatusChart } from './components/ApplicationStatusChart';
import { RecentCompanies } from './components/RecentCompanies';
import { RecentActivity } from './components/RecentActivity';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Greeting & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight">
            {getGreeting()}, Admin!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            A unified platform for company administration and ecosystem monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0c2130] border border-[#17384e] hover:border-teal-500/40 text-slate-200 text-xs font-medium shadow-md transition-all">
            <CalendarIcon className="w-4 h-4 text-teal-400" />
            <span>{dateLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4 Cards) */}
      <PlatformStatistics />

      {/* Charts Row (Registration Trend + Status Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegistrationChart />
        </div>
        <div>
          <ApplicationStatusChart />
        </div>
      </div>

      {/* Tables & Activity Row (Recent Companies + Recent Activities) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCompanies />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};
