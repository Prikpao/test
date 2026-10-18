import React, { useState } from 'react';
import { 
  ExternalLink, 
  UserCheck, 
  Library, 
  FileText, 
  Headphones, 
  Trophy, 
  HeartHandshake, 
  Plus, 
  Globe, 
  Trash2, 
  BookmarkCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PortalLinkItem } from '../types';
import { PORTAL_LINKS } from '../data/initialData';

interface PortalsTabProps {
  onOpenSMS: () => void;
  onOpenLibrary: () => void;
  onOpenReadingScore: () => void;
}

export const PortalsTab: React.FC<PortalsTabProps> = ({
  onOpenSMS,
  onOpenLibrary,
  onOpenReadingScore
}) => {
  const [links, setLinks] = useState<PortalLinkItem[]>(() => {
    const saved = localStorage.getItem('oakridge_custom_portal_links');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PORTAL_LINKS;
      }
    }
    return PORTAL_LINKS;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newBadge, setNewBadge] = useState('Student Bookmark');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newLink: PortalLinkItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom student shortcut portal',
      category: 'campus',
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      icon: 'Globe',
      badge: newBadge.trim() || 'Custom',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      isExternal: true
    };

    const updated = [...links, newLink];
    setLinks(updated);
    localStorage.setItem('oakridge_custom_portal_links', JSON.stringify(updated));
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
  };

  const handleDeleteCustomLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem('oakridge_custom_portal_links', JSON.stringify(updated));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck': return UserCheck;
      case 'Library': return Library;
      case 'FileText': return FileText;
      case 'Headphones': return Headphones;
      case 'Trophy': return Trophy;
      case 'HeartHandshake': return HeartHandshake;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-500/30 font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Unified Campus Gateway
              </span>
              <span className="text-slate-400 text-xs">Single Sign-On (SSO) Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              School Management System &amp; Essential Services
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Instant access to Oakridge SIS/SMS, the online library catalog, book score sheets, IT helpdesk tickets, and customized bookmarks.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl text-xs transition shadow-lg shadow-blue-600/30 flex items-center gap-2 self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Bookmark</span>
          </button>
        </div>
      </div>

      {/* Primary Featured Portals (SMS & Library & Reading) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* SMS Portal Featured Card */}
        <div className="bg-gradient-to-b from-slate-900 to-blue-950/30 border border-blue-800/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative group hover:border-blue-500 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-500/30 font-mono font-semibold">
                Live SIS
              </span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              School Management System (SMS)
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Access your real-time academic records, cumulative GPA, class timetable, daily attendance tracking, and teacher correspondence.
            </p>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Current Term GPA:</span>
                <strong className="text-emerald-400 font-mono">3.94 / 4.0</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Term Attendance:</span>
                <strong className="text-blue-400 font-mono">98.8%</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={onOpenSMS}
              className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
            >
              <span>Launch SMS Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Library OPAC Featured Card */}
        <div className="bg-gradient-to-b from-slate-900 to-emerald-950/30 border border-emerald-800/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative group hover:border-emerald-500 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Library className="w-6 h-6" />
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono font-semibold">
                OPAC Online
              </span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              School Library Catalog (OPAC)
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Search the 42,000+ volume campus book inventory, reserve reserve-shelf study texts, and borrow JSTOR / Libby e-books.
            </p>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Physical Stacks:</span>
                <strong className="text-emerald-400">Open until 7:30 PM</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Loans / Holds:</span>
                <strong className="text-slate-300">1 Book On Hold</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={onOpenLibrary}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
            >
              <span>Search Library Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reading Score Sheet Portal Card */}
        <div className="bg-gradient-to-b from-slate-900 to-amber-950/30 border border-amber-800/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative group hover:border-amber-500 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-500/30 font-mono font-semibold">
                Challenge Log
              </span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Book Score Sheet &amp; Activity Log
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Submit literary reviews, log total pages read, verify comprehension quizzes, and track scholar tier badges for your graduation portfolio.
            </p>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Scholar Points:</span>
                <strong className="text-amber-400 font-mono">955 pts</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Verified Reviews:</span>
                <strong className="text-slate-300">4 Submissions</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={onOpenReadingScore}
              className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
            >
              <span>Open Book Score Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Additional Campus Resource Portals & Custom Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-indigo-400" />
            <span>Campus Directory &amp; Web Resources ({links.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Direct integration links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const Icon = getIcon(link.icon);
            const isDefaultSpecial = link.actionType === 'sms' || link.actionType === 'library' || link.actionType === 'reading';

            return (
              <div
                key={link.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${link.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {link.badge}
                      </span>
                      {link.id.startsWith('custom-') && (
                        <button
                          onClick={() => handleDeleteCustomLink(link.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Delete Custom Bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {link.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  {link.actionType === 'sms' ? (
                    <button
                      onClick={onOpenSMS}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Open SMS Record</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : link.actionType === 'library' ? (
                    <button
                      onClick={onOpenLibrary}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <span>Search Catalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : link.actionType === 'reading' ? (
                    <button
                      onClick={onOpenReadingScore}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <span>View Score Sheet</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>Visit Resource</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <span className="text-[11px] font-mono text-slate-500">
                    {link.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Bookmark Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Add Custom Portal Bookmark</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLink} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Portal Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Canvas LMS or Google Classroom"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Website URL *
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g. https://classroom.google.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Course syllabus and homework assignments"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="e.g. Daily Coursework"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow"
                >
                  Save Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
