import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useToast } from '../../../app/providers/ToastProvider';
import { ArrowLeft, Save, Building2, Globe, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes.constants';

export const EditCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { companies, updateCompany } = useCompanies();
  const { user } = useAuth();
  const { success } = useToast();

  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];

  const [formData, setFormData] = useState({
    name: '',
    headquarters: '',
    website: '',
    email: '',
    phone: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (myCompany) {
      setFormData({
        name: myCompany.name,
        headquarters: myCompany.headquarters,
        website: myCompany.website,
        email: myCompany.email,
        phone: myCompany.phone,
        description: myCompany.description,
      });
    }
  }, [myCompany]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myCompany) return;
    setIsLoading(true);
    setTimeout(() => {
      updateCompany(myCompany.id, formData);
      setIsLoading(false);
      success('Your company profile was updated successfully.', 'Profile Updated');
      navigate(ROUTES.COMPANY_OWNER.MY_COMPANY);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY)}
        leftIcon={<ArrowLeft className="w-3.5 h-3.5 text-teal-400" />}
        className="text-xs text-slate-300 hover:text-white -mb-2"
      >
        Back to Verified Profile
      </Button>

      <PageHeader
        title="Edit Corporate Information"
        subtitle="Update corporate executive descriptions, operating headquarters, and verified website contact channels."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
          <div className="p-5 border-b border-[#143144] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            <h3 className="text-base font-bold text-white font-heading">General Brand Presence</h3>
          </div>
          <CardBody className="p-6 space-y-4">
            <Input
              label="Company Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Textarea
              label="Company Overview & Bio"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </CardBody>
        </Card>

        <Card className="bg-[#0c2130] border-[#17384e] shadow-xl">
          <div className="p-5 border-b border-[#143144] flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-heading">Digital & Location Endpoints</h3>
          </div>
          <CardBody className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Official Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                required
              />
              <Input
                label="Inquiries Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Business Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <Input
              label="Headquarters Location"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              required
            />
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
