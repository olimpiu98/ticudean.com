import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// Inline SVG icons to avoid dependency on missing lucide icons
const ChevronUp = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
);
const ChevronDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const GripIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>
);
const CheckCircleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const AlertIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const FolderIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
);
const SearchIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const ArrowLeftIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

export default function AdminEditorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [projectsList, setProjectsList] = useState([]);
  const [credentialsList, setCredentialsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemType, setItemType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [viewTransition, setViewTransition] = useState('list'); // 'list' | 'form'
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type, startTime: Date.now() });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const projSnap = await getDocs(collection(db, 'personal_data/projects/items'));
      const projs = [];
      projSnap.forEach(d => projs.push({ id: d.id, ...d.data() }));
      setProjectsList(projs.sort((a,b) => (a.order || 0) - (b.order || 0)));

      const credSnap = await getDocs(collection(db, 'personal_data/certifications/items'));
      const creds = [];
      credSnap.forEach(d => creds.push({ id: d.id, ...d.data() }));
      setCredentialsList(creds.sort((a,b) => (a.order || 0) - (b.order || 0)));
    } catch (e) {
      console.error("Error loading data:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  // Smooth transition helpers
  const openEditForm = (type, item) => {
    setItemType(type);
    setEditingItem(item);
    setViewTransition('form');
  };

  const closeEditForm = () => {
    setViewTransition('list');
    // Small delay so animation plays before clearing
    setTimeout(() => setEditingItem(null), 150);
  };

  // Keyboard shortcut: Ctrl+Enter to save
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && editingItem) {
        const form = document.querySelector('#editor-form');
        if (form) form.requestSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editingItem]);

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!db) return;
    try {
      const docId = editingItem.id || `project_${Date.now()}`;
      const docRef = doc(db, 'personal_data/projects/items', docId);
      const tagsArray = typeof editingItem.tags === 'string' 
        ? editingItem.tags.split(',').map(t => t.trim()).filter(Boolean)
        : (editingItem.tags || []);
      const featuresArray = typeof editingItem.features === 'string'
        ? editingItem.features.split('\n').map(f => f.trim()).filter(Boolean)
        : (editingItem.features || []);

      const targetOrder = Number(editingItem.order) || projectsList.length + 1;
      const formattedNum = String(targetOrder).padStart(2, '0');

      const payload = {
        ...editingItem,
        tags: tagsArray,
        features: featuresArray,
        image: editingItem.image || editingItem.imageUrl || '',
        order: targetOrder,
        num: formattedNum
      };

      await setDoc(docRef, payload, { merge: true });
      showToast("Project saved successfully!");
      closeEditForm();
      fetchData();
    } catch (err) {
      showToast("Failed to save project: " + err.message, "error");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Delete this project from your database?")) return;
    try {
      await deleteDoc(doc(db, 'personal_data/projects/items', id));
      showToast("Project deleted!");
      fetchData();
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  const handleMoveProject = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projectsList.length) return;

    const updated = [...projectsList];
    const currentItem = updated[index];
    const targetItem = updated[targetIndex];

    // Swap display order
    const currentOrder = currentItem.order || (index + 1);
    const targetOrder = targetItem.order || (targetIndex + 1);

    currentItem.order = targetOrder;
    currentItem.num = String(targetOrder).padStart(2, '0');

    targetItem.order = currentOrder;
    targetItem.num = String(currentOrder).padStart(2, '0');

    setProjectsList([...updated].sort((a,b) => (a.order || 0) - (b.order || 0)));

    if (db) {
      try {
        if (currentItem.id) {
          await setDoc(doc(db, 'personal_data/projects/items', currentItem.id), { order: targetOrder, num: currentItem.num }, { merge: true });
        }
        if (targetItem.id) {
          await setDoc(doc(db, 'personal_data/projects/items', targetItem.id), { order: currentOrder, num: targetItem.num }, { merge: true });
        }
        showToast("Re-ordered projects successfully!");
      } catch (err) {
        showToast("Re-order save failed: " + err.message, "error");
      }
    }
  };

  const handleSaveCredential = async (e) => {
    e.preventDefault();
    if (!db) return;
    try {
      const docId = editingItem.id || `cred_${Date.now()}`;
      const docRef = doc(db, 'personal_data/certifications/items', docId);
      const targetOrder = Number(editingItem.order) || credentialsList.length + 1;

      const payload = {
        ...editingItem,
        order: targetOrder
      };

      await setDoc(docRef, payload, { merge: true });
      showToast("Credential saved successfully!");
      closeEditForm();
      fetchData();
    } catch (err) {
      showToast("Failed to save credential: " + err.message, "error");
    }
  };

  const handleDeleteCredential = async (id) => {
    if (!confirm("Delete this credential from your database?")) return;
    try {
      await deleteDoc(doc(db, 'personal_data/certifications/items', id));
      showToast("Credential deleted!");
      fetchData();
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  const handleMoveCredential = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= credentialsList.length) return;

    const updated = [...credentialsList];
    const currentItem = updated[index];
    const targetItem = updated[targetIndex];

    const currentOrder = currentItem.order || (index + 1);
    const targetOrder = targetItem.order || (targetIndex + 1);

    currentItem.order = targetOrder;
    targetItem.order = currentOrder;

    setCredentialsList([...updated].sort((a,b) => (a.order || 0) - (b.order || 0)));

    if (db) {
      try {
        if (currentItem.id) {
          await setDoc(doc(db, 'personal_data/certifications/items', currentItem.id), { order: targetOrder }, { merge: true });
        }
        if (targetItem.id) {
          await setDoc(doc(db, 'personal_data/certifications/items', targetItem.id), { order: currentOrder }, { merge: true });
        }
        showToast("Re-ordered credentials successfully!");
      } catch (err) {
        showToast("Re-order save failed: " + err.message, "error");
      }
    }
  };

  const filteredProjects = projectsList.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCredentials = credentialsList.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.issuer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentList = activeTab === 'projects' ? filteredProjects : filteredCredentials;

  // ─── Reusable field label component ───
  const FieldLabel = ({ children, hint }) => (
    <label className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{children}</span>
      {hint && <span className="text-[9px] text-muted/60 font-mono">{hint}</span>}
    </label>
  );

  // ─── Character count for textareas ───
  const CharCount = ({ value, max = 500 }) => {
    const len = (value || '').length;
    return (
      <span className={`text-[9px] font-mono mt-1 block text-right ${len > max ? 'text-red-400' : 'text-muted/50'}`}>
        {len}{max ? ` / ${max}` : ''}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" zIndex="z-[150]">
      <div className="relative flex flex-col" style={{ minHeight: '420px' }}>

        {/* ═══ TOAST NOTIFICATION ═══ */}
        <div 
          className={`fixed top-6 right-6 z-[200] transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}
        >
          {toast && (
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl border backdrop-blur-xl ${
              toast.type === 'error' 
                ? 'bg-red-500/90 text-white border-red-400/30' 
                : 'bg-surface text-text border-border'
            }`}>
              {toast.type === 'error' ? <AlertIcon size={14} /> : <CheckCircleIcon size={14} />}
              <span>{toast.message}</span>
              {/* Progress drain bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden">
                <div 
                  className={`h-full ${toast.type === 'error' ? 'bg-red-300' : 'bg-accent'}`}
                  style={{ animation: 'toast-drain 3.5s linear forwards' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ═══ STICKY HEADER ═══ */}
        <div className="sticky top-0 z-20 bg-surface border-b border-border px-6 pt-5 pb-4 rounded-t-3xl">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title or Back button */}
            <div className="flex items-center gap-3 min-w-0">
              {editingItem ? (
                <>
                  <button 
                    onClick={closeEditForm}
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-text transition-colors shrink-0"
                    title="Back to list"
                  >
                    <ArrowLeftIcon size={18} />
                  </button>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-muted block">
                      {editingItem.id ? 'Editing' : 'Creating New'}
                    </span>
                    <h2 className="text-base font-bold text-text truncate">
                      {editingItem.title || (itemType === 'project' ? 'New Project' : 'New Credential')}
                    </h2>
                  </div>
                </>
              ) : (
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-0.5">Control Panel</span>
                  <h2 className="text-xl font-bold text-text">Content Studio</h2>
                </div>
              )}
            </div>

            {/* Right: Tabs (only in list mode) — positioned away from modal close button */}
            {!editingItem && (
              <div className="flex bg-surface-hover p-1 rounded-lg border border-border shrink-0 mr-10">
                <button 
                  onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === 'projects' ? 'bg-text text-bg shadow' : 'text-muted hover:text-text'}`}
                >
                  Projects ({projectsList.length})
                </button>
                <button 
                  onClick={() => { setActiveTab('credentials'); setSearchQuery(''); }}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === 'credentials' ? 'bg-text text-bg shadow' : 'text-muted hover:text-text'}`}
                >
                  Credentials ({credentialsList.length})
                </button>
              </div>
            )}

            {/* Save / Cancel buttons when editing (in header for sticky access) */}
            {editingItem && (
              <div className="flex items-center gap-2 shrink-0 mr-10">
                <button 
                  type="button" 
                  onClick={closeEditForm} 
                  className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-bold text-muted uppercase tracking-wider hover:text-text hover:bg-surface-hover transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const form = document.querySelector('#editor-form');
                    if (form) form.requestSubmit();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-text text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  Save
                  <span className="text-[9px] opacity-60 font-mono hidden sm:inline">⌘↵</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ BODY ═══ */}
        <div className={`flex-1 px-6 py-5 transition-all duration-200 ${viewTransition === 'form' ? 'animate-slide-in' : ''}`}>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-6 h-6 border-2 border-border border-t-text rounded-full animate-spin" />
              <span className="text-muted text-xs">Loading records...</span>
            </div>
          ) : editingItem ? (
            /* ═══════════════════════════════════════════════
               EDIT / CREATE FORM
               ═══════════════════════════════════════════════ */
            <div>
              {itemType === 'project' ? (
                <form id="editor-form" onSubmit={handleSaveProject} className="space-y-5">
                  {/* Section: Basic Info */}
                  <div>
                    <div className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Basic Info</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <FieldLabel hint="e.g. 1, 2, 3">Display Order</FieldLabel>
                        <input 
                          type="number" 
                          min="1"
                          value={editingItem.order || ''} 
                          onChange={e => {
                            const val = e.target.value;
                            setEditingItem({
                              ...editingItem, 
                              order: val,
                              num: val ? String(val).padStart(2, '0') : ''
                            });
                          }}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          placeholder="1"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>Title</FieldLabel>
                        <input 
                          type="text" 
                          value={editingItem.title || ''} 
                          onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Media */}
                  <div>
                    <div className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Media</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="space-y-3 p-4 bg-surface-hover/30 border border-border/60 rounded-xl">
                      <div>
                        <FieldLabel>🖼️ Project Image URL or Path</FieldLabel>
                        <input 
                          type="text" 
                          value={editingItem.image || editingItem.imageUrl || ''} 
                          onChange={e => setEditingItem({...editingItem, image: e.target.value, imageUrl: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          placeholder="https://example.com/image.jpg or /images/project.jpg"
                        />
                      </div>

                      <div>
                        <FieldLabel>🎨 Custom Gradient (Fallback)</FieldLabel>
                        <input 
                          type="text" 
                          value={editingItem.gradient || ''} 
                          onChange={e => setEditingItem({...editingItem, gradient: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none font-mono transition-all"
                          placeholder="linear-gradient(135deg, #6366f1, #a855f7)"
                        />
                      </div>

                      {/* Thumbnail / Gradient Preview */}
                      {(editingItem.image || editingItem.imageUrl || editingItem.gradient) && (
                        <div className="mt-2 pt-3 border-t border-border/50">
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-2">Card Header Preview</span>
                          <div 
                            className="h-20 w-full rounded-lg relative overflow-hidden border border-border flex items-center justify-center p-3"
                            style={{ background: editingItem.gradient || 'linear-gradient(135deg, #0f172a, #1e293b)' }}
                          >
                            {(editingItem.image || editingItem.imageUrl) ? (
                              <img 
                                src={editingItem.image || editingItem.imageUrl} 
                                alt="Preview" 
                                className="absolute inset-0 w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : null}
                            <div className="relative z-10 text-xs font-mono font-bold text-white/90 drop-shadow flex items-center gap-2">
                              <span className="text-white/60 font-mono">[{editingItem.num || String(editingItem.order || 1).padStart(2, '0')}]</span>
                              <span>{editingItem.title || 'Project Preview'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section: Details */}
                  <div>
                    <div className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Details</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <FieldLabel hint={`${(editingItem.desc || '').length}/500`}>Description</FieldLabel>
                        <textarea 
                          rows={3} 
                          value={editingItem.desc || ''} 
                          onChange={e => setEditingItem({...editingItem, desc: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none leading-relaxed transition-all resize-none"
                          required
                        />
                      </div>

                      <div>
                        <FieldLabel hint="comma separated">Tags</FieldLabel>
                        <input 
                          type="text" 
                          value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : editingItem.tags || ''} 
                          onChange={e => setEditingItem({...editingItem, tags: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          placeholder="React, TypeScript, Tailwind"
                        />
                      </div>

                      <div>
                        <FieldLabel hint="one per line">Key Features</FieldLabel>
                        <textarea 
                          rows={3} 
                          value={Array.isArray(editingItem.features) ? editingItem.features.join('\n') : editingItem.features || ''} 
                          onChange={e => setEditingItem({...editingItem, features: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none leading-relaxed transition-all resize-none"
                          placeholder={"Feature 1\nFeature 2"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Save Bar (secondary, always visible at end of form) */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-[9px] text-muted/50 font-mono hidden sm:block">Ctrl + Enter to save</span>
                    <div className="flex gap-2.5 ml-auto">
                      <button type="button" onClick={closeEditForm} className="px-4 py-2 rounded-lg border border-border text-xs font-bold text-muted uppercase tracking-wider hover:text-text hover:bg-surface-hover transition-all">Cancel</button>
                      <button type="submit" className="px-5 py-2 rounded-lg bg-text text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">Save Project</button>
                    </div>
                  </div>
                </form>
              ) : (
                <form id="editor-form" onSubmit={handleSaveCredential} className="space-y-5">
                  {/* Section: Classification */}
                  <div>
                    <div className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Classification</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <FieldLabel>Category</FieldLabel>
                        <select 
                          value={editingItem.category || 'certificates'}
                          onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                        >
                          <option value="certificates">certificates</option>
                          <option value="education">education</option>
                          <option value="skills">skills</option>
                        </select>
                      </div>
                      <div>
                        <FieldLabel hint="e.g. 1, 2">Display Order</FieldLabel>
                        <input 
                          type="number" 
                          min="1"
                          value={editingItem.order || ''} 
                          onChange={e => setEditingItem({...editingItem, order: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          placeholder="1"
                          required
                        />
                      </div>
                      <div>
                        <FieldLabel>Badge Label</FieldLabel>
                        <input 
                          type="text" 
                          value={editingItem.badge || ''} 
                          onChange={e => setEditingItem({...editingItem, badge: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          placeholder="e.g. Degree, Certification"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Details */}
                  <div>
                    <div className="text-[10px] font-bold text-muted/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span>Details</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>Title</FieldLabel>
                          <input 
                            type="text" 
                            value={editingItem.title || ''} 
                            onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <FieldLabel>Issuer / Institution</FieldLabel>
                          <input 
                            type="text" 
                            value={editingItem.issuer || ''} 
                            onChange={e => setEditingItem({...editingItem, issuer: e.target.value})}
                            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabel>Year / Duration</FieldLabel>
                        <input 
                          type="text" 
                          value={editingItem.date || ''} 
                          onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none transition-all"
                          placeholder="2024 or 2018 - 2022"
                          required
                        />
                      </div>

                      <div>
                        <FieldLabel hint={`${(editingItem.desc || '').length}/500`}>Description</FieldLabel>
                        <textarea 
                          rows={3} 
                          value={editingItem.desc || ''} 
                          onChange={e => setEditingItem({...editingItem, desc: e.target.value})}
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 focus:ring-1 focus:ring-text/10 outline-none leading-relaxed transition-all resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Save Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-[9px] text-muted/50 font-mono hidden sm:block">Ctrl + Enter to save</span>
                    <div className="flex gap-2.5 ml-auto">
                      <button type="button" onClick={closeEditForm} className="px-4 py-2 rounded-lg border border-border text-xs font-bold text-muted uppercase tracking-wider hover:text-text hover:bg-surface-hover transition-all">Cancel</button>
                      <button type="submit" className="px-5 py-2 rounded-lg bg-text text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">Save Credential</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ═══════════════════════════════════════════════
               LIST VIEW
               ═══════════════════════════════════════════════ */
            <>
              {/* Search & Add Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                    <SearchIcon size={13} />
                  </span>
                  <input 
                    type="text" 
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg pl-8 pr-3.5 py-2 text-xs text-text placeholder:text-muted focus:outline-none focus:border-border-hover focus:ring-1 focus:ring-text/10 transition-all"
                  />
                  {searchQuery && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted font-mono">
                      {currentList.length} found
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={() => { 
                    const type = activeTab === 'projects' ? 'project' : 'credential';
                    openEditForm(
                      type,
                      activeTab === 'projects' 
                        ? { order: projectsList.length + 1, num: String(projectsList.length + 1).padStart(2, '0') } 
                        : { category: 'certificates', order: credentialsList.length + 1 }
                    );
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-text text-bg text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 hover:shadow-lg hover:shadow-text/5"
                >
                  <PlusIcon size={13} />
                  <span>Add {activeTab === 'projects' ? 'Project' : 'Credential'}</span>
                </button>
              </div>

              {/* Items list */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                {currentList.length === 0 ? (
                  /* ── Friendly empty state ── */
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="text-muted/30">
                      <FolderIcon size={48} />
                    </div>
                    <p className="text-muted text-xs">
                      {searchQuery ? `No ${activeTab} match "${searchQuery}"` : `No ${activeTab} yet.`}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => {
                          const type = activeTab === 'projects' ? 'project' : 'credential';
                          openEditForm(
                            type,
                            activeTab === 'projects'
                              ? { order: 1, num: '01' }
                              : { category: 'certificates', order: 1 }
                          );
                        }}
                        className="px-4 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-text hover:bg-surface-hover transition-all flex items-center gap-1.5"
                      >
                        <PlusIcon size={12} /> Create your first {activeTab === 'projects' ? 'project' : 'credential'}
                      </button>
                    )}
                  </div>
                ) : activeTab === 'projects' ? (
                  filteredProjects.map((p, idx) => {
                    const computedNum = String(idx + 1).padStart(2, '0');
                    return (
                      <div 
                        key={p.id || idx} 
                        className="group p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between gap-4 hover:border-border-hover hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Reorder Controls */}
                          <div className="flex flex-col items-center gap-px shrink-0">
                            <button 
                              onClick={() => handleMoveProject(idx, -1)}
                              disabled={idx === 0}
                              className="p-0.5 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                              title="Move Up"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <span className="text-muted/30 group-hover:text-muted/50 transition-colors">
                              <GripIcon size={12} />
                            </span>
                            <button 
                              onClick={() => handleMoveProject(idx, 1)}
                              disabled={idx === filteredProjects.length - 1}
                              className="p-0.5 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                              title="Move Down"
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>

                          <span className="text-[10px] font-bold font-mono text-muted/50 shrink-0">{computedNum}</span>

                          {/* Thumbnail */}
                          {(p.image || p.imageUrl) && (
                            <img 
                              src={p.image || p.imageUrl} 
                              alt="" 
                              className="w-9 h-9 rounded-lg object-cover border border-border shrink-0 group-hover:border-border-hover transition-colors" 
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}

                          <div className="min-w-0">
                            <h4 className="font-bold text-text text-xs truncate">{p.title}</h4>
                            <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{p.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditForm('project', { ...p, order: idx + 1, num: computedNum })}
                            className="px-3 py-1.5 bg-surface-hover hover:bg-bg text-text text-[11px] rounded-lg font-semibold transition-colors border border-border"
                          >
                            Edit
                          </button>
                          {p.id && (
                            <button 
                              onClick={() => handleDeleteProject(p.id)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] rounded-lg font-semibold transition-colors border border-red-500/20"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  filteredCredentials.map((c, idx) => (
                    <div 
                      key={c.id || idx} 
                      className="group p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between gap-4 hover:border-border-hover hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Reorder Controls */}
                        <div className="flex flex-col items-center gap-px shrink-0">
                          <button 
                            onClick={() => handleMoveCredential(idx, -1)}
                            disabled={idx === 0}
                            className="p-0.5 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                            title="Move Up"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <span className="text-muted/30 group-hover:text-muted/50 transition-colors">
                            <GripIcon size={12} />
                          </span>
                          <button 
                            onClick={() => handleMoveCredential(idx, 1)}
                            disabled={idx === filteredCredentials.length - 1}
                            className="p-0.5 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-semibold uppercase px-2 py-0.5 bg-surface-hover border border-border text-muted rounded">{c.category}</span>
                            <h4 className="font-bold text-text text-xs truncate">{c.title}</h4>
                          </div>
                          <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{c.issuer} ({c.date}) — {c.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditForm('credential', { ...c, order: idx + 1 })}
                          className="px-3 py-1.5 bg-surface-hover hover:bg-bg text-text text-[11px] rounded-lg font-semibold transition-colors border border-border"
                        >
                          Edit
                        </button>
                        {c.id && (
                          <button 
                            onClick={() => handleDeleteCredential(c.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] rounded-lg font-semibold transition-colors border border-red-500/20"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keyframe for toast progress bar */}
      <style>{`
        @keyframes toast-drain {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in-up 0.2s ease-out;
        }
      `}</style>
    </Modal>
  );
}
