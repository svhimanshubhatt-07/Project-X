import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { Globe, Mail, Phone, MapPin, Calendar, Building2 } from 'lucide-react';

export const CompanyInformationReview: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const { companyInfo } = application;

  return (
    <div className="space-y-6">
      <Card className="bg-[#0c2130] border-[#17384e]">
        <CardHeader
          title="Company Identity & Digital Presence"
          subtitle="Primary brand, operational scope, and corporate headquarters."
        />
        <CardBody className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Executive Description
            </span>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#091b27] p-4 rounded-xl border border-[#17384e]">
              {companyInfo.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Founded Year</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>{companyInfo.foundedYear}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Organization Scale</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>{companyInfo.companySize}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Corporate Website</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200 truncate">
                <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href={companyInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:underline truncate"
                >
                  {companyInfo.website}
                </a>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Official Business Email</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{companyInfo.businessEmail}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Headquarters Contact</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{companyInfo.businessPhone}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Primary Headquarters</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>{companyInfo.headquarters}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Operational Locations & Global Branches
            </span>
            <div className="flex flex-wrap gap-2">
              {companyInfo.locations.map((loc, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#091b27] text-xs font-medium text-slate-300 border border-[#17384e]"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
