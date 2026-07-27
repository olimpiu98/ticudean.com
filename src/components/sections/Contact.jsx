import React from 'react';
import { Icon } from '../../data/icons';

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 py-28 bg-surface/30 reveal-section">
      <div className="inner">
        <div className="section-label reveal-content">
          <h2 className="section-heading">Get In <strong>Touch</strong></h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between mt-8">
          {/* Left Column: Main Headline & Subtitle */}
          <div className="w-full lg:w-6/12">
            <h3 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold text-text leading-[1.05] tracking-tight mb-6 text-left reveal-content d1">
              Let's build something <br />
              extraordinary together.
            </h3>

            <p className="text-muted text-sm sm:text-base max-w-lg mb-6 font-normal leading-relaxed text-left reveal-content d2">
              Available for full-stack engineering roles, freelance opportunities, and collaborative web application projects.
            </p>
          </div>

          {/* Right Column: Contact Cards Matching Unified Border Theme */}
          <div className="w-full lg:w-6/12 flex flex-col gap-4 reveal-content d2">
            <a 
              href="https://x.com/tic_oli"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface-hover/60 border border-border flex items-center justify-center text-text group-hover:scale-105 transition-transform">
                  <Icon name="XSocial" size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Social Network</span>
                  <span className="text-xs font-bold text-text">X Profile</span>
                </div>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted group-hover:text-text transform group-hover:translate-x-1 transition-all" />
            </a>

            <a 
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface-hover/60 border border-border flex items-center justify-center text-text group-hover:scale-105 transition-transform">
                  <Icon name="Linkedin" size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Professional Network</span>
                  <span className="text-xs font-bold text-text">LinkedIn Profile</span>
                </div>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted group-hover:text-text transform group-hover:translate-x-1 transition-all" />
            </a>

            <a 
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all duration-200 flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface-hover/60 border border-border flex items-center justify-center text-text group-hover:scale-105 transition-transform">
                  <Icon name="Github" size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Source Repositories</span>
                  <span className="text-xs font-bold text-text">GitHub Profile</span>
                </div>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted group-hover:text-text transform group-hover:translate-x-1 transition-all" />
            </a>

            {/* Send Message Button */}
            <div className="mt-2 text-left">
              <a 
                href={`mailto:${import.meta.env.VITE_ADMIN_EMAIL || 'contact@example.com'}`}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-text text-bg rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-95 active:scale-[0.98] transition-all duration-200 shadow-xl group"
              >
                <Icon name="Mail" size={16} />
                <span>Send a Message</span>
                <Icon name="ArrowRight" size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
