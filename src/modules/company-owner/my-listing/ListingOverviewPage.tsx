import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Modal } from '../../../shared/components/ui/Modal';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { Compass, Eye, ShieldCheck, Sparkles, ExternalLink, Globe, MapPin } from 'lucide-react';

export const ListingOverviewPage: React.FC = () => {
  const { companies } = useCompanies();
  const { user } = useAuth();

  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'public' | 'member'>('public');

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Public Listing & Ecosystem Visibility"
        subtitle="Manage how prospective clients, investors, and platform members discover your verified company."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'My Listing' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreviewMode('member');
                setIsPreviewOpen(true);
              }}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Member Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setPreviewMode('public');
                setIsPreviewOpen(true);
              }}
              leftIcon={<Globe className="w-3.5 h-3.5" />}
            >
              Public Directory Preview
            </Button>
          </div>
        }
      />

      {/* Listing Status Hero */}
      <Card className="bg-gradient-to-r from-teal-500/10 via-[#0c2130] to-cyan-500/10 border-[#17384e] shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold text-slate-100 font-heading">Listing Status: Active & Indexed</h3>
                  <StatusBadge status={myCompany?.listingStatus || 'ACTIVE'} />
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Your company is ranked in the <strong className="text-teal-400">{myCompany?.industry}</strong> ecosystem category with verified accreditation.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Monthly Inquiries</span>
              <span className="text-2xl font-bold font-heading text-slate-100">{myCompany?.listingViews.toLocaleString()} views</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Visibility Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0c2130] border-[#17384e]">
          <CardHeader title="Search Engine & Directory Metadata" />
          <CardBody className="space-y-3 text-xs">
            <div className="p-3 bg-[#091b27] rounded-xl border border-[#17384e] space-y-1">
              <span className="text-slate-400 font-medium block">Public Search Title:</span>
              <span className="font-semibold text-slate-200">{myCompany?.name} — Verified {myCompany?.industry} Solutions</span>
            </div>
            <div className="p-3 bg-[#091b27] rounded-xl border border-[#17384e] space-y-1">
              <span className="text-slate-400 font-medium block">Category Indexing:</span>
              <span className="font-semibold text-teal-400">{myCompany?.industry}</span>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-[#0c2130] border-[#17384e]">
          <CardHeader title="Live Listing Features" />
          <CardBody className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Project X Verified Trust Badge Active</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#091b27] border border-[#17384e]">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Featured in AI & Robotics Category Recommendations</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={previewMode === 'public' ? 'Live Public Website Directory Preview' : 'Authenticated Member Portal Preview'}
          subtitle={`Render simulation for ${myCompany?.name}`}
          size="xl"
        >
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 via-[#0c2130] to-cyan-500/10 border border-[#17384e] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#091b27] border border-teal-500/30 shadow-sm flex items-center justify-center font-bold text-teal-400 text-xl">
                  {myCompany?.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-100 font-heading">{myCompany?.name}</h3>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-teal-400 font-medium mt-0.5">
                    {myCompany?.industry} • {myCompany?.headquarters}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#091b27] p-5 rounded-2xl border border-[#17384e] space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entity Overview</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{myCompany?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#091b27] p-4 rounded-2xl border border-[#17384e]">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Products</h4>
                <div className="flex flex-wrap gap-1.5">
                  {myCompany?.products.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-xs font-medium border border-teal-500/20">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#091b27] p-4 rounded-2xl border border-[#17384e]">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {myCompany?.technologies.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs font-medium border border-cyan-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
