import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes.constants';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Building2,
  Compass,
  CheckCircle2,
  Eye,
  TrendingUp,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  UserPlus,
  Users,
  Activity,
  ArrowUpRight,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

interface ChartDataPoint {
  label: string;
  views: number;
  inquiries: number;
}

const TIMEFRAME_DATA: Record<string, { points: ChartDataPoint[]; totalViews: string; totalInquiries: string; growth: string }> = {
  '7D': {
    points: [
      { label: 'Mon', views: 520, inquiries: 14 },
      { label: 'Tue', views: 680, inquiries: 22 },
      { label: 'Wed', views: 890, inquiries: 31 },
      { label: 'Thu', views: 820, inquiries: 28 },
      { label: 'Fri', views: 1150, inquiries: 42 },
      { label: 'Sat', views: 760, inquiries: 20 },
      { label: 'Sun', views: 620, inquiries: 16 },
    ],
    totalViews: '5,440',
    totalInquiries: '173',
    growth: '+18.4%',
  },
  '30D': {
    points: [
      { label: 'Week 1', views: 3200, inquiries: 95 },
      { label: 'Week 2', views: 3850, inquiries: 124 },
      { label: 'Week 3', views: 4420, inquiries: 162 },
      { label: 'Week 4', views: 5440, inquiries: 198 },
    ],
    totalViews: '16,910',
    totalInquiries: '579',
    growth: '+24.8%',
  },
  '90D': {
    points: [
      { label: 'Dec 2025', views: 9800, inquiries: 310 },
      { label: 'Jan 2026', views: 12400, inquiries: 420 },
      { label: 'Feb 2026', views: 16910, inquiries: 579 },
    ],
    totalViews: '39,110',
    totalInquiries: '1,309',
    growth: '+36.2%',
  },
};

export const CompanyOwnerDashboardPage: React.FC = () => {
  const { companies } = useCompanies();
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  // Load the company associated with this owner (default to Nova Robotics)
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
    success(`Manager delegation packet generated for ${managerName} (${managerEmail}).`, 'Manager Assigned');
    setIsAssignModalOpen(false);
    setManagerName('');
    setManagerEmail('');
  };

  // Generate SVG Path for Area & Line Chart
  const activeData = TIMEFRAME_DATA[timeframe];
  const chartWidth = 600;
  const chartHeight = 180;
  const maxViews = Math.max(...activeData.points.map((p) => p.views)) * 1.15;

  const points = useMemo(() => {
    return activeData.points.map((p, idx) => {
      const x = (idx / (activeData.points.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - (p.views / maxViews) * (chartHeight - 40) - 20;
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
    return `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
  }, [linePath, points]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0] || 'Partner'}`}
        subtitle={`Managing verified corporate presence for ${myCompany?.name}.`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_LISTING)}
              leftIcon={<Compass className="w-3.5 h-3.5 text-teal-400" />}
            >
              Preview My Listing
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAssignModalOpen(true)}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Assign a Manager
            </Button>
          </div>
        }
      />

      {/* Modern Top Hero Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Verification Status */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b from-[#0c2637] to-[#081b28] border border-[#173d56] shadow-xl hover:border-emerald-500/40 transition-all group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Status</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight">VERIFIED</h3>
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#14334a] text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> MCA & ROC Approved
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Tier 1 Clearance</span>
          </div>
        </div>

        {/* Card 2: Directory Listing */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_LISTING)}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b from-[#0c2637] to-[#081b28] border border-[#173d56] shadow-xl hover:border-teal-500/40 transition-all group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Directory Exposure</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight">
              {myCompany?.listingStatus || 'ACTIVE'}
            </h3>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#14334a] text-xs">
            <span className="text-teal-300 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-teal-400" /> Live on Public Index
            </span>
            <span className="text-[10px] text-slate-400">DeepTech Hub</span>
          </div>
        </div>

        {/* Card 3: Profile Health & Completion */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY)}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b from-[#0c2637] to-[#081b28] border border-[#173d56] shadow-xl hover:border-cyan-500/40 transition-all group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Strength</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight">
              {myCompany?.profileCompletion || 92}%
            </h3>
            {/* Radial Progress Ring */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#14334a]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400"
                  strokeDasharray={`${myCompany?.profileCompletion || 92}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#14334a] text-xs">
            <span className="text-cyan-300 font-semibold">High Confidence Score</span>
            <span className="text-[10px] text-slate-400">4/4 Steps Done</span>
          </div>
        </div>

        {/* Card 4: Monthly Profile Views */}
        <div
          onClick={() => navigate(ROUTES.COMPANY_OWNER.ANALYTICS)}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b from-[#0c2637] to-[#081b28] border border-[#173d56] shadow-xl hover:border-purple-500/40 transition-all group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Discovery Views</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight">
              {myCompany?.profileViews.toLocaleString() || '14,850'}
            </h3>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> +24.5%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#14334a] text-xs">
            <span className="text-slate-300 font-medium">B2B Buyer Impressions</span>
            <span className="text-[10px] text-purple-400 font-semibold">Top 5% in AI</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Advanced Interactive Spline Chart & Optimization Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Engagement Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl overflow-hidden">
            <div className="p-5 border-b border-[var(--border-divider)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-heading">
                    Profile & Discovery Traffic Analytics
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[var(--brand-primary)] border border-emerald-500/30">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  B2B buyer visits, corporate searches, and direct contact inquiries.
                </p>
              </div>

              {/* Timeframe Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                {(['7D', '30D', '90D'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoveredPoint(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      timeframe === tf
                        ? 'bg-[var(--brand-primary)] text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <CardBody className="p-6">
              {/* Key Metric Badges */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-slate-400 block font-medium">Period Views</span>
                  <div className="text-lg font-bold text-slate-100 font-heading mt-0.5">{activeData.totalViews}</div>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> {activeData.growth}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-slate-400 block font-medium">Verified Inquiries</span>
                  <div className="text-lg font-bold text-emerald-300 font-heading mt-0.5">{activeData.totalInquiries}</div>
                  <span className="text-[10px] text-[var(--brand-primary)] font-medium mt-0.5 block">High Intent Leads</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-slate-400 block font-medium">Avg. Engagement CTR</span>
                  <div className="text-lg font-bold text-cyan-300 font-heading mt-0.5">3.8%</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Sector Avg: 2.1%</span>
                </div>
              </div>

              {/* Smooth Spline SVG Area Chart */}
              <div className="relative w-full h-[200px] flex items-center justify-center">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e599" stopOpacity="0.38" />
                      <stop offset="60%" stopColor="#0891b2" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00e599" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {/* Horizontal Guide Grid Lines */}
                  {[0.25, 0.5, 0.75].map((ratio, i) => (
                    <line
                      key={i}
                      x1="20"
                      y1={chartHeight * ratio}
                      x2={chartWidth - 20}
                      y2={chartHeight * ratio}
                      stroke="var(--border-divider)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area Fill */}
                  <path d={areaPath} fill="url(#areaGradient)" />

                  {/* Main Curve Stroke */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#00e599"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  {/* Interactive Nodes & Tooltip Trigger */}
                  {points.map((pt, idx) => (
                    <g key={idx} className="cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredPoint?.label === pt.data.label ? '7' : '4.5'}
                        fill="#041914"
                        stroke="#00e599"
                        strokeWidth="2.5"
                        className="transition-all duration-150"
                      />
                      {/* Invisible hover hotspot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="20"
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint(pt.data)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Floating Interactive Tooltip */}
                {hoveredPoint && (
                  <div className="absolute top-2 right-4 bg-[var(--bg-card-inner)]/95 border border-[var(--brand-primary)]/50 p-3 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn z-10 pointer-events-none">
                    <div className="text-[11px] font-bold text-[var(--brand-primary)] uppercase tracking-wider">
                      {hoveredPoint.label}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-white font-mono">{hoveredPoint.views} Views</span>
                      <span className="text-xs text-cyan-300 font-medium">({hoveredPoint.inquiries} inquiries)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between items-center px-4 pt-3 border-t border-[var(--border-divider)] text-xs font-semibold text-slate-400">
                {activeData.points.map((p, idx) => (
                  <span
                    key={idx}
                    className={`transition-colors ${
                      hoveredPoint?.label === p.label ? 'text-[var(--brand-primary)] font-bold' : ''
                    }`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Actionable Suggestions & Growth Highlights */}
        <div>
          <Card className="h-full flex flex-col justify-between bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl">
            <CardHeader
              title="Profile Optimization Checklist"
              subtitle="Actions to increase verified B2B lead generation by up to 3.5x."
            />
            <CardBody className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-primary)]">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Add Product Video Demos</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Companies with video product walkthroughs gain 3.4x more executive buyer engagements.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ISO & Patent Badges Verified</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Your ISO certification and patent portfolio badges are prominently highlighted on your profile.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <Users className="w-4 h-4" />
                  <span>Connect With 5 Ecosystem Peers</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Expand your partner network in the Discover Companies section to unlock mutual introductions.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs mt-2"
                onClick={() => navigate(ROUTES.COMPANY_OWNER.MY_COMPANY)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Manage Full Profile & Media
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card
          isHoverable
          className="cursor-pointer bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg hover:border-[var(--brand-primary)]/50 transition-all"
          onClick={() => navigate(ROUTES.COMPANY_OWNER.DOCUMENTS)}
        >
          <CardBody className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] mb-3 shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-heading">Company Documents</h4>
            <p className="text-xs text-slate-400">
              Access verified MCA certificates, tax documents, and corporate resolutions.
            </p>
          </CardBody>
        </Card>

        <Card
          isHoverable
          className="cursor-pointer bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg hover:border-[var(--brand-primary)]/50 transition-all"
          onClick={() => navigate(ROUTES.COMPANY_OWNER.ONBOARDING_HISTORY)}
        >
          <CardBody className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] mb-3 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-heading">Onboarding Timeline</h4>
            <p className="text-xs text-slate-400">
              Inspect your verified onboarding journey, past review feedback, and milestones.
            </p>
          </CardBody>
        </Card>

        <Card
          isHoverable
          className="cursor-pointer bg-[var(--bg-table)] border border-[var(--border-table)] shadow-lg hover:border-[var(--brand-primary)]/50 transition-all"
          onClick={() => navigate(ROUTES.COMPANY_OWNER.DISCOVER_COMPANIES)}
        >
          <CardBody className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] mb-3 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-heading">Discover Ecosystem</h4>
            <p className="text-xs text-slate-400">
              Explore verified technology innovators, potential enterprise partners, and peers.
            </p>
          </CardBody>
        </Card>
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

          <div className="p-3.5 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <span>
              The assigned manager will receive platform invitation credentials to co-manage company assets under your ownership.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143144]">
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
