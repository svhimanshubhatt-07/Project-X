import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { ArrowLeft, Building2, Globe, Mail, Phone, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes.constants';

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById } = useCompanies();

  const company = id ? getCompanyById(id) : undefined;

  if (!company) {
    return (
      <div className="p-12 text-center">
        <h2>Company Not Found</h2>
        <Button onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES)}>
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES)}
        leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        className="text-xs text-slate-500 hover:text-slate-800 -mb-2"
      >
        Back to Ecosystem Directory
      </Button>

      {/* Hero Header */}
      <Card className="bg-gradient-to-r from-teal-500/10 via-[#0c2130] to-cyan-500/10 border-[#17384e] shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 p-[2px] shrink-0 shadow-md">
                <div className="w-full h-full bg-[#091b27] rounded-[14px] flex items-center justify-center font-bold text-teal-400 text-xl">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-heading">
                    {company.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <StatusBadge status="VERIFIED" />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                  <span>Industry: <strong className="text-slate-200">{company.industry}</strong></span>
                  <span>•</span>
                  <span>Scale: <strong className="text-slate-200">{company.companySize}</strong></span>
                  <span>•</span>
                  <span>Headquarters: <strong className="text-slate-200">{company.headquarters.split(',')[0]}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Overview & Tech */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0c2130] border-[#17384e]">
            <CardHeader title="Company Bio" />
            <CardBody>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#091b27] p-4 rounded-xl border border-[#17384e]">
                {company.description}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-[#0c2130] border-[#17384e]">
            <CardHeader title="Products & Technologies" />
            <CardBody className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Key Products</span>
                <div className="flex flex-wrap gap-2">
                  {company.products.map((p, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-xs font-semibold text-teal-300 border border-teal-500/20">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Engineering Tech Stack</span>
                <div className="flex flex-wrap gap-2">
                  {company.technologies.map((t, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-xs font-semibold text-cyan-300 border border-cyan-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card className="bg-[#0c2130] border-[#17384e]">
            <CardHeader title="Public Contact Endpoints" />
            <CardBody className="space-y-4 text-xs">
              <div className="bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                <span className="text-slate-400 block font-medium">Corporate Website:</span>
                <a href={company.website} target="_blank" rel="noreferrer" className="text-teal-400 font-semibold hover:underline mt-1 block truncate">
                  {company.website}
                </a>
              </div>
              <div className="bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                <span className="text-slate-400 block font-medium">Official Inquiries:</span>
                <span className="text-slate-200 font-semibold mt-1 block">{company.email}</span>
              </div>
              <div className="bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                <span className="text-slate-400 block font-medium">Headquarters:</span>
                <span className="text-slate-200 mt-1 block">{company.headquarters}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
