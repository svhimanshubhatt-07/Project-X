import React from 'react';
import { Users, Building2, UserCheck, AlertCircle, MapPin } from 'lucide-react';
import { StatCard } from '../../../../shared/components/dashboard/StatCard';
import { useOnboarding } from '../../../../features/onboarding/hooks/useOnboarding';
import { useCompanies } from '../../../../features/companies/hooks/useCompanies';
import { useUsers } from '../../../../features/users/hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export const PlatformStatistics: React.FC = () => {
  const { applications } = useOnboarding();
  const { companies } = useCompanies();
  const { users } = useUsers();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Companies"
        value={companies.length > 5 ? companies.length : 248}
        icon={<Building2 className="w-6 h-6 text-[var(--brand-primary)]" />}
        trend={{ value: '12%', isPositive: true }}
        variant="default"
        onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
      />

      <StatCard
        title="Active Companies"
        value={210}
        icon={<UserCheck className="w-6 h-6 text-emerald-400" />}
        trend={{ value: '8%', isPositive: true }}
        variant="emerald"
        onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
      />

      <StatCard
        title="Total Users"
        value={'1,842'}
        icon={<Users className="w-6 h-6 text-cyan-400" />}
        trend={{ value: '15%', isPositive: true }}
        variant="blue"
        onClick={() => navigate(ROUTES.ADMIN.USERS)}
      />

      <StatCard
        title="Pending Approvals"
        value={32}
        icon={<MapPin className="w-6 h-6 text-rose-400" />}
        trend={{ value: '25%', isPositive: false }}
        variant="orange"
        onClick={() => navigate(ROUTES.ADMIN.APPLICATIONS)}
      />
    </div>
  );
};
