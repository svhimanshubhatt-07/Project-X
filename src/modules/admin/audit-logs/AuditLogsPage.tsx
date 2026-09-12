import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { DataTable } from '../../../shared/components/dashboard/DataTable';
import { useAuditLogs } from '../../../features/audit-logs/hooks/useAuditLogs';
import { usePagination } from '../../../shared/hooks/usePagination';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { AuditLogRecord } from '../../../shared/services/mockDataStore';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Shield, History, Eye, Terminal, Laptop, Globe } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { logs } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.module.toLowerCase().includes(q) ||
          l.entityId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, debouncedSearch]);

  const { items, page, totalPages, total, limit, setPage } = usePagination(filteredLogs, 10);

  const columns = [
    {
      key: 'id',
      header: 'LOG ID',
      render: (item: AuditLogRecord) => (
        <span className="font-mono text-xs font-semibold text-teal-400">{item.id}</span>
      ),
    },
    {
      key: 'user',
      header: 'USER',
      render: (item: AuditLogRecord) => (
        <span className="font-semibold text-slate-100">{item.user}</span>
      ),
    },
    {
      key: 'action',
      header: 'ACTION',
      render: (item: AuditLogRecord) => (
        <span className="text-xs font-semibold text-slate-200">{item.action.replace(/_/g, ' ')}</span>
      ),
    },
    {
      key: 'entityId',
      header: 'TARGET ENTITY',
      render: (item: AuditLogRecord) => (
        <span className="text-xs text-slate-300 font-mono">{item.entityId}</span>
      ),
    },
    {
      key: 'timestamp',
      header: 'TIMESTAMP',
      render: (item: AuditLogRecord) => (
        <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right' as const,
      render: (item: AuditLogRecord) => (
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLog(item);
            }}
            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
            title="Inspect Audit Log Details"
            aria-label="Inspect Audit Log Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable System Audit Trail"
        subtitle="Complete accountability trail of all platform decisions, status overrides, and security actions."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Audit Logs' }]}
      />

      <DataTable
        columns={columns}
        data={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search audit logs by actor, action, module, or target ID..."
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={limit}
        onPageChange={setPage}
        onRowClick={(item) => setSelectedLog(item)}
      />

      {/* Inspect Log Details Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record: ${selectedLog.id}`}
          subtitle={`${selectedLog.action} by ${selectedLog.user} at ${selectedLog.timestamp}`}
          size="lg"
          footer={
            <div className="flex justify-end w-full">
              <Button variant="secondary" onClick={() => setSelectedLog(null)}>
                Close Log
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-[#091b27] p-4 rounded-xl border border-[#17384e] text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Actor Name:</span>
                <span className="text-slate-100 font-semibold">{selectedLog.user}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Actor Role:</span>
                <span className="text-teal-400 font-bold uppercase">{selectedLog.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">IP Address:</span>
                <span className="text-slate-300 font-mono">{selectedLog.ipAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Device & Browser:</span>
                <span className="text-slate-300">{selectedLog.device}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                State Transition Diff
              </span>
              <div className="p-3 bg-[#091b27] rounded-xl border border-[#17384e] space-y-2 text-xs font-mono">
                {selectedLog.previousValue && (
                  <div className="text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                    - {selectedLog.previousValue}
                  </div>
                )}
                <div className="text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                  + {selectedLog.newValue || 'Action Recorded'}
                </div>
              </div>
            </div>

            {selectedLog.remarks && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Reviewer Remarks
                </span>
                <p className="text-xs text-slate-300 bg-[#091b27] p-3 rounded-xl border border-[#17384e] italic">
                  "{selectedLog.remarks}"
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
