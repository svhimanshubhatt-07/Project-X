import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { UserTable } from './components/UserTable';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Button } from '../../../shared/components/ui/Button';
import { useToast } from '../../../app/providers/ToastProvider';
import { PlatformUserRecord } from '../../../shared/services/mockDataStore';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  Users,
  ShieldCheck,
  Briefcase,
  UserX,
  Plus,
  Globe,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, setUserStatus } = useUsers();
  const { success } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const activeTab = roleParam ? roleParam.toUpperCase() : 'ALL';

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ role: tabId });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (activeTab === 'ADMIN' && u.role !== 'ADMIN') return false;
      if (activeTab === 'VISITOR' && u.role !== 'VISITOR' && u.role !== 'REGISTERED_USER') return false;
      if (activeTab === 'COMPANY_OWNER' && u.role !== 'COMPANY_OWNER') return false;
      if (activeTab === 'STAKEHOLDER' && u.role !== 'STAKEHOLDER') return false;
      if (activeTab === 'SUSPENDED' && u.status !== 'SUSPENDED') return false;

      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.companyName && u.companyName.toLowerCase().includes(q)) ||
          (u.designation && u.designation.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [users, activeTab, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(filteredUsers, 10);

  const handleToggleStatus = (u: PlatformUserRecord) => {
    const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUserStatus(u.id, nextStatus);
    success(`Account status for ${u.name} updated to ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Users & Access Control"
        subtitle="Manage verified company owners, internal reviewers, executive stakeholders, and registered website visitors."
        breadcrumbs={[{ label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD }, { label: 'All Users' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.USER_CREATE)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create User
          </Button>
        }
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          { id: 'ALL', label: 'All Users', count: users.length, icon: <Users className="w-4 h-4 text-cyan-400" /> },
          {
            id: 'VISITOR',
            label: 'Website Users',
            count: users.filter((u) => u.role === 'VISITOR' || u.role === 'REGISTERED_USER').length,
            icon: <Globe className="w-4 h-4 text-blue-400" />,
          },
          {
            id: 'COMPANY_OWNER',
            label: 'Company Owners',
            count: users.filter((u) => u.role === 'COMPANY_OWNER').length,
            icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
          },
          {
            id: 'STAKEHOLDER',
            label: 'Stakeholders',
            count: users.filter((u) => u.role === 'STAKEHOLDER').length,
            icon: <Briefcase className="w-4 h-4 text-purple-400" />,
          },
          {
            id: 'SUSPENDED',
            label: 'Suspended',
            count: users.filter((u) => u.status === 'SUSPENDED').length,
            icon: <UserX className="w-4 h-4 text-rose-400" />,
          },
        ]}
      />

      <UserTable
        users={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onPageChange={setPage}
        onToggleStatus={handleToggleStatus}
        onViewDetails={(u) => navigate(ROUTES.ADMIN.USER_DETAILS(u.id))}
      />
    </div>
  );
};
