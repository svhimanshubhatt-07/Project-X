import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Input } from '../../../shared/components/ui/Input';
import { Checkbox } from '../../../shared/components/ui/Checkbox';
import { Select } from '../../../shared/components/ui/Select';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Briefcase,
  Save,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Sliders,
  KeyRound,
  Shield,
  Clock,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam === 'settings' || tabParam === 'security' ? tabParam : 'profile'
  );

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const [name, setName] = useState(user?.name || 'Dr. Sarah Vance');
  const [email, setEmail] = useState(user?.email || 'sarah.vance@novasystems.io');
  const [phone, setPhone] = useState(user?.phone || '+91 91234 56789');
  const [designation, setDesignation] = useState(user?.designation || 'Co-Founder & CEO');

  // Account Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingDigest, setMarketingDigest] = useState(false);
  const [publicProfileVisible, setPublicProfileVisible] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Company Owner profile updated successfully.');
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Account preferences saved.');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    success('Owner security credentials and password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Owner Account & Settings"
        subtitle="Manage your personal profile, account preferences, communication settings, and security credentials."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Profile & Settings' }]}
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          {
            id: 'profile',
            label: 'My Profile',
            icon: <User className="w-4 h-4 text-cyan-400" />,
          },
          {
            id: 'settings',
            label: 'Account Settings',
            icon: <Sliders className="w-4 h-4 text-purple-400" />,
          },
          {
            id: 'security',
            label: 'Security',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          },
        ]}
      />

      {/* Tab 1: My Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <Avatar name={name} size="xl" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-100 font-heading">{name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold">
                      VERIFIED COMPANY OWNER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {designation} • {user?.companyName || 'Nova Robotics & Aerospace AI'}
                  </p>
                  <p className="text-xs text-teal-400 font-mono mt-0.5">{email}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <form onSubmit={handleProfileSave}>
            <Card>
              <CardHeader
                title="Personal Information"
                subtitle="Official representation credentials registered on Project X."
              />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Official Designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                  />
                  <Input
                    label="Registered Business Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Direct Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                    Save Profile
                  </Button>
                </div>
              </CardBody>
            </Card>
          </form>
        </div>
      )}

      {/* Tab 2: Account Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSettingsSave} className="space-y-6">
          <Card>
            <CardHeader
              title="Platform Preferences & Notifications"
              subtitle="Control email alerts, partnership inquiries, and visibility in company search."
            />
            <CardBody className="space-y-5">
              <Checkbox
                label="Receive B2B Partnership Connection Inquiries"
                description="Allow other verified company owners to send connection requests and collaboration proposals."
                checked={publicProfileVisible}
                onChange={(e) => setPublicProfileVisible(e.target.checked)}
              />

              <Checkbox
                label="Compliance & Document Expiry Email Notifications"
                description="Receive alerts 30 days before any statutory certificates or GST filings require renewal."
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />

              <Checkbox
                label="Weekly Analytics & Search Discovery Digest"
                description="Get a weekly summary of profile views, directory impressions, and buyer traffic."
                checked={marketingDigest}
                onChange={(e) => setMarketingDigest(e.target.checked)}
              />

              <div className="pt-2">
                <Select
                  label="Preferred Language & Localization"
                  defaultValue="en-IN"
                  options={[
                    { value: 'en-IN', label: 'English (India - INR ₹)' },
                    { value: 'en-US', label: 'English (US - USD $)' },
                    { value: 'en-GB', label: 'English (UK - GBP £)' },
                  ]}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                  Save Preferences
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handlePasswordSave}>
            <Card>
              <CardHeader
                title="Change Owner Password"
                subtitle="Ensure your password is at least 8 characters long with special characters."
              />
              <CardBody className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" leftIcon={<Lock className="w-4 h-4" />}>
                    Update Password
                  </Button>
                </div>
              </CardBody>
            </Card>
          </form>

          <Card>
            <CardHeader
              title="Multi-Factor Authentication (MFA)"
              subtitle="Enhance security with two-factor authentication."
            />
            <CardBody className="space-y-4">
              <Checkbox
                label="Enable Two-Factor Authentication (2FA)"
                description="Require a 6-digit verification code from your authenticator app when signing in."
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
              />
              <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center gap-3 text-xs text-slate-300">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>2FA is active and protecting your company profile and legal documents.</span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};
