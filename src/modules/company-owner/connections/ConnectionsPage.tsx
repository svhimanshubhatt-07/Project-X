import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { useCompanies } from '../../../features/companies/hooks/useCompanies';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  Users,
  UserCheck,
  UserPlus,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface ConnectionItem {
  id: string;
  companyName: string;
  representativeName: string;
  representativeEmail: string;
  industry: string;
  location: string;
  connectedDate: string;
  status: 'CONNECTED' | 'INCOMING_REQUEST' | 'SENT_REQUEST';
  mutualConnections: number;
  message?: string;
}

const INITIAL_CONNECTIONS: ConnectionItem[] = [
  {
    id: 'conn-01',
    companyName: 'Zenith Semiconductor Labs',
    representativeName: 'Rajesh Nair',
    representativeEmail: 'r.nair@zenithsemi.io',
    industry: 'Semiconductors & Hardware',
    location: 'Noida, Uttar Pradesh',
    connectedDate: '2026-01-14',
    status: 'CONNECTED',
    mutualConnections: 6,
  },
  {
    id: 'conn-02',
    companyName: 'Solaris CleanGrid Energy',
    representativeName: 'Meera Patel',
    representativeEmail: 'meera.p@solariscleangrid.com',
    industry: 'CleanTech & Energy',
    location: 'Ahmedabad, Gujarat',
    connectedDate: '2026-02-01',
    status: 'CONNECTED',
    mutualConnections: 3,
  },
  {
    id: 'conn-03',
    companyName: 'Apex Cloud & DevOps Architecture',
    representativeName: 'Aditya Mathur',
    representativeEmail: 'contact@apexcloud.io',
    industry: 'Cloud Infrastructure & DevOps',
    location: 'Bengaluru, Karnataka',
    connectedDate: '2026-02-20',
    status: 'CONNECTED',
    mutualConnections: 8,
  },
  {
    id: 'conn-04',
    companyName: 'Aether Cloud HyperScale',
    representativeName: 'David Chen',
    representativeEmail: 'david.chen@aethercloud.tech',
    industry: 'Cloud Infrastructure',
    location: 'Mumbai, Maharashtra',
    connectedDate: '2026-03-08',
    status: 'INCOMING_REQUEST',
    mutualConnections: 4,
    message: 'Interested in exploring GPU compute synergy for your robotics inference pipelines.',
  },
  {
    id: 'conn-05',
    companyName: 'OmniLogix Autonomous Freight',
    representativeName: 'Kavita Sundaram',
    representativeEmail: 'kavita@omnilogix.ai',
    industry: 'Logistics & Supply Chain',
    location: 'Chennai, Tamil Nadu',
    connectedDate: '2026-03-09',
    status: 'SENT_REQUEST',
    mutualConnections: 2,
    message: 'Requesting partnership connection for smart warehouse navigation integration.',
  },
];

export const ConnectionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam === 'requests' ? 'requests' : 'my-connections'
  );
  const [connections, setConnections] = useState<ConnectionItem[]>(INITIAL_CONNECTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const { success, info } = useToast();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');
  const [inviteNote, setInviteNote] = useState('');

  useEffect(() => {
    if (tabParam === 'requests' && activeTab !== 'requests') {
      setActiveTab('requests');
    } else if (tabParam === 'my-connections' && activeTab !== 'my-connections') {
      setActiveTab('my-connections');
    }
  }, [tabParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const myConnections = useMemo(() => {
    return connections.filter((c) => c.status === 'CONNECTED');
  }, [connections]);

  const connectionRequests = useMemo(() => {
    return connections.filter(
      (c) => c.status === 'INCOMING_REQUEST' || c.status === 'SENT_REQUEST'
    );
  }, [connections]);

  const displayedList = useMemo(() => {
    const list = activeTab === 'requests' ? connectionRequests : myConnections;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      return list.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.representativeName.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, connectionRequests, myConnections, debouncedSearch]);

  const handleAccept = (item: ConnectionItem) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? { ...c, status: 'CONNECTED', connectedDate: new Date().toISOString().split('T')[0] }
          : c
      )
    );
    success(`Connection request from "${item.companyName}" accepted.`);
  };

  const handleDecline = (item: ConnectionItem) => {
    setConnections((prev) => prev.filter((c) => c.id !== item.id));
    info(`Connection request from "${item.companyName}" declined.`);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newConn: ConnectionItem = {
      id: `conn-${Date.now()}`,
      companyName: inviteCompany || 'Enterprise Partner',
      representativeName: 'Authorized Representative',
      representativeEmail: inviteEmail,
      industry: 'Enterprise Partner',
      location: 'India',
      connectedDate: new Date().toISOString().split('T')[0],
      status: 'SENT_REQUEST',
      mutualConnections: 1,
      message: inviteNote,
    };
    setConnections([newConn, ...connections]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteCompany('');
    setInviteNote('');
    success(`Partnership connection invitation sent to ${inviteEmail}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Partner Network & Connections"
        subtitle="Collaborate with verified companies, send partnership requests, and expand your B2B ecosystem."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Connections' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Connect Company
          </Button>
        }
      />

      <Tabs
        variant="status-cards"
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          {
            id: 'my-connections',
            label: 'My Connections',
            count: myConnections.length,
            icon: <Users className="w-4 h-4 text-cyan-400" />,
          },
          {
            id: 'requests',
            label: 'Connection Requests',
            count: connectionRequests.length,
            icon: <UserCheck className="w-4 h-4 text-purple-400" />,
          },
        ]}
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company name, contact, or industry..."
          className="w-full pl-9 pr-4 py-2 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      {activeTab === 'my-connections' ? (
        /* My Connections Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedList.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-400 bg-[#0c2130] rounded-2xl border border-[#17384e]">
              No active connections found. Browse "Discover Companies" to expand your network.
            </div>
          ) : (
            displayedList.map((conn) => (
              <Card
                key={conn.id}
                className="bg-[#0c2130] border border-[#17384e] shadow-lg hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg shrink-0">
                      {conn.companyName.charAt(0)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-100 font-heading">{conn.companyName}</h4>
                    <p className="text-xs text-teal-300 mt-0.5">{conn.industry}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{conn.location}</p>
                  </div>

                  <div className="pt-3 border-t border-[#143144] space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Representative:</span>
                      <span className="font-semibold text-slate-200">{conn.representativeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Mail className="w-3 h-3 text-teal-400" />
                      <span>{conn.representativeEmail}</span>
                    </div>
                  </div>
                </CardBody>

                <div className="px-5 py-3 bg-[#091b27]/80 border-t border-[#143144] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Connected since {conn.connectedDate}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => success(`Direct collaboration thread opened with ${conn.companyName}.`)}
                    className="text-xs text-teal-400 hover:text-teal-300"
                    leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                  >
                    Message
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Connection Requests View */
        <Card className="bg-[#0c2130] border border-[#17384e] shadow-lg">
          <CardHeader
            title="Incoming & Outgoing Connection Requests"
            subtitle="Manage enterprise collaboration inquiries and partnership proposals."
          />
          <CardBody className="p-0">
            <div className="divide-y divide-[#143144]">
              {displayedList.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400">
                  No pending connection requests in queue.
                </div>
              ) : (
                displayedList.map((conn) => (
                  <div
                    key={conn.id}
                    className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#0f2c40]/30 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                        {conn.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-100">{conn.companyName}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              conn.status === 'INCOMING_REQUEST'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {conn.status === 'INCOMING_REQUEST' ? 'Incoming Request' : 'Sent Request'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {conn.representativeName} ({conn.representativeEmail}) • {conn.industry}
                        </p>
                        {conn.message && (
                          <p className="text-xs text-slate-300 mt-2 p-2.5 rounded-lg bg-[#091b27] border border-[#17384e]">
                            "{conn.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {conn.status === 'INCOMING_REQUEST' ? (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAccept(conn)}
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(conn)}
                            leftIcon={<XCircle className="w-3.5 h-3.5" />}
                          >
                            Decline
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(conn)}
                          className="text-xs text-slate-400 hover:text-rose-400"
                        >
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Connect New Partner Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Send Partnership & Connection Request"
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <Input
            label="Partner Company Name"
            value={inviteCompany}
            onChange={(e) => setInviteCompany(e.target.value)}
            placeholder="e.g. Zenith Semiconductor Labs"
            required
          />
          <Input
            label="Corporate / Representative Email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="partner@enterprise.io"
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Partnership Proposal / Note
            </label>
            <textarea
              rows={3}
              value={inviteNote}
              onChange={(e) => setInviteNote(e.target.value)}
              placeholder="Introduce your company and describe potential synergy or collaboration areas..."
              className="w-full px-4 py-2.5 bg-[#091b27] border border-[#17384e] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#143144]">
            <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
              Send Connection Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
