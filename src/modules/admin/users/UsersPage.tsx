import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { UserTable } from './components/UserTable';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useToast } from '../../../app/providers/ToastProvider';
import { PlatformUserRecord } from '../../../shared/services/mockDataStore';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  Users,
  ShieldCheck,
  Briefcase,
  UserX,
  Mail,
  Building,
  Calendar,
  Shield,
  Clock,
  Phone,
  Plus,
  Globe,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, setUserStatus } = useUsers();
  const { success } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const viewParam = searchParams.get('view');
  const activeTab = roleParam ? roleParam.toUpperCase() : 'ALL';

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Selected User for Details Modal
  const [selectedUser, setSelectedUser] = useState<PlatformUserRecord | null>(null);

  useEffect(() => {
    if (viewParam === 'details' && !selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [viewParam, users]);

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
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'All Users' }]}
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
        onViewDetails={(u) => setSelectedUser(u)}
      />

      {/* User Details Modal */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => {
          setSelectedUser(null);
          if (viewParam === 'details') setSearchParams({});
        }}
        title="Platform User Profile & Activity Record"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#091b27] border border-[#17384e]">
              <div className="flex items-center gap-4">
                <Avatar name={selectedUser.name} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">{selectedUser.name}</h3>
                    <StatusBadge status={selectedUser.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedUser.email}</p>
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30 mt-2 inline-block">
                    {selectedUser.role === 'VISITOR' || selectedUser.role === 'REGISTERED_USER'
                      ? 'Website Visitor (Registered)'
                      : selectedUser.role.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {selectedUser.role !== 'ADMIN' && (
                <Button
                  size="sm"
                  variant={selectedUser.status === 'ACTIVE' ? 'outline' : 'success'}
                  onClick={() => {
                    handleToggleStatus(selectedUser);
                    setSelectedUser({
                      ...selectedUser,
                      status: selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                    });
                  }}
                >
                  {selectedUser.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                </Button>
              )}
            </div>

            {/* Visitor Specific Engagement Card */}
            {(selectedUser.role === 'VISITOR' || selectedUser.role === 'REGISTERED_USER') && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c283c] to-[#091b27] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    Website Visitor & Directory Telemetry
                  </span>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {selectedUser.companiesViewed || 12} Companies Explored
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Directory Activity</span>
                    <span className="font-semibold text-slate-100">{selectedUser.companyName || 'Public Company Discovery'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registration Method</span>
                    <span className="font-semibold text-slate-100">Email & Password (Direct Portal Signup)</span>
                  </div>
                </div>
                {selectedUser.interests && selectedUser.interests.length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-400 text-[11px] block mb-1.5">Industry Sectors Explored:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.interests.map((int, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#091b27] text-cyan-300 rounded text-[11px] border border-cyan-500/30">
                          ✦ {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0c2130] border border-[#17384e] space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Associated Entity / Intent
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Building className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold">{selectedUser.companyName || 'Platform Explorer'}</span>
                </div>
                <p className="text-xs text-slate-400">Designation: {selectedUser.designation || 'Website Visitor'}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c2130] border border-[#17384e] space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Access & Telemetry
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>Last Active: {selectedUser.lastLoginDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Registered: {selectedUser.registrationDate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c2130] border border-[#17384e]">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Clearance Boundaries
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-[#091b27] border border-[#17384e] text-slate-300">
                  ✓ Enterprise Directory Discovery
                </span>
                <span className="px-2.5 py-1 rounded bg-[#091b27] border border-[#17384e] text-slate-300">
                  ✓ Public Company Details View
                </span>
                {selectedUser.role === 'ADMIN' && (
                  <span className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-semibold">
                    ✓ Full Verification Authority
                  </span>
                )}
                {selectedUser.role === 'COMPANY_OWNER' && (
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
                    ✓ Profile & Listing Edit Signoff
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#143144]">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedUser(null);
                  if (viewParam === 'details') setSearchParams({});
                }}
              >
                Close Inspector
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
