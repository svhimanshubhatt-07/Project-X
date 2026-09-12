import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { Select } from '../../../shared/components/ui/Select';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useToast } from '../../../app/providers/ToastProvider';
import { ArrowLeft, Save } from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes.constants';

export const EditCompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById, updateCompany } = useCompanies();
  const { success, error } = useToast();

  const company = id ? getCompanyById(id) : undefined;

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    industry: '',
    companySize: '',
    headquarters: '',
    foundedYear: 2023,
    website: '',
    email: '',
    phone: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        legalName: company.legalName,
        industry: company.industry,
        companySize: company.companySize,
        headquarters: company.headquarters,
        foundedYear: company.foundedYear,
        website: company.website,
        email: company.email,
        phone: company.phone,
        description: company.description,
      });
    }
  }, [company]);

  if (!company) {
    return (
      <div className="p-12 text-center">
        <h2>Company Not Found</h2>
        <Button onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}>Back to Companies</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      updateCompany(company.id, formData);
      setIsLoading(false);
      success(`Changes for ${formData.name} saved successfully.`);
      navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id));
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id))}
        leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        className="text-xs text-slate-500 hover:text-slate-800 -mb-2"
      >
        Back to Company Details
      </Button>

      <PageHeader
        title={`Edit Company: ${company.name}`}
        subtitle="Modify authorized enterprise entity information."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader title="Basic Entity Profile" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Public Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Legal Entity Name"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                options={[
                  { label: 'Robotics & AI', value: 'Robotics & AI' },
                  { label: 'Cloud Infrastructure', value: 'Cloud Infrastructure' },
                  { label: 'Semiconductors & Hardware', value: 'Semiconductors & Hardware' },
                  { label: 'CleanTech & Energy', value: 'CleanTech & Energy' },
                  { label: 'Logistics & Supply Chain', value: 'Logistics & Supply Chain' },
                ]}
              />

              <Select
                label="Company Size"
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                options={[
                  { label: '1-10 Employees', value: '1-10 Employees' },
                  { label: '11-50 Employees', value: '11-50 Employees' },
                  { label: '51-200 Employees', value: '51-200 Employees' },
                  { label: '201-500 Employees', value: '201-500 Employees' },
                  { label: '500+ Employees', value: '500+ Employees' },
                ]}
              />

              <Input
                label="Founded Year"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => setFormData({ ...formData, foundedYear: Number(e.target.value) })}
                required
              />
            </div>

            <Textarea
              label="Executive Bio & Overview"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Contact & Digital Endpoints" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Corporate Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                required
              />
              <Input
                label="Official Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Contact Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <Input
              label="Headquarters Address"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              required
            />
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id))}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
