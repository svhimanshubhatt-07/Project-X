import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useToast } from '../../../app/providers/ToastProvider';
import { Shield, Save, Lock, Mail, Phone } from 'lucide-react';

export const AdminAccountPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState(user?.name || 'Vikramaditya Roy');
  const [email, setEmail] = useState(user?.email || 'admin@projectx.io');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [designation, setDesignation] = useState(user?.designation || 'Principal Platform Administrator');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Administrator profile information updated successfully.');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    success('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Admin Account & Credentials"
        subtitle="Manage personal administrator details, clearance level, and security keys."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Account' }]}
      />

      {/* Account Identity Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-4">
            <Avatar name={name} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-100 font-heading">{name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{designation}</p>
              <p className="text-xs text-teal-400 font-mono mt-0.5">{email}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleProfileSave}>
        <Card>
          <CardHeader title="Personal Information" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Designation / Official Title"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
              <Input
                label="Registered Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
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

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSave}>
        <Card>
          <CardHeader title="Update Password & Credentials" />
          <CardBody className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••••••"
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
              <Button type="submit" variant="secondary" leftIcon={<Lock className="w-4 h-4" />}>
                Change Password
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};
