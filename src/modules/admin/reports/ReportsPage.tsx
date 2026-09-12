import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Modal } from '../../../shared/components/ui/Modal';
import { DateRangeFilter } from '../../../shared/components/dashboard/DateRangeFilter';
import { useOnboarding } from '../../../features/onboarding/hooks/useOnboarding';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useUsers } from '../../../features/users/hooks/useUsers';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Users,
  Building2,
  FileCheck2,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Activity,
  BarChart3,
  Percent,
} from 'lucide-react';

type ReportDomain = 'users' | 'companies' | 'applications';

export const ReportsPage: React.FC = () => {
  const { applications } = useOnboarding();
  const { companies } = useCompanies();
  const { users } = useUsers();
  const { success, info } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = (searchParams.get('tab') as ReportDomain) || 'users';
  const [activeReportTab, setActiveReportTab] = useState<ReportDomain>(
    tabParam === 'companies' || tabParam === 'applications' ? tabParam : 'users'
  );

  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-03-31');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 200);

  // Selected row inspector modal
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    if (tabParam) {
      const normalized: ReportDomain = tabParam === 'companies' || tabParam === 'applications' ? tabParam : 'users';
      if (normalized !== activeReportTab) {
        setActiveReportTab(normalized);
      }
    }
  }, [tabParam]);

  const handleTabChange = (tabId: ReportDomain) => {
    setActiveReportTab(tabId);
    setSearchParams({ tab: tabId });
    setSearchTerm('');
  };

  const handleExport = (format: 'CSV' | 'PDF') => {
    info(`Generating ${format} report for ${activeReportTab.toUpperCase()} (${startDate} to ${endDate})...`, 'Export Queued');
    setTimeout(() => {
      success(`Project_X_${activeReportTab}_report_${Date.now()}.${format.toLowerCase()} downloaded.`, 'Download Ready');
    }, 700);
  };

  // Domain Specific Calculations
  const reportData = useMemo(() => {
    switch (activeReportTab) {
      case 'users': {
        const total = users.length;
        const owners = users.filter((u) => u.role === 'COMPANY_OWNER').length;
        const stakeholders = users.filter((u) => u.role === 'STAKEHOLDER').length;
        const admins = users.filter((u) => u.role === 'ADMIN').length;
        const active = users.filter((u) => u.status === 'ACTIVE').length;

        return {
          title: 'User Access & Account Intelligence Report',
          subtitle: 'Granular breakdown of corporate roles, security clearance tiers, and active sessions.',
          metrics: [
            { label: 'Total Registered Users', value: total, note: '+18.5% YoY', icon: <Users className="w-4 h-4 text-cyan-400" /> },
            { label: 'Company Owners', value: owners, note: `${Math.round((owners / total) * 100)}% of total`, icon: <Building2 className="w-4 h-4 text-teal-400" /> },
            { label: 'Stakeholders & Investors', value: stakeholders, note: `${Math.round((stakeholders / total) * 100)}% of total`, icon: <Activity className="w-4 h-4 text-amber-400" /> },
            { label: 'Active Account Rate', value: `${Math.round((active / total) * 100)}%`, note: '99.4% Auth SLA', icon: <Percent className="w-4 h-4 text-emerald-400" /> },
          ],
          distributions: [
            { label: 'Company Owners', percentage: Math.round((owners / total) * 100), color: 'bg-teal-400' },
            { label: 'Stakeholders & Investors', percentage: Math.round((stakeholders / total) * 100), color: 'bg-amber-400' },
            { label: 'Administrators & Reviewers', percentage: Math.round((admins / total) * 100), color: 'bg-purple-400' },
          ],
          rows: users
            .filter((u) => {
              if (!debouncedSearch) return true;
              const q = debouncedSearch.toLowerCase();
              return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
            })
            .map((u) => ({
              id: u.id,
              primary: u.name,
              secondary: u.email,
              category: u.role.replace(/_/g, ' '),
              meta: `Registered: ${u.registeredDate}`,
              status: u.status,
              statLabel: 'Clearance',
              statValue: u.role === 'ADMIN' ? 'Tier 1 (Full)' : 'Tier 2 (Entity)',
              raw: u,
            })),
        };
      }

      case 'companies': {
        const total = companies.length;
        const verified = companies.filter((c) => c.verificationStatus === 'VERIFIED').length;
        const activeListings = companies.filter((c) => c.listingStatus === 'ACTIVE').length;
        const avgViews = Math.round(companies.reduce((acc, c) => acc + (c.profileViews || 0), 0) / (total || 1));

        return {
          title: 'Corporate Directory & Industry Classification Report',
          subtitle: 'Enterprise registrations, verification compliance health, and public directory engagement.',
          metrics: [
            { label: 'Total Corporate Entities', value: total, note: '100% MCA Cross-Checked', icon: <Building2 className="w-4 h-4 text-emerald-400" /> },
            { label: 'Verified & Cleared', value: verified, note: `${Math.round((verified / total) * 100)}% verified`, icon: <CheckCircle2 className="w-4 h-4 text-teal-400" /> },
            { label: 'Active Public Listings', value: activeListings, note: 'Live on search portal', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
            { label: 'Avg Profile Impressions', value: avgViews.toLocaleString(), note: '+32.4% engagement', icon: <BarChart3 className="w-4 h-4 text-purple-400" /> },
          ],
          distributions: [
            { label: 'Robotics & AI', percentage: 40, color: 'bg-teal-400' },
            { label: 'Cloud Infrastructure', percentage: 25, color: 'bg-cyan-400' },
            { label: 'Semiconductors & BioTech', percentage: 20, color: 'bg-purple-400' },
            { label: 'CleanTech & Logistics', percentage: 15, color: 'bg-amber-400' },
          ],
          rows: companies
            .filter((c) => {
              if (!debouncedSearch) return true;
              const q = debouncedSearch.toLowerCase();
              return c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.representativeName.toLowerCase().includes(q);
            })
            .map((c) => ({
              id: c.id,
              primary: c.name,
              secondary: c.headquarters || c.industry,
              category: c.industry,
              meta: `App ID: ${c.applicationId}`,
              status: c.verificationStatus,
              statLabel: 'Directory Views',
              statValue: (c.profileViews || 0).toLocaleString(),
              raw: c,
            })),
        };
      }

      case 'applications': {
        const total = applications.length;
        const approved = applications.filter((a) => a.status === 'APPROVED').length;
        const pending = applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
        const moreInfo = applications.filter((a) => a.status === 'MORE_INFO_REQUIRED').length;

        return {
          title: 'Onboarding Applications & SLA Compliance Audit',
          subtitle: 'Verification pipeline turnaround telemetry, pass rates, and compliance response SLA.',
          metrics: [
            { label: 'Total Applications', value: total, note: '+14.2% QoQ growth', icon: <FileCheck2 className="w-4 h-4 text-amber-400" /> },
            { label: 'Approved & Provisioned', value: approved, note: `${Math.round((approved / total) * 100)}% first pass rate`, icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
            { label: 'In Review Queue', value: pending, note: 'Avg SLA: 1.8 days', icon: <Clock className="w-4 h-4 text-cyan-400" /> },
            { label: 'Clarifications Requested', value: moreInfo, note: 'Action pending applicant', icon: <Activity className="w-4 h-4 text-rose-400" /> },
          ],
          distributions: [
            { label: 'Approved (Provisioned)', percentage: Math.round((approved / total) * 100), color: 'bg-emerald-400' },
            { label: 'Under Review Queue', percentage: Math.round((pending / total) * 100), color: 'bg-cyan-400' },
            { label: 'Clarifications / Draft', percentage: Math.round(((total - approved - pending) / total) * 100), color: 'bg-amber-400' },
          ],
          rows: applications
            .filter((a) => {
              if (!debouncedSearch) return true;
              const q = debouncedSearch.toLowerCase();
              return a.companyName.toLowerCase().includes(q) || a.applicantName.toLowerCase().includes(q) || a.applicationId.toLowerCase().includes(q);
            })
            .map((a) => ({
              id: a.id,
              primary: a.companyName,
              secondary: `Applicant: ${a.applicantName} (${a.applicantEmail})`,
              category: a.industry || 'Enterprise',
              meta: `Submitted: ${a.submittedAt?.split('T')[0] || '2026-03-01'}`,
              status: a.status,
              statLabel: 'SLA Duration',
              statValue: '1.4 Days',
              raw: a,
            })),
        };
      }
    }
  }, [activeReportTab, users, companies, applications, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(reportData.rows, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title={reportData.title}
        subtitle={reportData.subtitle}
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('CSV')}
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExport('PDF')}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs
        variant="status-cards"
        activeTab={activeReportTab}
        onChange={(tabId) => handleTabChange(tabId as ReportDomain)}
        tabs={[
          {
            id: 'users',
            label: 'User Report',
            count: users.length,
            icon: <Users className="w-4 h-4 text-cyan-400" />,
          },
          {
            id: 'companies',
            label: 'Company Report',
            count: companies.length,
            icon: <Building2 className="w-4 h-4 text-teal-400" />,
          },
          {
            id: 'applications',
            label: 'Application Report',
            count: applications.length,
            icon: <FileCheck2 className="w-4 h-4 text-amber-400" />,
          },
        ]}
      />

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reportData.metrics.map((m, idx) => (
          <Card key={idx} className="bg-[#0c2130] border border-[#17384e] shadow-lg hover:border-teal-500/30 transition-all">
            <CardBody className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <div className="p-1.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                  {m.icon}
                </div>
              </div>
              <div className="text-2xl font-black font-heading text-slate-100">{m.value}</div>
              <div className="text-xs font-medium text-teal-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{m.note}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Distribution Ratio Card */}
      <Card className="bg-[#0c2130] border border-[#17384e] shadow-lg">
        <CardBody className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Telemetry Allocation & Ratio Breakdown
            </span>
            <span className="text-xs text-slate-400 font-mono">Reporting Period: {startDate} → {endDate}</span>
          </div>

          {/* Progress Multi-Bar */}
          <div className="w-full h-3 rounded-full bg-[#091b27] overflow-hidden flex border border-[#17384e]">
            {reportData.distributions.map((d, i) => (
              <div
                key={i}
                style={{ width: `${d.percentage}%` }}
                className={`${d.color} h-full transition-all duration-500`}
                title={`${d.label}: ${d.percentage}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            {reportData.distributions.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className={`w-2.5 h-2.5 rounded-full ${d.color}`} />
                <span>{d.label}</span>
                <strong className="text-slate-100 font-mono">({d.percentage}%)</strong>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Report Records Table */}
      <Card className="bg-[#0c2130] border border-[#17384e] shadow-lg">
        <div className="p-4 border-b border-[#143144] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeReportTab} records, identifiers, or categories...`}
              className="w-full pl-9 pr-4 py-2 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Showing <strong className="text-teal-300 font-mono">{items.length}</strong> of {reportData.rows.length} records
            </div>
          </div>
        </div>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#143144] bg-[#091e2b]/80">
                  <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">PRIMARY RECORD</th>
                  <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">CATEGORY / MODULE</th>
                  <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">DATE / IDENTIFIER</th>
                  <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">STATUS</th>
                  <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider">KEY TELEMETRY</th>
                  <th className="py-3.5 px-6 text-slate-400 font-semibold uppercase tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#143144]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No records found in this reporting timeframe matching your search.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id} className="hover:bg-[#0f2c40]/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {row.primary.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-100">{row.primary}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                        {row.meta}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">{row.statLabel}</span>
                          <span className="text-slate-200 font-medium">{row.statValue}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedRecord(row)}
                          className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
                          title="Inspect Report Record"
                          aria-label="Inspect Report Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Record Inspector Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Report Record Audit: ${selectedRecord.primary}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 p-4 bg-[#091b27] border border-[#17384e] rounded-xl">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30">
                  {selectedRecord.category}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2 font-heading">{selectedRecord.primary}</h3>
                <p className="text-xs text-slate-400">{selectedRecord.secondary}</p>
              </div>
              <StatusBadge status={selectedRecord.status} size="sm" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#091b27] border border-[#17384e] rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Identifier</span>
                <span className="text-xs font-bold text-slate-200 font-mono">{selectedRecord.id}</span>
              </div>
              <div className="p-3 bg-[#091b27] border border-[#17384e] rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">{selectedRecord.statLabel}</span>
                <span className="text-xs font-bold text-teal-300">{selectedRecord.statValue}</span>
              </div>
              <div className="p-3 bg-[#091b27] border border-[#17384e] rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Record Timestamp</span>
                <span className="text-xs font-medium text-slate-300 font-mono">{selectedRecord.meta}</span>
              </div>
            </div>

            <div className="p-4 bg-[#091b27] border border-[#17384e] rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Raw Telemetry Payload:
              </span>
              <pre className="text-[11px] p-3 rounded-lg bg-[#06141e] border border-[#143144] text-teal-300 font-mono overflow-x-auto max-h-56">
                {JSON.stringify(selectedRecord.raw, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#143144]">
              <Button type="button" variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
