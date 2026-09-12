import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { Layers, Cpu, Target, PackageCheck } from 'lucide-react';

export const BusinessInformationReview: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const { businessInfo } = application;

  return (
    <div className="space-y-6">
      <Card className="bg-[#0c2130] border-[#17384e]">
        <CardHeader
          title="Business Model & Core Offerings"
          subtitle="Revenue model, product catalog, services, and proprietary technology stack."
        />
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Business Operating Model</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>{businessInfo.businessModel}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Target Customer Market</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-200">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>{businessInfo.targetMarket}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Key Proprietary Products
            </span>
            <div className="flex flex-wrap gap-2">
              {businessInfo.products.map((prod, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-xs font-semibold text-teal-300 border border-teal-500/20 flex items-center gap-1.5"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  {prod}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Enterprise Services & Solutions
            </span>
            <div className="flex flex-wrap gap-2">
              {businessInfo.services.map((serv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#091b27] text-xs font-medium text-slate-300 border border-[#17384e]"
                >
                  {serv}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Technology Stack & Architecture
            </span>
            <div className="flex flex-wrap gap-2">
              {businessInfo.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-xs font-semibold text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
