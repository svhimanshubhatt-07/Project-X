import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { UserCheck, Mail, Phone, Briefcase, Award } from 'lucide-react';
import { Avatar } from '../../../../shared/components/ui/Avatar';

export const RepresentativeReview: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const { representative } = application;

  return (
    <div className="space-y-6">
      <Card className="bg-[#0c2130] border-[#17384e]">
        <CardHeader
          title="Authorized Company Representative"
          subtitle="Person authorized to represent the entity and receive platform management credentials."
        />
        <CardBody className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#091b27] border border-[#17384e]">
            <Avatar name={representative.fullName} size="lg" />
            <div>
              <h3 className="text-base font-bold text-slate-100 font-heading">{representative.fullName}</h3>
              <p className="text-xs text-teal-400 font-medium mt-0.5">{representative.designation}</p>
              <p className="text-xs text-slate-400 mt-1">{representative.relationship}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Business Email Address</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200 bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{representative.email}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Direct Contact Phone</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200 bg-[#091b27] p-3 rounded-xl border border-[#17384e]">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{representative.phone}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
