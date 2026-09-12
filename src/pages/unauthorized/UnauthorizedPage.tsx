import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { useAuth } from '../../features/authentication/hooks/useAuth';
import { ROLES } from '../../shared/constants/roles.constants';
import { ROUTES } from '../../shared/constants/routes.constants';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user?.role === ROLES.ADMIN) {
      navigate(ROUTES.ADMIN.DASHBOARD);
    } else if (user?.role === ROLES.COMPANY_OWNER) {
      navigate(ROUTES.COMPANY_OWNER.DASHBOARD);
    } else {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <div className="min-h-screen bg-[#06131c] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-[#0c2130] border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold font-heading text-slate-100">Access Restricted</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          You do not have the required security permissions or role clearance to access this module.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleReturn}
            leftIcon={<Home className="w-4 h-4" />}
          >
            My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
