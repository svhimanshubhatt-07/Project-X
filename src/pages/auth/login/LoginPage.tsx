import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Briefcase, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout/AuthLayout';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useToast } from '../../../app/providers/ToastProvider';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { ROLES } from '../../../shared/constants/roles.constants';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLogin, isLoading } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('admin@projectx.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your registered email address.');
      return;
    }

    try {
      await login({ email, password });
      success('Logged in successfully', 'Welcome to Project X');

      if (email.toLowerCase().includes('admin')) {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.COMPANY_OWNER.DASHBOARD);
      }
    } catch (err: any) {
      error(err?.message || 'Invalid credentials.');
    }
  };

  const handleQuickLogin = async (role: 'ADMIN' | 'COMPANY_OWNER') => {
    try {
      await quickLogin(role);
      success(`Signed in as ${role === 'ADMIN' ? 'Platform Administrator' : 'Company Owner'}`);

      if (role === 'ADMIN') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.COMPANY_OWNER.DASHBOARD);
      }
    } catch (err: any) {
      error('Quick login failed');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full bg-[#0c2130] border border-[#17384e] rounded-3xl p-8 sm:p-10 shadow-2xl animate-fadeIn">
        {/* Card Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-heading tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Enter your credentials to access your Project X dashboard.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-sm font-semibold mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Quick Login Buttons */}
        <div className="mt-8 pt-6 border-t border-[#17384e]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-4 font-heading">
            QUICK LOGIN (DEMO)
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#091b27] hover:bg-[#143144] border border-[#17384e] text-slate-200 transition-all group shadow-sm"
            >
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-100">Admin</span>
              <span className="text-[10px] text-slate-400">Full Platform</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('COMPANY_OWNER')}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#091b27] hover:bg-[#143144] border border-[#17384e] text-slate-200 transition-all group shadow-sm"
            >
              <Briefcase className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-100">Company Owner</span>
              <span className="text-[10px] text-slate-400">Nova Robotics</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Don't have an approved company?{' '}
            <a
              href="https://projectx.io/register"
              onClick={(e) => {
                e.preventDefault();
                error('Onboarding takes place on the separate public Project X Website.');
              }}
              className="text-teal-400 font-semibold hover:underline"
            >
              Register on Website
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
