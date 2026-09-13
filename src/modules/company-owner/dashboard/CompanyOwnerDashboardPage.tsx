import React, { useState, useMemo } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Compass,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Eye,
  Award,
} from 'lucide-react';

interface ChartDataPoint {
  label: string;
  views: number;
}

const TIMEFRAME_DATA: Record<string, { points: ChartDataPoint[]; maxViews: number }> = {
  '7D': {
    maxViews: 1200,
    points: [
      { label: 'Mon', views: 0 },
      { label: 'Tue', views: 240 },
      { label: 'Wed', views: 520 },
      { label: 'Thu', views: 460 },
      { label: 'Fri', views: 1150 },
      { label: 'Sat', views: 420 },
      { label: 'Sun', views: 0 },
    ],
  },
  '30D': {
    maxViews: 6000,
    points: [
      { label: 'Week 1', views: 0 },
      { label: 'Week 2', views: 1800 },
      { label: 'Week 3', views: 3400 },
      { label: 'Week 4', views: 0 },
    ],
  },
  '90D': {
    maxViews: 18000,
    points: [
      { label: 'Month 1', views: 0 },
      { label: 'Month 2', views: 8800 },
      { label: 'Month 3', views: 0 },
    ],
  },
};

export const CompanyOwnerDashboardPage: React.FC = () => {
  const { companies } = useCompanies();
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  // Load the company associated with this owner
  const myCompany = companies.find((c) => c.id === user?.companyId) || companies[0];

  // Chart State
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // Assign Manager Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerRole, setManagerRole] = useState('OPERATIONS_MANAGER');

  const handleAssignManager = (e: React.FormEvent) => {
    e.preventDefault();
    success(`Manager delegation invitation sent to ${managerName} (${managerEmail}).`, 'Manager Assigned');
    setIsAssignModalOpen(false);
    setManagerName('');
    setManagerEmail('');
  };

  // Generate SVG Path for Area & Line Chart
  const activeData = TIMEFRAME_DATA[timeframe];
  const chartWidth = 600;
  const chartHeight = 200;
  const paddingX = 20;
  const { maxViews } = activeData;

  const points = useMemo(() => {
    const baselineY = chartHeight - 2;
    const topY = 16;

    return activeData.points.map((p, idx) => {
      const x = paddingX + (idx / (activeData.points.length - 1)) * (chartWidth - paddingX * 2);
      const y = baselineY - (p.views / maxViews) * (baselineY - topY);
      return { x, y, data: p };
    });
  }, [activeData, maxViews]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const baselineY = chartHeight;
    return `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;
  }, [linePath, points]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-heading">
            Welcome back, {user?.name?.split(' ')[0] ? `${user.name.split(' ')[0]}` : 'Dr.'}
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Managing verified corporate presence for {myCompany?.name || 'Nova Robotics & Aerospace AI'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_LISTING)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#111827] border border-[#273244] hover:bg-[#1F2937] hover:border-[#3B82F6]/50 transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Preview My Listing</span>
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#2B78F6] to-[#162C58] hover:from-[#448CFC] hover:to-[#223E75] border border-blue-400/20 transition-all shadow-md shadow-blue-500/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Assign a Manager</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Compliance Status */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 flex items-center gap-4 transition-all hover:border-[#273244]">
          <div className="w-12 h-12 rounded-2xl bg-[#092626] border border-[#14b8a6]/25 flex items-center justify-center text-[#10B981] shadow-inner shrink-0">
            <ShieldCheck className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase">
              COMPLIANCE STATUS
            </div>
            <div className="text-xl font-black text-white font-heading mt-0.5 tracking-tight">
              VERIFIED
            </div>
          </div>
        </div>

        {/* Card 2: Directory Exposure */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_LISTING)}
          className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:border-[#273244]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0e223d] border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] shadow-inner shrink-0">
            <Compass className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase">
              DIRECTORY EXPOSURE
            </div>
            <div className="text-xl font-black text-white font-heading mt-0.5 tracking-tight">
              ACTIVE
            </div>
          </div>
        </div>

        {/* Card 3: Profile Strength */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY)}
          className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:border-[#273244]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#082a2a] border border-[#14B8A6]/25 flex items-center justify-center text-[#14B8A6] shadow-inner shrink-0">
            <Award className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase">
              PROFILE STRENGTH
            </div>
            <div className="text-xl font-black text-white font-heading mt-0.5 tracking-tight">
              {myCompany?.profileCompletion || 92}%
            </div>
          </div>
        </div>

        {/* Card 4: Discovery Views */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.ANALYTICS)}
          className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all hover:border-[#273244]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#23153c] border border-[#8B5CF6]/25 flex items-center justify-center text-[#8B5CF6] shadow-inner shrink-0">
            <Eye className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9CA3AF] tracking-wider uppercase">
              DISCOVERY VIEWS
            </div>
            <div className="text-xl font-black text-white font-heading mt-0.5 tracking-tight">
              {myCompany?.profileViews?.toLocaleString() || '14,850'}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile & Discovery Traffic Analytics (8 cols) */}
        <div className="lg:col-span-8 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-heading">
                    Profile & Discovery Traffic Analytics
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#172554] text-[#60A5FA] border border-[#1E3A8A]">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  B2B buyer visits, corporate searches, and direct contact inquiries.
                </p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center p-1 rounded-xl bg-[#0B0F14] border border-[#1F2937] self-start sm:self-auto">
                {(['7D', '30D', '90D'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoveredPoint(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      timeframe === tf
                        ? 'bg-[#3B82F6] text-white shadow'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Spline Area Chart */}
            <div className="relative w-full h-[220px] flex items-center justify-center mt-2">
              {/* Horizontal Grid lines aligned across full container height */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full border-b border-[#1F2937]" />
                ))}
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="ownerAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                    <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="ownerGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Area Fill */}
                <path d={areaPath} fill="url(#ownerAreaGradient)" />

                {/* Main Curve Stroke */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#ownerGlow)"
                />

                {/* Interactive Nodes & Tooltip Trigger */}
                {points.map((pt, idx) => (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint?.label === pt.data.label ? '6.5' : '4.5'}
                      fill="#0B0F14"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="18"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(pt.data)}
                    />
                  </g>
                ))}
              </svg>

              {/* Floating Interactive Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-2 right-4 bg-[#1F2937]/95 border border-[#3B82F6]/50 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn z-10 pointer-events-none">
                  <div className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-wider">
                    {hoveredPoint.label}
                  </div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {hoveredPoint.views.toLocaleString()} Views
                  </div>
                </div>
              )}
            </div>

            {/* X Axis Labels placed immediately under chart */}
            <div className="flex justify-between items-center px-4 mt-3 text-xs font-semibold text-[#9CA3AF]">
              {activeData.points.map((p, idx) => (
                <span
                  key={idx}
                  className={`transition-colors ${
                    hoveredPoint?.label === p.label ? 'text-[#3B82F6] font-bold' : ''
                  }`}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Optimization Checklist (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Profile Optimization Checklist
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Actions to increase verified B2B lead generation by up to 3.5x.
            </p>

            <div className="space-y-3.5 mt-5">
              {/* Item 1: Add Product Video Demos */}
              <div className="p-4 rounded-xl bg-[#0B0F14] border border-[#EC4899]/30 space-y-1 hover:border-[#EC4899]/60 transition-all">
                <div className="flex items-center gap-2 text-xs font-bold text-[#EC4899]">
                  <Sparkles className="w-4 h-4 text-[#EC4899]" />
                  <span>Add Product Video Demos</span>
                </div>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Companies with video product walkthroughs gain 3.4x more executive buyer engagements.
                </p>
              </div>

              {/* Item 2: ISO & Patent Badges Verified */}
              <div className="p-4 rounded-xl bg-[#0B0F14] border border-[#22C55E]/30 space-y-1 hover:border-[#22C55E]/60 transition-all">
                <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>ISO & Patent Badges Verified</span>
                </div>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Your ISO certification and patent portfolio badges are prominently highlighted on your profile.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1F2937] hover:bg-[#273244] border border-[#273244] transition-all"
          >
            <span>Manage Full Profile & Media</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
        </div>
      </div>

      {/* Bottom Row: 3 Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Company Documents */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.DOCUMENTS)}
          className="bg-[#111827] border border-[#1F2937] hover:border-[#273244] rounded-2xl p-6 cursor-pointer transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0e223d] border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] mb-3 shadow-inner">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-heading">Company Documents</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Access verified MCA certificates, tax documents, and corporate resolutions.
          </p>
        </div>

        {/* Card 2: Onboarding Timeline */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.ONBOARDING_HISTORY)}
          className="bg-[#111827] border border-[#1F2937] hover:border-[#273244] rounded-2xl p-6 cursor-pointer transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0e223d] border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] mb-3 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-heading">Onboarding Timeline</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Inspect your verified onboarding journey, past review feedback, and milestones.
          </p>
        </div>

        {/* Card 3: Discover Ecosystem */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES)}
          className="bg-[#111827] border border-[#1F2937] hover:border-[#273244] rounded-2xl p-6 cursor-pointer transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0e223d] border border-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] mb-3 shadow-inner">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-heading">Discover Ecosystem</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Explore verified technology innovators, potential enterprise partners, and peers.
          </p>
        </div>
      </div>

      {/* Assign a Manager Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign & Delegate Company Manager"
      >
        <form onSubmit={handleAssignManager} className="space-y-4">
          <Input
            label="Manager Full Name"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="e.g. Vikram Sharma"
            required
          />

          <Input
            label="Manager Official Email"
            type="email"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            placeholder="manager@novasystems.io"
            required
          />

          <Select
            label="Assigned Manager Role & Authority"
            value={managerRole}
            onChange={(val) => setManagerRole(val)}
            options={[
              { value: 'OPERATIONS_MANAGER', label: 'Operations Manager (Profile & Listing Editing)' },
              { value: 'COMPLIANCE_MANAGER', label: 'Compliance & Document Manager' },
              { value: 'TECHNICAL_LEAD', label: 'Technical & Product Catalog Lead' },
            ]}
          />

          <div className="p-3.5 rounded-xl bg-[#0B0F14] border border-[#1F2937] flex items-center gap-3 text-xs text-[#9CA3AF]">
            <ShieldCheck className="w-5 h-5 text-[#14B8A6] shrink-0" />
            <span>
              The assigned manager will receive platform invitation credentials to co-manage company assets under your ownership.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#1F2937]">
            <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
              Send Manager Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

