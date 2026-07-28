import React from 'react';
import { Icon } from '../../data/icons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 py-10 bg-bg border-t border-border">
      <div className="inner flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-wider text-muted select-none">
            &copy; {new Date().getFullYear()} Olimpiu Ticudean
          </span>
        </div>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-5">
          <a href="https://x.com/tic_oli" target="_blank" rel="noreferrer" className="text-muted hover:text-text transition-colors" aria-label="X">
            <Icon name="XSocial" size={16} />
          </a>
          <a href="https://linkedin.com/in/olimpiu-ticudean" target="_blank" rel="noreferrer" className="text-muted hover:text-text transition-colors" aria-label="LinkedIn">
            <Icon name="Linkedin" size={18} />
          </a>
          <a href="https://github.com/olimpiu98" target="_blank" rel="noreferrer" className="text-muted hover:text-text transition-colors" aria-label="GitHub">
            <Icon name="Github" size={18} />
          </a>
          <a href={`mailto:${import.meta.env.VITE_ADMIN_EMAIL || 'contact@ticudean.com'}`} className="text-muted hover:text-text transition-colors" aria-label="Email">
            <Icon name="Mail" size={18} />
          </a>

          <div className="w-px h-3.5 bg-border mx-1"></div>

          <button 
            onClick={scrollToTop}
            className="p-2 text-muted hover:text-text transition-colors rounded-full hover:bg-surface flex items-center justify-center"
            title="Back to top"
            aria-label="Back to top"
          >
            <Icon name="ArrowRight" size={16} className="transform -rotate-90" />
          </button>
        </div>

      </div>
    </footer>
  );
}
