import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { CheckCircle2, AlertCircle, FileCheck, ShieldCheck } from 'lucide-react';
import { Badge } from '../../../../shared/components/ui/Badge';

export const GSTInformationReview: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const { gstInfo } = application;

  return (
    <div className="space-y-6">
      <Card className="bg-[#0c2130] border-[#17384e]">
        <CardHeader
          title="Taxation & Regulatory Identifiers"
          subtitle="Goods and Services Tax (GSTIN), Corporate Identity (CIN), and Permanent Account Number (PAN)."
        />
        <CardBody className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#091b27] border border-[#17384e]">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  gstInfo.isVerified
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {gstInfo.isVerified ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100">
                  {gstInfo.isVerified
                    ? 'Government Registry Match Confirmed'
                    : 'Pending Admin Cross-Verification'}
                </h4>
                <p className="text-xs text-slate-400">
                  {gstInfo.isVerified
                    ? 'GSTIN & MCA records validated against national portal.'
                    : 'Awaiting reviewer confirmation.'}
                </p>
              </div>
            </div>

            <Badge variant={gstInfo.isVerified ? 'success' : 'warning'}>
              {gstInfo.isVerified ? 'ACTIVE & VERIFIED' : 'PENDING CHECK'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium block">GSTIN Number</span>
              <div className="font-mono text-xs font-bold text-slate-200 bg-[#091b27] p-3 rounded-xl border border-[#17384e] mt-1">
                {gstInfo.gstNumber || 'Not Applicable'}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">Corporate Identity (CIN)</span>
              <div className="font-mono text-xs font-bold text-teal-400 bg-[#091b27] p-3 rounded-xl border border-[#17384e] mt-1">
                {gstInfo.cinNumber || 'Not Applicable'}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">PAN Identifier</span>
              <div className="font-mono text-xs font-bold text-slate-200 bg-[#091b27] p-3 rounded-xl border border-[#17384e] mt-1">
                {gstInfo.panNumber || 'Not Applicable'}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
