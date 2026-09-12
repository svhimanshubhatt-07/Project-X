import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { useAuth } from '../../features/authentication/hooks/useAuth';
import { ROLES } from '../../shared/constants/roles.constants';
import { ROUTES } from '../../shared/constants/routes.constants';

export const NotFoundPage: React.FC = () => {
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
      <div className="max-w-md w-full text-center bg-[#0c2130] border border-[#17384e] rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-6">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <h1 className="text-3xl font-extrabold font-heading text-slate-100">404</h1>
        <h2 className="text-base font-semibold text-slate-200 mt-1">Page Not Found</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          The dashboard URL or resource you requested could not be located.
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
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
