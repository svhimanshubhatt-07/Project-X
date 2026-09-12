import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout/AuthLayout';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { useToast } from '../../../app/providers/ToastProvider';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      success('Password reset instructions have been sent to your email.');
    }, 600);
  };

  return (
    <AuthLayout>
      <div className="w-full bg-[#0c2130] border border-[#17384e] rounded-3xl p-8 sm:p-10 shadow-2xl animate-fadeIn">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">Check Your Inbox</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              We've dispatched a secure recovery link to <span className="text-slate-200 font-semibold">{email}</span>.
            </p>
            <Link to={ROUTES.AUTH.LOGIN}>
              <Button variant="secondary" className="w-full mt-4">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100 font-heading">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1.5">
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>

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

              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>
            </form>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
