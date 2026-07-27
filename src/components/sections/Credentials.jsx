import React, { useState } from 'react';
import { useCredentials } from '../../hooks/useCredentials';
import Modal from '../ui/Modal';
import { Icon } from '../../data/icons';
import { SkeletonCredentialCard } from '../ui/Skeleton';

export default function Credentials() {
  const { credentials, loading } = useCredentials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'education' | 'certificates'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalFilter, setModalFilter] = useState('all');

  // Filter main section items based on tab
  const displayedItems = activeTab === 'all' 
    ? credentials 
    : credentials.filter(c => c.category === activeTab);

  // Filter modal items based on tab + search query
  const modalItems = credentials.filter(item => {
    const matchesTab = modalFilter === 'all' || item.category === modalFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section id="credentials" className="relative z-10 py-28 reveal-section">
      <div className="inner">
        
        {/* Section Header Matching Selected Projects Design */}
        <div className="section-label reveal-content">
          <h2 className="section-heading">Selected <strong>Credentials</strong></h2>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 reveal-content d1">
          {loading ? (
            <>
              <SkeletonCredentialCard />
              <SkeletonCredentialCard />
              <SkeletonCredentialCard />
            </>
          ) : displayedItems.length === 0 ? (
            <div className="col-span-full p-12 text-center border border-dashed border-border rounded-2xl bg-surface/40">
              <span className="text-3xl mb-3 block">📜</span>
              <h3 className="text-sm font-bold text-text mb-1">No Items Found</h3>
              <p className="text-xs text-muted">No credentials matched the selected tab filter.</p>
            </div>
          ) : (
            displayedItems.slice(0, 3).map((item, idx) => {
              const isEdu = item.category === 'education';
              return (
                <div 
                  key={item.id || idx}
                  className="p-6 sm:p-7 rounded-3xl bg-surface border border-border flex flex-col justify-between hover:border-border-hover hover:bg-surface-hover/70 transition-all duration-300 shadow-sm group hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                >
                  {/* Category Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${isEdu ? 'bg-emerald-500/80' : 'bg-blue-500/80'}`}></div>

                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isEdu ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          <Icon name={isEdu ? "GraduationCap" : "Shield"} size={16} />
                        </div>
                        <span className="px-2.5 py-1 bg-surface-hover border border-border rounded-lg text-[10px] font-bold text-text uppercase tracking-wider">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-muted">
                        {item.date}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-extrabold text-text mb-2.5 leading-snug group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-6 line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  {/* Footer Issuer & Location */}
                  <div className="pt-4 border-t border-border mt-auto flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-text truncate">{item.issuer}</span>
                    {item.location && (
                      <span className="text-[10px] font-mono text-muted shrink-0 px-2 py-0.5 rounded bg-surface-hover/80 border border-border/60">
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pro Action CTA Button */}
        <div className="mt-14 text-center reveal-content d2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-surface hover:bg-surface-hover border border-border text-text text-xs font-bold tracking-widest uppercase active:scale-[0.98] transition-all duration-200 shadow-md group"
          >
            <Icon name="Search" size={15} className="text-muted group-hover:text-text transition-colors" />
            <span>Open Full Vault Directory ({credentials.length})</span>
            <Icon name="ArrowRight" size={14} className="transform group-hover:translate-x-1 transition-transform text-accent" />
          </button>
        </div>
      </div>

      {/* Credentials Vault Directory Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <div className="p-6 sm:p-10 flex flex-col max-h-[85vh]">
          
          {/* Modal Header with Safe Padding for Close Button */}
          <div className="mb-6 pb-6 border-b border-border pr-12 sm:pr-14">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1 block">
              Credentials Directory
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-text mb-5">
              Complete Qualification Vault
            </h3>

            {/* Filter Tabs & Search Box Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                {['all', 'education', 'certificates'].map(t => (
                  <button
                    key={t}
                    onClick={() => setModalFilter(t)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      modalFilter === t 
                        ? 'bg-text text-bg shadow-sm' 
                        : 'bg-surface hover:bg-surface-hover border border-border text-muted hover:text-text'
                    }`}
                  >
                    {t === 'all' ? `All Items (${credentials.length})` : t}
                  </button>
                ))}
              </div>

              {/* Search Box with High Contrast Dark/Light Theme Colors */}
              <div className="relative w-full sm:w-72 shrink-0">
                <input
                  type="text"
                  placeholder="Search degree, cert, issuer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 pr-14 rounded-xl bg-surface border border-border text-text placeholder:text-muted text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
                />
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-hover border border-border text-[9px] font-mono font-bold text-muted hover:text-text uppercase tracking-wider transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Modal Directory Table / List */}
          <div className="overflow-y-auto custom-scrollbar pr-1 flex-grow">
            {modalItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted font-mono">
                No matching credentials found for "{searchQuery}".
              </div>
            ) : (
              <div className="space-y-3">
                {modalItems.map((item, i) => {
                  const isEdu = item.category === 'education';
                  return (
                    <div 
                      key={item.id || i}
                      className="p-4 rounded-2xl bg-surface hover:bg-surface-hover/60 border border-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isEdu ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          <Icon name={isEdu ? "GraduationCap" : "Shield"} size={17} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-bold text-text text-xs sm:text-sm group-hover:text-accent transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-surface-hover border border-border rounded-md text-muted">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-muted line-clamp-2">
                            {item.desc}
                          </p>
                          <div className="text-[11px] font-semibold text-text mt-1.5 flex items-center gap-2">
                            <span>{item.issuer}</span>
                            {item.location && <span className="text-muted font-mono text-[10px]">&bull; {item.location}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 self-end sm:self-center">
                        <span className="text-xs font-mono font-bold text-muted bg-surface-hover/80 px-2.5 py-1 rounded-lg border border-border/60">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}
