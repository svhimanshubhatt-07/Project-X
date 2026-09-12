import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { OnboardingApplication } from '../../../../features/onboarding/types/onboarding.types';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { Button } from '../../../../shared/components/ui/Button';
import { Lock, Plus, MessageSquare, Shield } from 'lucide-react';
import { formatDate, formatDateTime } from '../../../../shared/utils/formatDate';
import { useOnboarding } from '../../../../features/onboarding/hooks/useOnboarding';
import { useToast } from '../../../../app/providers/ToastProvider';

export const InternalNotes: React.FC<{ application: OnboardingApplication }> = ({ application }) => {
  const { addInternalNote } = useOnboarding();
  const { success } = useToast();
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addInternalNote(application.id, noteText.trim());
      setNoteText('');
      setIsSubmitting(false);
      success('Internal review note logged successfully.');
    }, 300);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Internal Administrative Review Notes"
          subtitle="Confidential admin-only notes and reviewer observations. Never visible to applicant."
          action={
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#091b27] text-[11px] font-semibold text-teal-400 border border-[#17384e]">
              <Lock className="w-3 h-3 text-teal-400" />
              <span>Admin Only</span>
            </div>
          }
        />
        <CardBody className="space-y-6">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="space-y-3 bg-[#091b27] p-4 rounded-2xl border border-[#17384e]">
            <Textarea
              placeholder="Type internal review observations, MCA cross-check results, or compliance flags..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!noteText.trim()}
                isLoading={isSubmitting}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Log Internal Note
              </Button>
            </div>
          </form>

          {/* Notes Log */}
          <div className="space-y-3">
            {application.internalNotes.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No internal notes logged yet.</p>
            ) : (
              application.internalNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl bg-[#091b27] border border-[#17384e] shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs">
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{note.author}</span>
                      <span className="text-[10px] text-teal-400 font-medium bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                        {note.authorRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{formatDateTime(note.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-8">{note.note}</p>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
