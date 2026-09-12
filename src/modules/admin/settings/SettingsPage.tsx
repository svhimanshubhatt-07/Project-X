import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Input } from '../../../shared/components/ui/Input';
import { Checkbox } from '../../../shared/components/ui/Checkbox';
import { Select } from '../../../shared/components/ui/Select';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Save,
  Sliders,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  UserCheck,
  ShieldAlert,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam ? tabParam.toLowerCase() : 'general';

  const handleTabChange = (tabId: string) => {
    if (tabId === 'general') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  // Setting toggles
  const [autoAssignment, setAutoAssignment] = useState(true);
  const [requireGstValidation, setRequireGstValidation] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState('60');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'password') {
      if (!currentPassword) {
        error('Please enter your current password.', 'Validation Error');
        return;
      }
      if (newPassword.length < 8) {
        error('New password must be at least 8 characters long.', 'Validation Error');
        return;
      }
      if (newPassword !== confirmPassword) {
        error('New passwords do not match.', 'Validation Error');
        return;
      }
      success('Admin password changed and credentials re-encrypted.', 'Security Updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    success('Platform settings updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Platform & Compliance Settings"
        subtitle="Configure verification thresholds, security enforcement policies, administrator credentials, and governance rules."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Settings' }]}
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          {
            id: 'general',
            label: 'General Settings',
            icon: <Sliders className="w-4 h-4 text-cyan-400" />,
          },
          {
            id: 'security',
            label: 'Security & Access',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          },
          {
            id: 'password',
            label: 'Change Password',
            icon: <Lock className="w-4 h-4 text-amber-400" />,
          },
          {
            id: 'roles',
            label: 'Roles & Permissions',
            icon: <UserCheck className="w-4 h-4 text-purple-400" />,
          },
          {
            id: 'delegation',
            label: 'Delegation',
            icon: <Shield className="w-4 h-4 text-rose-400" />,
          },
        ]}
      />

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'general' && (
          <Card>
            <CardHeader
              title="General Platform Configuration"
              subtitle="Basic platform identifiers, default compliance emails, and support channels."
            />
            <CardBody className="space-y-4">
              <Input label="Platform Title" defaultValue="Project X Enterprise Discovery" />
              <Input label="Compliance Support Email" defaultValue="compliance@projectx.io" />
              <Input label="Support Escalation Helpline" defaultValue="+91 80 4000 8800" />
              <div className="pt-2">
                <Checkbox
                  label="Enable Public Company Discovery Directory"
                  description="Allows unauthenticated visitors to browse verified company cards and public listings."
                  defaultChecked
                />
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardHeader
              title="Security & Authentication Policies"
              subtitle="Control administrative session parameters, MFA enforcement, and authentication rules."
            />
            <CardBody className="space-y-5">
              <Checkbox
                label="Enforce Multi-Factor Authentication (MFA) for Administrative Roles"
                description="Mandate TOTP authenticator app or hardware token confirmation upon every login."
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
              />

              <Checkbox
                label="Log All IP & Geolocation Changes"
                description="Trigger automated audit entries and immediate email alerts when login happens from a new network."
                defaultChecked
              />

              <div className="pt-2">
                <Select
                  label="Administrative Session Idle Timeout"
                  value={sessionTimeoutMinutes}
                  onChange={(val) => setSessionTimeoutMinutes(val)}
                  options={[
                    { label: '15 Minutes (High Security)', value: '15' },
                    { label: '30 Minutes (Recommended)', value: '30' },
                    { label: '60 Minutes (Standard)', value: '60' },
                    { label: '120 Minutes', value: '120' },
                  ]}
                />
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card>
            <CardHeader
              title="Update Administrative Password"
              subtitle="Ensure your new password contains letters, numbers, and special characters for optimal security."
            />
            <CardBody className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center gap-3 text-xs text-slate-300">
                <KeyRound className="w-5 h-5 text-teal-400 shrink-0" />
                <span>
                  Passwords must be at least 8 characters long, contain uppercase & lowercase letters, and at least one special character.
                </span>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'roles' && (
          <Card>
            <CardHeader
              title="Platform Roles & Clearance Levels"
              subtitle="Configure access boundaries, administrative rights, and signatory privileges."
            />
            <CardBody className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    role: 'Super Admin',
                    desc: 'Full unrestricted governance, user management, and approval authority.',
                    level: 'Level 1',
                  },
                  {
                    role: 'Compliance Officer',
                    desc: 'Application document inspection, MCA audit validation, and request info capability.',
                    level: 'Level 2',
                  },
                  {
                    role: 'Company Owner',
                    desc: 'Entity profile editing, team invite delegation, and product catalog management.',
                    level: 'Level 3',
                  },
                  {
                    role: 'Stakeholder / Viewer',
                    desc: 'Read-only directory exploration and corporate verification inspection.',
                    level: 'Level 4',
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">{r.role}</span>
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                          {r.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                    </div>
                    <Button size="sm" variant="outline" type="button" className="text-xs shrink-0">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'delegation' && (
          <Card>
            <CardHeader
              title="Delegation & Signatory Authority"
              subtitle="Control temporal review delegation and signatory power assignments."
            />
            <CardBody className="space-y-4">
              <Checkbox
                label="Allow Temporary Review Delegation"
                description="Permit primary admins to assign verification packets to secondary reviewers during planned absence."
                defaultChecked
              />
              <Checkbox
                label="Dual-Review Signoff for Enterprise Listings"
                description="Require secondary signoff for entities reporting over 500+ employees or regulated fintech licenses."
                defaultChecked
              />
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            {activeTab === 'password' ? 'Update Password' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
