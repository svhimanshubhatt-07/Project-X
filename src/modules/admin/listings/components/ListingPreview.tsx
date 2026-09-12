import React from 'react';
import { Modal } from '../../../../shared/components/ui/Modal';
import { CompanyRecord } from '../../../../shared/services/mockDataStore';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Globe, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export interface ListingPreviewProps {
  company: CompanyRecord | null;
  onClose: () => void;
}

export const ListingPreview: React.FC<ListingPreviewProps> = ({ company, onClose }) => {
  if (!company) return null;

  return (
    <Modal
      isOpen={!!company}
      onClose={onClose}
      title="Public Company Listing Preview"
      subtitle="Visualizing how this verified presence appears on the Project X public directory."
      size="xl"
      footer={
        <div className="flex justify-end w-full">
          <Button variant="secondary" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Mock Public Listing Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 via-[#0c2130] to-cyan-500/10 border border-[#17384e] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#091b27] border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-xl shadow-xs">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-100 font-heading">{company.name}</h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-teal-400 font-medium mt-0.5">
                  {company.industry} • {company.headquarters.split(',')[0]}
                </p>
              </div>
            </div>

            <StatusBadge status={company.listingStatus} />
          </div>
        </div>

        {/* Company Bio */}
        <div className="bg-[#091b27] p-5 rounded-2xl border border-[#17384e] space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">About Entity</h4>
          <p className="text-sm text-slate-200 leading-relaxed">{company.description}</p>
        </div>

        {/* Products & Tech */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#091b27] p-4 rounded-2xl border border-[#17384e]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Products</h4>
            <div className="flex flex-wrap gap-1.5">
              {company.products.map((p, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-xs font-medium border border-teal-500/20">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#091b27] p-4 rounded-2xl border border-[#17384e]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-1.5">
              {company.technologies.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs font-medium border border-cyan-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
