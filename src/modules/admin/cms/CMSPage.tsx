import React, { useState } from 'react';
import { PageHeader } from '../../../shared/components/dashboard/PageHeader';
import { Card, CardHeader, CardBody } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Tabs } from '../../../shared/components/ui/Tabs';
import { StatusBadge } from '../../../shared/components/dashboard/StatusBadge';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { mockDataStore, CMSSectionRecord } from '../../../shared/services/mockDataStore';
import { useToast } from '../../../app/providers/ToastProvider';
import { Globe, Edit3, Eye, CheckCircle2, Sparkles, Send, Check } from 'lucide-react';

export const CMSPage: React.FC = () => {
  const [sections, setSections] = useState<CMSSectionRecord[]>(() => mockDataStore.getCMSSections());
  const { success } = useToast();

  const [activePageTab, setActivePageTab] = useState('ALL');
  const [editingSection, setEditingSection] = useState<CMSSectionRecord | null>(null);
  const [previewSection, setPreviewSection] = useState<CMSSectionRecord | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  const filteredSections = sections.filter((s) => {
    if (activePageTab === 'ALL') return true;
    return s.page.toLowerCase().replace(/\s+/g, '-') === activePageTab;
  });

  const handleEditClick = (sec: CMSSectionRecord) => {
    setEditingSection(sec);
    setTitle(sec.title);
    setSubtitle(sec.subtitle || '');
    setContent(sec.content);
  };

  const handleSaveCMS = () => {
    if (!editingSection) return;
    mockDataStore.updateCMSSection(editingSection.id, {
      title,
      subtitle,
      content,
      status: 'PUBLISHED',
    });
    setSections(mockDataStore.getCMSSections());
    setEditingSection(null);
    success(`CMS section "${title}" published to public Project X Website.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS Website Content Manager"
        subtitle="Control headline copy, hero narratives, FAQs, and policy pages displayed on the public Project X Website."
        breadcrumbs={[{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'CMS' }]}
      />

      <Tabs
        variant="status-cards"
        activeTab={activePageTab}
        onChange={setActivePageTab}
        tabs={[
          { id: 'ALL', label: 'All Pages', count: sections.length },
          { id: 'homepage', label: 'Homepage', icon: <Globe className="w-4 h-4 text-cyan-400" /> },
          { id: 'about-us', label: 'About Us', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
          { id: 'how-it-works', label: 'How It Works', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
          { id: 'faq', label: 'FAQ', icon: <Send className="w-4 h-4 text-purple-400" /> },
          { id: 'terms-&-conditions', label: 'Terms & Privacy', icon: <Check className="w-4 h-4 text-rose-400" /> },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSections.map((sec) => (
          <Card key={sec.id} className="flex flex-col justify-between">
            <CardHeader
              title={sec.title}
              subtitle={`${sec.page} • ${sec.section}`}
              action={
                <div className="flex items-center gap-2">
                  <StatusBadge status={sec.status} size="sm" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewSection(sec)}
                    className="p-1.5"
                    title="Live Preview"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-300" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditClick(sec)}
                    className="text-xs"
                  >
                    <Edit3 className="w-3 h-3 text-slate-300 mr-1" />
                    Edit
                  </Button>
                </div>
              }
            />
            <CardBody className="space-y-3 flex-1 flex flex-col justify-between">
              <div>
                {sec.subtitle && (
                  <p className="text-xs text-teal-400 font-medium mb-2 italic">
                    "{sec.subtitle}"
                  </p>
                )}
                <p className="text-xs text-slate-300 bg-[#091b27] p-3 rounded-xl border border-[#17384e] leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>
              </div>

              <div className="pt-3 border-t border-[#17384e] flex items-center justify-between text-[11px] text-slate-400">
                <span>Updated by {sec.updatedBy}</span>
                <span>{sec.lastUpdated}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {editingSection && (
        <Modal
          isOpen={!!editingSection}
          onClose={() => setEditingSection(null)}
          title={`Edit Content: ${editingSection.section}`}
          subtitle={`Page: ${editingSection.page}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveCMS}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Headline Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Subtitle / Tagline"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <Textarea
              label="Body Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
        </Modal>
      )}

      {previewSection && (
        <Modal
          isOpen={!!previewSection}
          onClose={() => setPreviewSection(null)}
          title="Public Website Render Preview"
          subtitle={`Displaying live mockup of ${previewSection.page} > ${previewSection.section}`}
          size="lg"
        >
          <div className="bg-[#091b27] rounded-2xl border border-[#17384e] p-8 space-y-4 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/20">
              {previewSection.page} — {previewSection.section}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-100">{previewSection.title}</h2>
            {previewSection.subtitle && (
              <p className="text-sm text-slate-400 max-w-lg mx-auto">{previewSection.subtitle}</p>
            )}
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-2">
              {previewSection.content}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
