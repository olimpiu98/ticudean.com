import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Icon } from '../../data/icons';

export default function Hero() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-[var(--edge)] pb-16 pt-28">
        
        {/* Oversized Clean Title */}
        <h1 className="flex flex-col gap-0 text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-text select-none">
          <span>Digital</span>
          <span>Experience</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[clamp(1rem,1.8vw,1.25rem)] text-muted mt-8 max-w-[560px] leading-relaxed font-normal">
          BSc (Hons) Computing graduate crafting high-performance, scalable web applications with clean architecture and modern user interfaces.
        </p>

        {/* Evidenced Primary CTA & Compact Secondary CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          
          {/* Evidenced High-Impact Primary Resume Access Button */}
          <button 
            onClick={() => setIsResumeModalOpen(true)}
            className="group relative inline-flex items-center gap-3.5 px-9 py-4 rounded-full bg-text text-bg text-xs font-extrabold tracking-widest uppercase hover:opacity-95 active:scale-[0.98] transition-all duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-[1.02]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span>Request Resume Access</span>
          </button>
        </div>

      </section>

      {/* Resume Confirmation Modal */}
      <Modal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} size="sm">
        <div className="text-center p-8 md:p-10">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-surface border border-border flex items-center justify-center text-text shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">External Redirect</span>
          <h3 className="text-xl font-bold text-text mt-1">Google Drive Access Required</h3>
          <p className="text-xs text-muted mt-3 leading-relaxed">You will be redirected to view or request access to this resume on Google Drive.</p>
          <div className="flex justify-center mt-8 gap-3">
            <button onClick={() => setIsResumeModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-border text-xs font-bold text-text uppercase tracking-wider hover:bg-surface-hover active:scale-[0.98] transition-all min-w-[100px]">Stay</button>
            <a href="https://drive.google.com/file/d/1TZ674L-vCsFTWNroMkuOkSvD2MXJ8lmq/view?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => setIsResumeModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-text text-bg text-xs font-extrabold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all min-w-[110px] flex items-center justify-center gap-2">
              <span>Proceed</span>
              <Icon name="ArrowRight" size={14} />
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
