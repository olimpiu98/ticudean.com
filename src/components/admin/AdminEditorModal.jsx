import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function AdminEditorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [projectsList, setProjectsList] = useState([]);
  const [credentialsList, setCredentialsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemType, setItemType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
      setEditingItem(null);
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
      setEditingItem(null);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" zIndex="z-[150]">
      <div className="p-6 md:p-8 relative">
        {/* Toast Notification */}
        {toast && (
          <div className={`absolute top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold shadow-xl border border-border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-surface text-text'}`}>
            {toast.message}
          </div>
        )}

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted block mb-0.5">Control Panel</span>
            <h2 className="text-xl font-bold text-text">
              Content Studio
            </h2>
          </div>

          <div className="flex bg-surface-hover p-1 rounded-lg border border-border shrink-0">
            <button 
              onClick={() => { setActiveTab('projects'); setEditingItem(null); }}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === 'projects' ? 'bg-text text-bg shadow' : 'text-muted hover:text-text'}`}
            >
              Projects ({projectsList.length})
            </button>
            <button 
              onClick={() => { setActiveTab('credentials'); setEditingItem(null); }}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === 'credentials' ? 'bg-text text-bg shadow' : 'text-muted hover:text-text'}`}
            >
              Credentials ({credentialsList.length})
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        {!editingItem && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-surface border border-border rounded-lg px-3.5 py-2 text-xs text-text placeholder:text-muted focus:outline-none focus:border-border-hover transition-colors"
            />
            
            <button 
              onClick={() => { 
                setItemType(activeTab === 'projects' ? 'project' : 'credential'); 
                setEditingItem(activeTab === 'projects' 
                  ? { order: projectsList.length + 1, num: String(projectsList.length + 1).padStart(2, '0') } 
                  : { category: 'certificates', order: credentialsList.length + 1 }
                ); 
              }}
              className="w-full sm:w-auto px-4 py-2 bg-text text-bg text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>+ Add {activeTab === 'projects' ? 'Project' : 'Credential'}</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-muted text-xs">Loading records...</div>
        ) : editingItem ? (
          /* EDIT / CREATE FORM */
          <div className="bg-surface border border-border p-5 rounded-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-text">
                {editingItem.id ? 'Edit' : 'Create New'} {itemType === 'project' ? 'Project' : 'Credential'}
              </h3>
              <button 
                onClick={() => setEditingItem(null)} 
                className="text-xs text-muted hover:text-text uppercase font-bold tracking-wider px-2.5 py-1 rounded border border-border hover:bg-surface-hover transition-all"
              >
                Cancel
              </button>
            </div>

            {itemType === 'project' ? (
              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Display Order Position (1, 2, 3...)</label>
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
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      placeholder="1"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Title</label>
                    <input 
                      type="text" 
                      value={editingItem.title || ''} 
                      onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Project Image & Gradient Controls */}
                <div className="space-y-3 p-3.5 bg-surface-hover/50 border border-border rounded-xl">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                      🖼️ Project Image URL or Path
                    </label>
                    <input 
                      type="text" 
                      value={editingItem.image || editingItem.imageUrl || ''} 
                      onChange={e => setEditingItem({...editingItem, image: e.target.value, imageUrl: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      placeholder="https://example.com/image.jpg or /images/project.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                      🎨 Custom Gradient (Fallback if no image)
                    </label>
                    <input 
                      type="text" 
                      value={editingItem.gradient || ''} 
                      onChange={e => setEditingItem({...editingItem, gradient: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none font-mono"
                      placeholder="linear-gradient(135deg, #6366f1, #a855f7)"
                    />
                  </div>

                  {/* Thumbnail / Gradient Preview */}
                  {(editingItem.image || editingItem.imageUrl || editingItem.gradient) && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1.5">Card Header Preview:</span>
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

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Description</label>
                  <textarea 
                    rows={3} 
                    value={editingItem.desc || ''} 
                    onChange={e => setEditingItem({...editingItem, desc: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none leading-relaxed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : editingItem.tags || ''} 
                    onChange={e => setEditingItem({...editingItem, tags: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                    placeholder="React, TypeScript, Tailwind"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Key Features (One feature per line)</label>
                  <textarea 
                    rows={3} 
                    value={Array.isArray(editingItem.features) ? editingItem.features.join('\n') : editingItem.features || ''} 
                    onChange={e => setEditingItem({...editingItem, features: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none leading-relaxed"
                    placeholder="Feature 1&#10;Feature 2"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-lg border border-border text-xs font-bold text-muted uppercase tracking-wider hover:text-text">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-lg bg-text text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90">Save Project</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveCredential} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Category</label>
                    <select 
                      value={editingItem.category || 'certificates'}
                      onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                    >
                      <option value="certificates">certificates</option>
                      <option value="education">education</option>
                      <option value="skills">skills</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Display Order Position (1, 2...)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={editingItem.order || ''} 
                      onChange={e => setEditingItem({...editingItem, order: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      placeholder="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Badge Label</label>
                    <input 
                      type="text" 
                      value={editingItem.badge || ''} 
                      onChange={e => setEditingItem({...editingItem, badge: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      placeholder="e.g. Degree, Certification"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Title</label>
                    <input 
                      type="text" 
                      value={editingItem.title || ''} 
                      onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Issuer / Institution</label>
                    <input 
                      type="text" 
                      value={editingItem.issuer || ''} 
                      onChange={e => setEditingItem({...editingItem, issuer: e.target.value})}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Year / Duration</label>
                  <input 
                    type="text" 
                    value={editingItem.date || ''} 
                    onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none"
                    placeholder="2024 or 2018 - 2022"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Description</label>
                  <textarea 
                    rows={3} 
                    value={editingItem.desc || ''} 
                    onChange={e => setEditingItem({...editingItem, desc: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text focus:border-text/40 outline-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-lg border border-border text-xs font-bold text-muted uppercase tracking-wider hover:text-text">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-lg bg-text text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90">Save Credential</button>
                </div>
              </form>
            )}
          </div>
        ) : activeTab === 'projects' ? (
          /* PROJECTS LIST WITH AUTOMATIC COMPUTED NUMBER FROM ORDER */
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-10 text-muted text-xs">No projects found.</div>
            ) : (
              filteredProjects.map((p, idx) => {
                const computedNum = String(idx + 1).padStart(2, '0');
                return (
                  <div key={p.id || idx} className="p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between gap-4 hover:border-border-hover transition-all">
                    <div className="flex items-center gap-3">
                      {/* Re-order Controls */}
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => handleMoveProject(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => handleMoveProject(idx, 1)}
                          disabled={idx === filteredProjects.length - 1}
                          className="p-1 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Move Down"
                        >
                          ▼
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono text-muted">{computedNum}</span>

                      {/* Thumbnail if image exists */}
                      {(p.image || p.imageUrl) && (
                        <img 
                          src={p.image || p.imageUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" 
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}

                      <div>
                        <h4 className="font-bold text-text text-xs">{p.title}</h4>
                        <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{p.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => { setItemType('project'); setEditingItem({ ...p, order: idx + 1, num: computedNum }); }}
                        className="px-3 py-1 bg-surface-hover hover:bg-surface text-text text-[11px] rounded font-semibold transition-colors border border-border"
                      >
                        Edit
                      </button>
                      {p.id && (
                        <button 
                          onClick={() => handleDeleteProject(p.id)}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/30 text-red-400 text-[11px] rounded font-semibold transition-colors border border-red-500/20"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* CREDENTIALS LIST */
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
            {filteredCredentials.length === 0 ? (
              <div className="text-center py-10 text-muted text-xs">No credentials found.</div>
            ) : (
              filteredCredentials.map((c, idx) => (
                <div key={c.id || idx} className="p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between gap-4 hover:border-border-hover transition-all">
                  <div className="flex items-center gap-3">
                    {/* Re-order Controls */}
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => handleMoveCredential(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => handleMoveCredential(idx, 1)}
                        disabled={idx === filteredCredentials.length - 1}
                        className="p-1 rounded hover:bg-surface-hover text-muted hover:text-text disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-semibold uppercase px-2 py-0.5 bg-surface-hover border border-border text-muted rounded">{c.category}</span>
                        <h4 className="font-bold text-text text-xs">{c.title}</h4>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{c.issuer} ({c.date}) — {c.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => { setItemType('credential'); setEditingItem({ ...c, order: idx + 1 }); }}
                      className="px-3 py-1 bg-surface-hover hover:bg-surface text-text text-[11px] rounded font-semibold transition-colors border border-border"
                    >
                      Edit
                    </button>
                    {c.id && (
                      <button 
                        onClick={() => handleDeleteCredential(c.id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/30 text-red-400 text-[11px] rounded font-semibold transition-colors border border-red-500/20"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
