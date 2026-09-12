import React, { useState } from 'react';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { Button } from '../../../../shared/components/ui/Button';
import { Modal } from '../../../../shared/components/ui/Modal';
import { ConfirmDialog } from '../../../../shared/components/dashboard/ConfirmDialog';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { Input } from '../../../../shared/components/ui/Input';
import { Checkbox } from '../../../../shared/components/ui/Checkbox';
import { CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useOnboarding } from '../../../../features/onboarding/hooks/useOnboarding';
import { useToast } from '../../../../app/providers/ToastProvider';

export const ApplicationReviewActions: React.FC<{ application: OnboardingApplication }> = ({
  application,
}) => {
  const { approveApplication, rejectApplication, requestMoreInfo } = useOnboarding();
  const { success, error } = useToast();

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [approvalNotes, setApprovalNotes] = useState('All legal documents, MCA registration, and GST checks verified successfully.');
  const [rejectionReason, setRejectionReason] = useState('');
  const [infoMessage, setInfoMessage] = useState('Please provide the following additional documents to complete your verification:');
  const [requiredItems, setRequiredItems] = useState<string[]>([
    'Updated GST Registration Certificate Form REG-06',
  ]);

  const handleApprove = () => {
    setIsLoading(true);
    setTimeout(() => {
      approveApplication(application.id, approvalNotes);
      setIsLoading(false);
      setIsApproveOpen(false);
      success(
        `Application for ${application.companyName} has been approved. Company Owner portal access is provisioned.`,
        'Application Approved'
      );
    }, 500);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      error('Please provide a mandatory reason for rejecting this application.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      rejectApplication(application.id, rejectionReason.trim());
      setIsLoading(false);
      setIsRejectOpen(false);
      success(
        `Application ${application.id} has been marked as REJECTED.`,
        'Application Rejected'
      );
    }, 500);
  };

  const handleRequestInfo = () => {
    if (!infoMessage.trim()) {
      error('Please include instructions for the applicant.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      requestMoreInfo(application.id, infoMessage.trim(), requiredItems);
      setIsLoading(false);
      setIsRequestInfoOpen(false);
      success(
        `Additional information request dispatched to ${application.applicantName}. Status updated to MORE INFORMATION REQUIRED.`,
        'Request Sent'
      );
    }, 500);
  };

  const isClosed = application.status === 'APPROVED' || application.status === 'REJECTED';

  return (
    <div className="flex items-center gap-3">
      {/* Action Buttons */}
      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsRejectOpen(true)}
        disabled={isClosed}
        leftIcon={<XCircle className="w-4 h-4" />}
      >
        Reject
      </Button>

      <Button
        variant="success"
        size="sm"
        onClick={() => setIsApproveOpen(true)}
        disabled={isClosed}
        leftIcon={<CheckCircle2 className="w-4 h-4" />}
      >
        Approve Company
      </Button>

      {/* APPROVE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title={`Approve ${application.companyName}?`}
        message={
          <div className="space-y-3 text-left">
            <p className="text-slate-300">
              Approving this application will verify <strong className="text-slate-100">{application.companyName}</strong>, activate its presence in the directory, and grant <strong className="text-teal-400">{application.applicantName}</strong> verified Company Owner dashboard credentials.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Approval Note (Logged in Audit Trail)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={2}
                className="w-full bg-[#091b27] text-xs text-slate-100 p-2.5 rounded-xl border border-[#17384e] outline-none focus:border-teal-400 shadow-sm"
              />
            </div>
          </div>
        }
        confirmText="Confirm & Approve"
        variant="success"
        isLoading={isLoading}
      />

      {/* REJECT MODAL */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject Onboarding Application"
        subtitle={`Application ID: ${application.id} • ${application.companyName}`}
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReject}
              isLoading={isLoading}
            >
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Please provide a specific compliance reason. This explanation will be logged in the system audit trail and communicated to the applicant.
          </p>

          <Textarea
            label="Rejection Reason (Required)"
            placeholder="e.g. Entity registration documents could not be validated with the MCA database / Inauthentic GST credentials."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            rows={4}
          />
        </div>
      </Modal>

      {/* REQUEST MORE INFO MODAL */}
      <Modal
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        title="Request Additional Information / Documents"
        subtitle={`Applicant: ${application.applicantName} • ${application.companyName}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRequestInfoOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRequestInfo}
              isLoading={isLoading}
            >
              Send Information Request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Specify the missing documentation, annexures, or clarifications required from the applicant. The application status will shift to <span className="text-teal-400 font-semibold">MORE INFORMATION REQUIRED</span>.
          </p>

          <Textarea
            label="Instructions & Remarks for Applicant"
            value={infoMessage}
            onChange={(e) => setInfoMessage(e.target.value)}
            rows={3}
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-2">
              Common Required Document Items
            </label>
            <div className="space-y-2 bg-[#091b27] p-3.5 rounded-xl border border-[#17384e]">
              {[
                'Updated GST Registration Certificate Form REG-06',
                'Board Resolution specifying Authorized Signatory Authority',
                'MCA Certified Certificate of Incorporation (COI)',
                'Audited Financial Balance Sheet of previous fiscal year',
                'Regulatory Sandbox approval letter with formal annexures',
              ].map((item, idx) => {
                const isSelected = requiredItems.includes(item);
                return (
                  <Checkbox
                    key={idx}
                    label={item}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRequiredItems([...requiredItems, item]);
                      } else {
                        setRequiredItems(requiredItems.filter((i) => i !== item));
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
