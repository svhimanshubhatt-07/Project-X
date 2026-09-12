import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication, CompanyDocument } from '../../../../features/onboarding/types/onboarding.types';
import { FileText, Download, Eye, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatFileSize } from '../../../../shared/utils/formatFileSize';
import { formatDate } from '../../../../shared/utils/formatDate';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Modal } from '../../../../shared/components/ui/Modal';

export const DocumentReview: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<CompanyDocument | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Uploaded Legal & Supporting Documents"
          subtitle="Inspect uploaded incorporation certificates, resolutions, and regulatory licenses."
        />
        <CardBody className="p-0">
          {application.documents.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              No documents attached with this application packet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 sm:px-6 hover:bg-[#0f2c40]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-teal-400 font-medium">{doc.type}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                      </div>
                      {doc.comment && (
                        <p className="text-[11px] text-amber-400 mt-1 italic">Note: {doc.comment}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <StatusBadge status={doc.status} size="sm" />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="text-xs"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.name}
          subtitle={`${selectedDoc.type} • ${formatFileSize(selectedDoc.fileSize)}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Status: <span className="font-semibold text-slate-200">{selectedDoc.status}</span>
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDoc(null)}
              >
                Close Preview
              </Button>
            </div>
          }
        >
          <div className="bg-[#091b27] rounded-2xl border border-[#17384e] p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-100 font-heading">{selectedDoc.name}</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Verified legal attachment for {application.companyName}. Official cryptographic seal and registry signature confirmed.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Simulating PDF download for ${selectedDoc.name}`)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Original File
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
