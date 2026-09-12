import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Modal } from '../../../shared/components/ui/Modal';
import { FileUploader } from '../../../shared/components/forms/FileUploader';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { useOnboarding } from '../../../features/onboarding/hooks/useOnboarding';
import { useToast } from '../../../app/providers/ToastProvider';
import { formatDate } from '../../../shared/utils/formatDate';
import { formatFileSize } from '../../../shared/utils/formatFileSize';
import { FileText, UploadCloud, Eye, Download, ShieldCheck, Plus } from 'lucide-react';
import { CompanyDocument } from '../../../features/onboarding/types/onboarding.types';

export const DocumentsPage: React.FC = () => {
  const { applications } = useOnboarding();
  const { success } = useToast();

  // Load documents of Nova Robotics (or first app)
  const myApp = applications[0];
  const [docs, setDocs] = useState<CompanyDocument[]>(myApp?.documents || []);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Annual Accreditation');
  const [docName, setDocName] = useState('');
  const [inspectDoc, setInspectDoc] = useState<CompanyDocument | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDoc: CompanyDocument = {
      id: `DOC-${Date.now()}`,
      name: docName || selectedFile.name,
      type: docType,
      uploadedAt: new Date().toISOString(),
      status: 'PENDING',
      fileSize: selectedFile.size,
    };

    setDocs([newDoc, ...docs]);
    setIsUploadOpen(false);
    setSelectedFile(null);
    setDocName('');
    success(`Document "${newDoc.name}" uploaded. Sent to Admin compliance queue for review.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Verification & Compliance Documents"
        subtitle="Manage uploaded incorporation filings, GST certificates, and regulatory accreditation documents."
        breadcrumbs={[{ label: 'Dashboard', path: '/company/dashboard' }, { label: 'Documents' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Upload Document
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Uploaded Document Files"
          subtitle={`Showing ${docs.length} verified company records.`}
        />
        <CardBody className="p-0">
          <div className="divide-y divide-[#143144]">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 sm:px-6 hover:bg-[#0f2c40]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#091b27] border border-[#17384e] flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{doc.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-teal-400 font-medium">{doc.type}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={doc.status} size="sm" />
                  <button
                    onClick={() => setInspectDoc(doc)}
                    className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
                    title="View Document Details"
                    aria-label="View Document Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Upload Modal */}
      {isUploadOpen && (
        <Modal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title="Upload Legal Document"
          subtitle="All documents undergo cryptographic validation and compliance inspection."
          size="md"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <Select
              label="Document Classification Type"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              options={[
                { label: 'Annual Accreditation Certificate', value: 'Annual Accreditation' },
                { label: 'Updated Tax Clearances', value: 'Tax Clearance' },
                { label: 'Board Director Appointment Resolution', value: 'Board Resolution' },
                { label: 'Patents & IP Rights Certification', value: 'IP Certification' },
              ]}
            />
            <Input
              label="Custom Document Title (Optional)"
              placeholder="e.g. ISO-27001 Security Audit 2026"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
            <FileUploader
              label="Select Document File"
              value={selectedFile}
              onChange={setSelectedFile}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={!selectedFile}>
                Upload for Verification
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {inspectDoc && (
        <Modal
          isOpen={!!inspectDoc}
          onClose={() => setInspectDoc(null)}
          title={inspectDoc.name}
          subtitle={`${inspectDoc.type} • ${formatFileSize(inspectDoc.fileSize)}`}
          size="md"
        >
          <div className="p-6 bg-[#091b27] rounded-2xl border border-[#17384e] text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#0c2130] border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 font-heading">{inspectDoc.name}</h4>
            <p className="text-xs text-slate-400">
              Uploaded on {formatDate(inspectDoc.uploadedAt)}. Cryptographic integrity verified.
            </p>
            <div className="pt-2 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Simulating secure file download...')}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Encrypted File
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
