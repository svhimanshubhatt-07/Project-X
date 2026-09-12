import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { ShieldCheck, Scale, FileText, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '../../../../shared/utils/formatDate';

export const LegalInformationReview: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const { legalInfo } = application;

  return (
    <div className="space-y-6">
      <Card className="bg-[#0c2130] border-[#17384e]">
        <CardHeader
          title="Legal Entity & Corporate Registration"
          subtitle="Registered company name, registration numbers, and official jurisdiction."
        />
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <span className="text-xs text-slate-400 font-medium block">Registered Legal Name</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-bold text-slate-100 font-heading">
                <Scale className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{legalInfo.legalName}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Registration Type</span>
              <span className="inline-block mt-1 px-3 py-1 bg-[#091b27] text-xs font-semibold text-slate-300 rounded-lg border border-[#17384e]">
                {legalInfo.registrationType}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Incorporation / Registration No.</span>
              <div className="flex items-center gap-2 mt-1 font-mono text-xs font-bold text-teal-400 bg-[#091b27] p-2.5 rounded-xl border border-[#17384e]">
                <FileText className="w-4 h-4" />
                <span>{legalInfo.registrationNumber}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Incorporation Date</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{formatDate(legalInfo.incorporationDate)}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Jurisdiction Country</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <span>🇮🇳 {legalInfo.country}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#17384e]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Registered Office Address
            </span>
            <div className="flex items-start gap-2.5 bg-[#091b27] p-4 rounded-xl border border-[#17384e] text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium leading-relaxed">{legalInfo.registeredAddress}</p>
                <p className="text-slate-400 mt-1">
                  {legalInfo.city}, {legalInfo.state} — {legalInfo.postalCode}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
