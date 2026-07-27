import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '../../data/icons';

const ALL_SECTION_KEYS = ['summary', 'experience', 'projects', 'education', 'certifications', 'skills', 'languages'];

export default function AdminResumeModal({ isOpen, onClose }) {
  const { user, isAdmin } = useAuth();
  const [excludedSections, setExcludedSections] = useState({});

  if (!user || !isAdmin) return null;

  const toggleSection = (sectionKey) => {
    setExcludedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isAllIncluded = ALL_SECTION_KEYS.every(key => !excludedSections[key]);

  const toggleAllSections = () => {
    if (isAllIncluded) {
      // Exclude all
      const allExcluded = {};
      ALL_SECTION_KEYS.forEach(k => { allExcluded[k] = true; });
      setExcludedSections(allExcluded);
    } else {
      // Include all
      setExcludedSections({});
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" zIndex="z-[150]">
      <div className="flex flex-col max-h-[88vh] bg-surface text-text overflow-hidden rounded-3xl border border-border shadow-2xl">
        
        {/* Studio Control Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text">Official Executive Resume</h3>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-muted">
                Private printable document &bull; Toggle sections below to customize PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
            {/* Toggle All Button */}
            <button
              onClick={toggleAllSections}
              className="px-3.5 py-2 rounded-xl bg-surface-hover hover:bg-border/60 border border-border text-xs font-semibold text-text transition-colors flex items-center gap-1.5"
              title={isAllIncluded ? "Deselect All Sections" : "Select All Sections"}
            >
              <Icon name="Check" size={14} className={isAllIncluded ? "text-emerald-400" : "text-muted"} />
              <span>{isAllIncluded ? "Deselect All" : "Select All"}</span>
            </button>

            {/* Premium Download PDF CTA */}
            <button 
              onClick={handlePrint} 
              className="px-5 py-2 rounded-xl bg-text text-bg text-xs font-extrabold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg group"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Paper Canvas Background */}
        <div className="p-4 sm:p-8 bg-[#121212] dark:bg-[#0a0a0a] overflow-y-auto custom-scrollbar flex-grow">
          
          {/* Scoped CSS Styles for Paper CV */}
          <style>{`
            .cv-document {
              background-color: #ffffff;
              max-width: 21cm;
              margin: 0 auto;
              padding: 1.8cm 2cm;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
              color: #111111;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              text-align: left;
              border-radius: 4px;
            }

            /* --- Section Toggle Switch --- */
            .section-toggle-switch {
              margin-left: auto;
              position: relative;
              width: 34px;
              height: 18px;
              flex-shrink: 0;
            }

            .section-toggle-switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }

            .section-toggle-switch .slider-track {
              position: absolute;
              cursor: pointer;
              top: 0; left: 0; right: 0; bottom: 0;
              background-color: #cbd5e1;
              border-radius: 18px;
              transition: all 0.2s ease;
            }

            .section-toggle-switch .slider-track:before {
              content: "";
              position: absolute;
              height: 14px;
              width: 14px;
              left: 2px;
              bottom: 2px;
              background-color: #ffffff;
              border-radius: 50%;
              transition: all 0.2s ease;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }

            .section-toggle-switch input:checked + .slider-track {
              background-color: #0f172a;
            }

            .section-toggle-switch input:checked + .slider-track:before {
              transform: translateX(16px);
            }

            .cv-sec {
              transition: opacity 0.25s ease, filter 0.25s ease;
            }

            .cv-sec.exclude-print {
              opacity: 0.3;
              filter: grayscale(0.5);
            }

            .excluded-badge {
              font-size: 8.5pt;
              font-family: monospace;
              color: #ef4444;
              font-weight: 600;
              margin-left: 8px;
              text-transform: none;
              letter-spacing: 0;
            }

            /* --- Typography & Layout --- */
            .cv-document h1 {
              font-size: 26pt;
              margin: 0 0 6px 0;
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #000;
              font-weight: 800;
            }

            .cv-contact-info {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 12px;
              margin-bottom: 24px;
              font-size: 9.5pt;
            }

            .cv-contact-info a {
              color: #333;
              text-decoration: none;
              display: flex;
              align-items: center;
              gap: 5px;
            }

            .cv-contact-info a:hover {
              text-decoration: underline;
            }

            .cv-contact-info svg {
              width: 14px;
              height: 14px;
              stroke: #444;
            }

            .cv-contact-info .separator {
              color: #bbb;
              font-weight: 300;
            }

            .cv-document h2 {
              font-size: 12pt;
              color: #1a1a1a;
              border-bottom: 1.5px solid #2a2a2a;
              padding-bottom: 6px;
              margin-top: 26px;
              margin-bottom: 14px;
              display: flex;
              align-items: center;
              gap: 8px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              font-weight: 700;
            }

            .cv-document h2 svg {
              width: 18px;
              height: 18px;
              stroke: #1a1a1a;
              stroke-width: 2.2;
            }

            .cv-document p {
              font-size: 10pt;
              margin-bottom: 10px;
              text-align: left;
              color: #333;
              line-height: 1.55;
            }

            .cv-entry {
              margin-bottom: 14px;
            }

            .cv-entry-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 0px;
              flex-wrap: wrap;
              gap: 8px;
            }

            .cv-entry-title {
              font-weight: 600;
              font-size: 10.5pt;
              color: #111;
              line-height: 1.2;
            }

            .cv-entry-meta {
              font-size: 9.5pt;
              color: #555;
              font-weight: 500;
              text-align: right;
            }

            .cv-entry-sub {
              font-size: 9pt;
              color: #666;
              font-weight: normal;
              display: block;
              margin-top: -3px;
              margin-bottom: 5px;
              line-height: 1.2;
            }

            .cv-project-entry {
              margin-bottom: 16px;
            }

            .cv-project-header {
              margin-bottom: 2px;
            }

            .cv-project-title {
              font-weight: 600;
              font-size: 10.5pt;
              color: #111;
            }

            .cv-project-tech {
              font-size: 9.5pt;
              color: #555;
              margin-bottom: 5px;
              display: block;
            }

            .cv-project-tech strong {
              color: #111;
              font-weight: 600;
            }

            .cv-project-details {
              font-size: 10pt;
              color: #333;
              margin: 0;
              padding-left: 20px;
            }

            .cv-project-details li {
              margin-bottom: 4px;
              text-align: left;
              list-style-type: square;
              line-height: 1.5;
            }

            .cv-skills-grid {
              display: grid;
              grid-template-columns: 150px 1fr;
              gap: 8px 12px;
              font-size: 10pt;
              margin-bottom: 10px;
              color: #333;
              align-items: center;
            }

            .cv-skill-category {
              font-weight: 600;
              color: #111;
              text-align: left;
              font-size: 9.5pt;
            }

            .cv-skill-list {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
            }

            .cv-skill-tag {
              display: inline-block;
              background-color: #f5f5f5;
              border: 1px solid #e2e2e2;
              padding: 1px 8px;
              border-radius: 3px;
              font-size: 9pt;
              color: #333;
            }

            .cv-cert-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px 20px;
              margin-top: 2px;
            }

            .cv-cert-item {
              display: flex;
              flex-direction: column;
            }

            .cv-cert-name {
              font-size: 9.5pt;
              font-weight: 600;
              color: #111;
            }

            .cv-cert-issuer {
              font-size: 8.5pt;
              color: #666;
            }

            .cv-languages-row {
              display: flex;
              gap: 25px;
              font-size: 10pt;
              color: #333;
              margin-top: 2px;
            }

            .cv-languages-row .lang-item {
              display: flex;
              gap: 5px;
            }

            .cv-languages-row .lang-name {
              font-weight: 600;
              color: #111;
            }

            .cv-languages-row .lang-level {
              color: #555;
            }

            /* Print Rules */
            @media print {
              body * {
                visibility: hidden !important;
              }
              .cv-document, .cv-document * {
                visibility: visible !important;
              }
              .cv-document {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                box-shadow: none !important;
              }
              .section-toggle-switch, .excluded-badge {
                display: none !important;
              }
              .cv-sec.exclude-print {
                display: none !important;
              }
            }

            @media screen and (max-width: 768px) {
              .cv-document {
                padding: 20px 16px;
              }
              .cv-skills-grid {
                grid-template-columns: 1fr;
              }
              .cv-cert-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>

          {/* CV Document Body */}
          <div className="cv-document">
            <h1>Olimpiu Ticudean</h1>
            
            <div className="cv-contact-info">
              <a href="mailto:ticudean.o@gmail.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                ticudean.o@gmail.com
              </a>
              <span className="separator">|</span>
              <a href="tel:07459675532">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                07459675532
              </a>
              <span className="separator">|</span>
              <a href="https://linkedin.com/in/olimpiu-ticudean" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                LinkedIn
              </a>
              <span className="separator">|</span>
              <a href="https://github.com/olimpiu98" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
              <span className="separator">|</span>
              <a href="https://ticudean.com" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                ticudean.com
              </a>
            </div>

            {/* SUMMARY */}
            <section className={`cv-sec ${excludedSections.summary ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
                <span>SUMMARY</span>
                {excludedSections.summary && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.summary} onChange={() => toggleSection('summary')} />
                  <span className="slider-track"></span>
                </label>
              </h2>
              <p>
                BSc (Hons) Computing graduate with practical experience in web development through personal projects and work. Skilled in JavaScript, TypeScript, React, and Node.js, with additional certifications in cloud technologies. I enjoy building modern web applications, solving technical problems, and continuously improving my skills as a software developer.
              </p>
            </section>

            {/* PROFESSIONAL EXPERIENCE */}
            <section className={`cv-sec ${excludedSections.experience ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h20v14H2z"/><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M6 21v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>
                <span>PROFESSIONAL EXPERIENCE</span>
                {excludedSections.experience && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.experience} onChange={() => toggleSection('experience')} />
                  <span className="slider-track"></span>
                </label>
              </h2>

              <div className="cv-project-entry">
                <div className="cv-entry-header">
                  <span className="cv-entry-title">Lidl Great Britain Limited</span>
                  <span className="cv-entry-meta">October 2018 &mdash; Present | Runcorn, UK</span>
                </div>
                <span className="cv-entry-sub">Warehouse Operative</span>
                <ul className="cv-project-details">
                  <li>Operated in a dynamic environment where clear communication and coordination is essential to achieve daily targets.</li>
                  <li>Utilised an internal Quality Control System (QCS) daily to monitor stock quality and quickly communicate with Head Office.</li>
                  <li>Daily interaction with the logistics software inspired me to design the architecture and development of a custom full-stack Quality Control System project for my university dissertation.</li>
                </ul>
              </div>

              <div className="cv-project-entry">
                <div className="cv-entry-header">
                  <span className="cv-entry-title">Reea Digital</span>
                  <span className="cv-entry-meta">Jun 2021 &mdash; Dec 2022 | Remote, RO</span>
                </div>
                <span className="cv-entry-sub">Junior Web Developer (part-time)</span>
                <ul className="cv-project-details">
                  <li>Collaborated remotely with a team of 4 developers to build modern, interactive web applications using HTML, CSS, and JavaScript.</li>
                  <li>Contributed to the development of multiple websites such as indoor cycling studio and an excavation company, focusing on interactive features, clean user interfaces, and responsive design.</li>
                </ul>
              </div>
            </section>

            {/* PROJECTS */}
            <section className={`cv-sec ${excludedSections.projects ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18v13H3z"/><path d="M3 7l9-4 9 4"/></svg>
                <span>PROJECTS</span>
                {excludedSections.projects && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.projects} onChange={() => toggleSection('projects')} />
                  <span className="slider-track"></span>
                </label>
              </h2>

              <div className="cv-project-entry">
                <div className="cv-project-header">
                  <span className="cv-project-title">QCS - Quality Control System</span>
                </div>
                <span className="cv-project-tech"><strong>Tech Stack:</strong> React, Node.js, Express.js, MySQL, REST API</span>
                <ul className="cv-project-details">
                  <li>Built a full-stack web application featuring a React frontend and a Node.js/Express backend with a RESTful API.</li>
                  <li>Enabled users to manage and monitor information in real time with a clean, responsive UI.</li>
                  <li>Architected separate deployment of client and server layers for scalability and maintainability.</li>
                </ul>
              </div>

              <div className="cv-project-entry">
                <div className="cv-project-header">
                  <span className="cv-project-title">Coinlist - Cryptocurrency Price Tracker</span>
                </div>
                <span className="cv-project-tech"><strong>Tech Stack:</strong> React, JavaScript, REST API</span>
                <ul className="cv-project-details">
                  <li>Developed a React application that fetches and displays live cryptocurrency data via a public API.</li>
                  <li>Implemented a responsive, filterable coin list with real-time price updates.</li>
                  <li>Demonstrated proficiency in RESTful API integration, component-based architecture, and state management.</li>
                </ul>
              </div>

              <div className="cv-project-entry">
                <div className="cv-project-header">
                  <span className="cv-project-title">Comets of Web3 - Blockchain Development</span>
                </div>
                <span className="cv-project-tech"><strong>Tech Stack:</strong> Solana, Typescript, Rust</span>
                <ul className="cv-project-details">
                  <li>Developed a blockchain project for Solana as part of the Comets of Web3 developer programme.</li>
                  <li>Gained practical experience in low-level systems programming and smart contract integration.</li>
                  <li>Demonstrated initiative in learning decentralized application (dApp) concepts beyond the standard web development curriculum.</li>
                </ul>
              </div>
            </section>

            {/* EDUCATION */}
            <section className={`cv-sec ${excludedSections.education ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span>EDUCATION</span>
                {excludedSections.education && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.education} onChange={() => toggleSection('education')} />
                  <span className="slider-track"></span>
                </label>
              </h2>

              <div className="cv-entry">
                <div className="cv-entry-header">
                  <span className="cv-entry-title">Arden University</span>
                  <span className="cv-entry-meta">2021 &mdash; 2025 | Manchester, UK</span>
                </div>
                <span className="cv-entry-sub">BSc (Hons) Computing with Foundation Year</span>
              </div>

              <div className="cv-entry">
                <div className="cv-entry-header">
                  <span className="cv-entry-title">Comets of Web3</span>
                  <span className="cv-entry-meta">2024 | Remote, UK</span>
                </div>
                <span className="cv-entry-sub">Blockchain Developer Program</span>
              </div>

              <div className="cv-entry">
                <div className="cv-entry-header">
                  <span className="cv-entry-title">OpenClassrooms</span>
                  <span className="cv-entry-meta">2022 &mdash; 2023 | Remote, UK</span>
                </div>
                <span className="cv-entry-sub">Front End Web Development</span>
              </div>

              <div className="cv-entry">
                <div className="cv-entry-header">
                  <span className="cv-entry-title">Technologic School "Gheorghe Sincai"</span>
                  <span className="cv-entry-meta">2013 &mdash; 2017 | Mures, RO</span>
                </div>
                <span className="cv-entry-sub">CAD/CADD Drafting and Design Technician</span>
              </div>
            </section>

            {/* CERTIFICATIONS */}
            <section className={`cv-sec ${excludedSections.certifications ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                <span>CERTIFICATIONS</span>
                {excludedSections.certifications && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.certifications} onChange={() => toggleSection('certifications')} />
                  <span className="slider-track"></span>
                </label>
              </h2>

              <div className="cv-cert-grid">
                <div className="cv-cert-item">
                  <span className="cv-cert-name">AWS Cloud Technical Essentials</span>
                  <span className="cv-cert-issuer">Amazon Web Services, Coursera</span>
                </div>
                <div className="cv-cert-item">
                  <span className="cv-cert-name">Developing Cloud Apps with Node.js and React</span>
                  <span className="cv-cert-issuer">IBM Skills Network, Coursera</span>
                </div>
                <div className="cv-cert-item">
                  <span className="cv-cert-name">Front-End JavaScript Frameworks: Angular</span>
                  <span className="cv-cert-issuer">HKU of Science and Technology, Coursera</span>
                </div>
                <div className="cv-cert-item">
                  <span className="cv-cert-name">Building AI Powered Chatbots</span>
                  <span className="cv-cert-issuer">IBM Skills Network, Coursera</span>
                </div>
                <div className="cv-cert-item">
                  <span className="cv-cert-name">Introduction to Cloud Computing</span>
                  <span className="cv-cert-issuer">IBM Skills Network, Coursera</span>
                </div>
                <div className="cv-cert-item">
                  <span className="cv-cert-name">Getting Started with Git and GitHub</span>
                  <span className="cv-cert-issuer">IBM Skills Network, Coursera</span>
                </div>
              </div>
            </section>

            {/* TECHNICAL EXPERIENCE & SKILLS */}
            <section className={`cv-sec ${excludedSections.skills ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a9 9 0 0 0 .6-3 9 9 0 0 0-.6-3"/><path d="M4.6 15a9 9 0 0 1-.6-3 9 9 0 0 1 .6-3"/><path d="M12 21v-3"/><path d="M12 6V3"/></svg>
                <span>TECHNICAL EXPERIENCE & SKILLS</span>
                {excludedSections.skills && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.skills} onChange={() => toggleSection('skills')} />
                  <span className="slider-track"></span>
                </label>
              </h2>

              <div className="cv-skills-grid">
                <div className="cv-skill-category">Programming Languages</div>
                <div className="cv-skill-list">
                  <span className="skill-tag">JavaScript / TypeScript</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">Java</span>
                  <span className="skill-tag">SQL</span>
                </div>

                <div className="cv-skill-category">Markup & Styling</div>
                <div className="cv-skill-list">
                  <span className="skill-tag">HTML</span>
                  <span className="skill-tag">XML</span>
                  <span className="skill-tag">CSS</span>
                  <span className="skill-tag">SCSS</span>
                </div>

                <div className="cv-skill-category">Frameworks</div>
                <div className="cv-skill-list">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">Express</span>
                  <span className="skill-tag">Tailwind</span>
                  <span className="skill-tag">Bootstrap</span>
                  <span className="skill-tag">Materialize</span>
                </div>

                <div className="cv-skill-category">Tools & Platforms</div>
                <div className="cv-skill-list">
                  <span className="skill-tag">Git</span>
                  <span className="skill-tag">VS Code</span>
                  <span className="skill-tag">Postman</span>
                  <span className="skill-tag">Oracle APEX</span>
                  <span className="skill-tag">Docker</span>
                </div>

                <div className="cv-skill-category">Cloud & Deployment</div>
                <div className="cv-skill-list">
                  <span className="skill-tag">AWS</span>
                  <span className="skill-tag">Azure</span>
                  <span className="skill-tag">Netlify</span>
                  <span className="skill-tag">OVH</span>
                  <span className="skill-tag">Firebase</span>
                  <span className="skill-tag">Cloudflare</span>
                </div>

                <div className="cv-skill-category">Systems & Environments</div>
                <div className="cv-skill-list">
                  <span className="skill-tag">WSL</span>
                  <span className="skill-tag">VirtualBox</span>
                  <span className="skill-tag">Nginx</span>
                  <span className="skill-tag">Apache</span>
                  <span className="skill-tag">Node.js</span>
                </div>
              </div>
            </section>

            {/* LANGUAGES */}
            <section className={`cv-sec ${excludedSections.languages ? 'exclude-print' : ''}`}>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>LANGUAGES</span>
                {excludedSections.languages && <span className="excluded-badge">(Excluded from PDF)</span>}
                <label className="section-toggle-switch" title="Toggle section in PDF">
                  <input type="checkbox" checked={!excludedSections.languages} onChange={() => toggleSection('languages')} />
                  <span className="slider-track"></span>
                </label>
              </h2>

              <div className="cv-languages-row">
                <div className="lang-item">
                  <span className="lang-name">Romanian</span>
                  <span className="lang-level">(Native)</span>
                </div>
                <div className="lang-item">
                  <span className="lang-name">English</span>
                  <span className="lang-level">(Professional Fluency)</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </Modal>
  );
}
