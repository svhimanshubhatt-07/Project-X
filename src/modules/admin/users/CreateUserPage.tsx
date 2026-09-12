import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import {
  UserPlus,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password criteria check
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      error('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      error('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match. Please re-confirm.');
      return;
    }

    setIsSubmitting(true);

    try {
      addUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'VISITOR',
        status: 'ACTIVE',
        designation: 'Website Visitor',
        companyName: 'Public Company Discovery',
        registrationSource: 'WEBSITE_SIGNUP',
        companiesViewed: 0,
        interests: ['Platform Directory Explorer'],
      });

      success(`Website user account for "${formData.name}" created successfully!`);
      navigate(ROUTES.ADMIN.USERS);
    } catch (err) {
      error('An error occurred while creating the account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <PageHeader
        title="Register Website User"
        subtitle="Create a new website visitor / explorer account with email and password credentials."
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'All Users', path: ROUTES.ADMIN.USERS },
          { label: 'Register User' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.USERS)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Cancel & Return
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Credentials Card */}
        <Card className="bg-[#091e2b] border-[#17384e] shadow-xl">
          <CardHeader className="border-b border-[#143144] py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserPlus className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Visitor Registration</h3>
                <p className="text-[11px] text-slate-400">Standard website signup with credentials</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
              <Globe className="w-3.5 h-3.5" /> Website Visitor
            </span>
          </CardHeader>

          <CardBody className="p-6 space-y-5">
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="e.g. Rahul Mehra / Sneha Reddy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              placeholder="e.g. user@domain.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5">
                  Password <span className="text-teal-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full h-11 pl-4 pr-11 bg-[#091b27] text-sm text-slate-100 rounded-xl border border-[#17384e] hover:border-teal-500/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5">
                  Confirm Password <span className="text-teal-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className={`w-full h-11 pl-4 pr-11 bg-[#091b27] text-sm text-slate-100 rounded-xl border ${formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-[#17384e] hover:border-teal-500/50 focus:border-teal-400 focus:ring-teal-500/20'
                      } focus:ring-2 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Validation Hints */}
            <div className="p-3.5 bg-[#081824] rounded-xl border border-[#143144] flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Password checks:</span>
              <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> 8+ Characters
              </span>
              <span className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Contains Number
              </span>
              <span className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Passwords Match
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Submit & Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.ADMIN.USERS)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="shadow-lg shadow-teal-500/20"
          >
            {isSubmitting ? 'Registering...' : 'Register User'}
          </Button>
        </div>
      </form>
    </div>
  );
};
