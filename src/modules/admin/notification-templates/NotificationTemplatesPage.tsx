import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { useNotifications } from '../../../features/notifications/hooks/useNotifications';
import { useToast } from '../../../app/providers/ToastProvider';
import { MailCheck, Edit3, Plus, Sparkles, Code2, Eye } from 'lucide-react';
import { NotificationTemplateRecord } from '../../../shared/services/mockDataStore';

export const NotificationTemplatesPage: React.FC = () => {
  const { templates, updateTemplate, addTemplate } = useNotifications();
  const { success } = useToast();

  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplateRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [templateName, setTemplateName] = useState('');
  const [event, setEvent] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleEditClick = (tmpl: NotificationTemplateRecord) => {
    setEditingTemplate(tmpl);
    setTemplateName(tmpl.templateName);
    setEvent(tmpl.event);
    setSubject(tmpl.subject);
    setBody(tmpl.body);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    updateTemplate(editingTemplate.id, {
      templateName,
      subject,
      body,
    });
    setEditingTemplate(null);
    success(`Template "${templateName}" updated successfully.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automated Notification Templates"
        subtitle="Manage reusable transactional email & in-app message templates with dynamic tags."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Templates' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setTemplateName('');
              setEvent('APPLICATION_SUBMITTED');
              setSubject('Project X Update: {{company_name}}');
              setBody('Dear {{applicant_name}},\n\nYour update details are here.\n\nProject X Board');
              setIsCreateOpen(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Template
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tmpl) => (
          <Card key={tmpl.id} className="flex flex-col justify-between">
            <CardHeader
              title={tmpl.templateName}
              subtitle={`Event Trigger: ${tmpl.event}`}
              action={
                <button
                  onClick={() => handleEditClick(tmpl)}
                  className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
                  title="View & Edit Template"
                  aria-label="View & Edit Template"
                >
                  <Eye className="w-4 h-4" />
                </button>
              }
            />
            <CardBody className="space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Subject Line
                </span>
                <p className="text-xs font-mono text-teal-400 bg-[#091b27] p-2.5 rounded-xl border border-[#17384e]">
                  {tmpl.subject}
                </p>

                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-3 mb-1">
                  Message Body
                </span>
                <p className="text-xs text-slate-300 bg-[#091b27] p-3 rounded-xl border border-[#17384e] whitespace-pre-line leading-relaxed">
                  {tmpl.body}
                </p>
              </div>

              <div className="pt-3 border-t border-[#143144] flex items-center justify-between text-[11px] text-slate-400">
                <span>Variables: {'{{company_name}}'}, {'{{applicant_name}}'}</span>
                <span>Last revised {tmpl.lastUpdated}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <Modal
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          title={`Edit Template: ${editingTemplate.templateName}`}
          subtitle="Support placeholders: {{company_name}}, {{applicant_name}}, {{application_id}}, {{reviewer_remarks}}"
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingTemplate(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save Template
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <Input
              label="Subject Line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              label="Message Body (Markdown / Plaintext)"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Notification Template"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                addTemplate({
                  templateName: templateName || 'Custom Notification',
                  event: event || 'CUSTOM_EVENT',
                  subject: subject || 'Project X Notice',
                  body: body || 'Hello,\n\nNotification content.\n\nProject X',
                  status: 'ACTIVE',
                });
                setIsCreateOpen(false);
                success('New notification template created.');
              }}
            >
              Create Template
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            placeholder="e.g. Annual Compliance Reminder"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <Input
            label="Subject Line"
            placeholder="e.g. Action Required: Annual Review for {{company_name}}"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            label="Message Body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
