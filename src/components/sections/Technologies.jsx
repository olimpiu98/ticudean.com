import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechIcon, Icon } from '../../data/icons';
import Modal from '../ui/Modal';

// Master Pool for Skills (CV Aligned & Expanded)
const SKILLS_POOL = [
  { name: 'HTML5' },
  { name: 'CSS3' },
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Angular' },
  { name: 'Sass' },
  { name: 'Bootstrap' },
  { name: 'Materialize' },
  { name: 'XML' },
  { name: 'Node.js' },
  { name: 'Express.js' },
  { name: 'Python' },
  { name: 'Java' },
  { name: 'Rust' },
  { name: 'Solana' },
  { name: 'REST API' },
  { name: 'PostgreSQL' },
  { name: 'MySQL' },
  { name: 'Oracle APEX' },
  { name: 'Tailwind CSS' }
];

// Master Pool for Tools, Cloud & Environments (CV Aligned & Expanded)
const TOOLS_POOL = [
  { name: 'Cloudflare' },
  { name: 'Linux' },
  { name: 'Ubuntu' },
  { name: 'WSL' },
  { name: 'VirtualBox' },
  { name: 'OVH' },
  { name: 'Navicat' },
  { name: 'WinSCP' },
  { name: 'FileZilla' },
  { name: 'Docker' },
  { name: 'AWS' },
  { name: 'Azure' },
  { name: 'Git' },
  { name: 'GitHub' },
  { name: 'Postman' },
  { name: 'VS Code' },
  { name: 'Nginx' },
  { name: 'Apache' },
  { name: 'Netlify' },
  { name: 'Firebase' }
];

export default function Technologies() {
  const [activeTab, setActiveTab] = useState('skills');
  const [isAllTechModalOpen, setIsAllTechModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('all');

  const activePool = activeTab === 'skills' ? SKILLS_POOL : TOOLS_POOL;

  // Initialize 12 unique items for the 3x4 grid
  const [displayedItems, setDisplayedItems] = useState(() => activePool.slice(0, 12));
  const [activeSlotPointer, setActiveSlotPointer] = useState(0);

  useEffect(() => {
    setDisplayedItems(activePool.slice(0, 12));
    setActiveSlotPointer(0);
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayedItems(prevItems => {
        const nextItems = [...prevItems];
        const targetSlot = activeSlotPointer;

        const currentlyDisplayedNames = nextItems
          .filter((_, idx) => idx !== targetSlot)
          .map(item => item.name);

        const availableCandidates = activePool.filter(
          item => !currentlyDisplayedNames.includes(item.name)
        );

        if (availableCandidates.length > 0) {
          const unusedCandidates = availableCandidates.filter(
            item => item.name !== nextItems[targetSlot]?.name
          );
          const selected = unusedCandidates.length > 0 ? unusedCandidates[0] : availableCandidates[0];
          nextItems[targetSlot] = selected;
        }

        return nextItems;
      });

      setActiveSlotPointer(prev => (prev + 1) % 12);
    }, 1800);

    return () => clearInterval(timer);
  }, [activeSlotPointer, activePool]);

  return (
    <section id="technologies" className="relative z-10 py-28 reveal-section">
      <div className="inner reveal-content">
        
        {/* Seamless 2-Column Layout Without Outer Section Box */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
          
          {/* Left Column: Heading, Description & Category Switch */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between self-stretch">
            <div>
              <div className="section-label mb-4">
                <h2 className="section-heading">
                  What My Programming Skills Include?
                </h2>
              </div>


              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">
                I develop simple, intuitive and responsive user interfaces that help users get things done with less effort and time using my core programming languages, developer tools, and cloud platforms.
              </p>
            </div>

            {/* Sliding Tab Buttons */}
            <div className="mt-8 lg:mt-auto pt-6">
              <div className="relative inline-flex items-center p-1.5 rounded-full bg-surface border border-border backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`relative z-10 px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                    activeTab === 'skills' ? 'text-bg' : 'text-muted hover:text-text'
                  }`}
                >
                  {activeTab === 'skills' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-text rounded-full z-[-1] shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>Skills ({SKILLS_POOL.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('tools')}
                  className={`relative z-10 px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                    activeTab === 'tools' ? 'text-bg' : 'text-muted hover:text-text'
                  }`}
                >
                  {activeTab === 'tools' && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-text rounded-full z-[-1] shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>Tools & Infra ({TOOLS_POOL.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3x4 Grid of Tech Cards (Matching Screenshot Border & Background Aesthetics) */}
          <div className="w-full lg:w-7/12">
            <div className="flex items-center gap-2 text-[11px] font-mono font-medium text-muted mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sequential icon wave</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
              {displayedItems.map((item, slotIdx) => {
                return (
                  <div
                    key={slotIdx}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 group cursor-pointer shadow-sm min-h-[115px]"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center w-full"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-hover/60 border border-border flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                          <TechIcon name={item.name} size={26} useBrandColor={true} />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-text text-center truncate max-w-full">
                          {item.name}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Pro Button CTA */}
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setIsAllTechModalOpen(true)}
                className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-surface border border-border text-text text-xs font-bold tracking-widest uppercase hover:border-border-hover hover:bg-surface-hover transition-all duration-200 shadow-md group"
              >
                <span>Show All Tech & Tools Stack ({SKILLS_POOL.length + TOOLS_POOL.length})</span>
                <Icon name="ArrowRight" size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Directory Modal */}
      <Modal isOpen={isAllTechModalOpen} onClose={() => setIsAllTechModalOpen(false)} size="lg">
        <div className="p-8 md:p-10">
          
          {/* Header & Title with pr-14 clearance */}
          <div className="pr-14 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-muted mb-1 block">Complete Tech Directory</span>
            <h3 className="text-2xl font-bold text-text mb-4">All Programming Languages, Tools & Infrastructure</h3>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border overflow-x-auto pb-px">
              <button
                onClick={() => setModalTab('all')}
                className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${modalTab === 'all' ? 'text-text' : 'text-muted hover:text-text'}`}
              >
                All Tech ({SKILLS_POOL.length + TOOLS_POOL.length})
                {modalTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-text"></span>}
              </button>
              <button
                onClick={() => setModalTab('skills')}
                className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${modalTab === 'skills' ? 'text-text' : 'text-muted hover:text-text'}`}
              >
                Skills ({SKILLS_POOL.length})
                {modalTab === 'skills' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-text"></span>}
              </button>
              <button
                onClick={() => setModalTab('tools')}
                className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${modalTab === 'tools' ? 'text-text' : 'text-muted hover:text-text'}`}
              >
                Tools & Infra ({TOOLS_POOL.length})
                {modalTab === 'tools' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-text"></span>}
              </button>
            </div>
          </div>

          {/* 5-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 max-h-[55vh] overflow-y-auto pr-1.5 custom-scrollbar">
            {(modalTab === 'all' 
              ? [...SKILLS_POOL, ...TOOLS_POOL]
              : modalTab === 'skills' ? SKILLS_POOL : TOOLS_POOL
            ).map((item, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 group cursor-pointer shadow-sm min-h-[105px]"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-hover/80 border border-border flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <TechIcon name={item.name} size={24} useBrandColor={true} />
                </div>
                <span className="text-xs font-bold text-text text-center truncate max-w-full tracking-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </Modal>
    </section>
  );
}
