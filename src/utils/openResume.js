/**
 * Opens the standalone, printable CV / Resume in a dedicated browser tab.
 * Ensures native window.print() and Save as PDF works 100% perfectly without modal interference.
 */
export function openPrintableResume() {
  const win = window.open('', '_blank');
  if (!win) return;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="robots" content="noindex, nofollow" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Olimpiu_Ticudean_CV</title>
  <style>
    /* CV Stylesheet — Olimpiu Ticudean */
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #e5e5e5;
        color: #111;
        margin: 0;
        padding: 40px 20px;
        line-height: 1.6;
    }

    .document {
        background-color: #fff;
        max-width: 21cm;
        margin: 0 auto;
        padding: 1.8cm 2cm;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    /* --- Print Button --- */
    .print-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: #0f172a;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 10.5pt;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
        font-family: inherit;
        z-index: 1000;
    }

    .print-btn:hover {
        background-color: #1e293b;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    /* --- Print / PDF --- */
    @page {
        size: A4;
        margin: 1.5cm 1.8cm;
    }

    @media print {
        body {
            background-color: #fff;
            padding: 0;
            margin: 0;
        }

        .document {
            box-shadow: none;
            padding: 0;
            max-width: 100%;
        }

        .print-btn, .section-toggle {
            display: none !important;
            visibility: hidden !important;
            position: absolute !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        h1 {
            font-size: 22pt;
            margin-bottom: 4px;
        }

        h2 {
            margin-top: 16px;
            margin-bottom: 8px;
            font-size: 10.5pt;
            page-break-after: avoid;
        }

        p {
            margin-bottom: 4px;
            font-size: 9.5pt;
        }

        .contact-info {
            margin-bottom: 14px;
        }

        .entry {
            margin-bottom: 8px;
            page-break-inside: avoid;
        }

        .project-entry {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }

        .cert-grid,
        .skills-grid,
        .languages-row {
            page-break-inside: avoid;
        }

        .section-toggle {
            display: none !important;
        }

        .cv-section.exclude-print {
            display: none !important;
        }

        .project-details li {
            margin-bottom: 2px;
        }

        .skills-grid {
            gap: 5px 10px;
        }

        .cert-grid {
            gap: 5px 15px;
        }
    }

    /* --- Section Toggle --- */
    .section-toggle {
        margin-left: auto;
        position: relative;
        width: 32px;
        height: 16px;
        flex-shrink: 0;
    }

    .section-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .section-toggle .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 16px;
        transition: 0.2s;
    }

    .section-toggle .slider:before {
        content: "";
        position: absolute;
        height: 12px;
        width: 12px;
        left: 2px;
        bottom: 2px;
        background-color: #fff;
        border-radius: 50%;
        transition: 0.2s;
    }

    .section-toggle input:checked + .slider {
        background-color: #2a2a2a;
    }

    .section-toggle input:checked + .slider:before {
        transform: translateX(16px);
    }

    .cv-section.exclude-print {
        opacity: 0.35;
    }

    /* --- Header --- */
    h1 {
        font-size: 26pt;
        margin: 0 0 6px 0;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 3px;
        color: #000;
    }

    /* --- Contact Info --- */
    .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 24px;
        font-size: 9.5pt;
    }

    .contact-info a {
        color: #333;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .contact-info a:hover {
        text-decoration: underline;
    }

    .contact-info svg {
        width: 14px;
        height: 14px;
        margin-right: 0;
        stroke: #444;
    }

    .contact-info .separator {
        color: #bbb;
        font-weight: 300;
        user-select: none;
    }

    /* --- Section Headings --- */
    h2 {
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

    h2 svg {
        width: 18px;
        height: 18px;
        stroke: #1a1a1a;
        stroke-width: 2.2;
    }

    /* --- Body Text --- */
    p {
        font-size: 10pt;
        margin-bottom: 10px;
        text-align: left;
        color: #333;
        line-height: 1.55;
    }

    /* --- Entry (Education) --- */
    .entry {
        margin-bottom: 14px;
    }

    .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0px;
        flex-wrap: wrap;
        gap: 8px;
    }

    .entry-title {
        font-weight: 600;
        font-size: 10.5pt;
        color: #111;
        line-height: 1.2;
    }

    .entry-meta {
        font-size: 9.5pt;
        color: #555;
        font-weight: 500;
        text-align: right;
    }

    .entry-sub {
        font-size: 9pt;
        color: #666;
        font-weight: normal;
        display: block;
        margin-top: -3px;
        margin-bottom: 5px;
        line-height: 1.2;
    }

    /* --- Project / Experience Entry --- */
    .project-entry {
        margin-bottom: 16px;
    }

    .project-header {
        margin-bottom: 2px;
    }

    .project-title {
        font-weight: 600;
        font-size: 10.5pt;
        color: #111;
    }

    .project-tech {
        font-size: 9.5pt;
        color: #555;
        margin-bottom: 5px;
        display: block;
    }

    .project-tech strong {
        color: #111;
        font-weight: 600;
    }

    .project-details {
        font-size: 10pt;
        color: #333;
        margin: 0;
        padding-left: 20px;
    }

    .project-details li {
        margin-bottom: 4px;
        text-align: left;
        list-style-type: square;
        line-height: 1.5;
    }

    /* --- Skills --- */
    .skills-grid {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 8px 12px;
        font-size: 10pt;
        margin-bottom: 10px;
        color: #333;
        align-items: center;
    }

    .skill-category {
        font-weight: 600;
        color: #111;
        text-align: left;
        font-size: 9.5pt;
    }

    .skill-list {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .skill-tag {
        display: inline-block;
        background-color: #f5f5f5;
        border: 1px solid #e2e2e2;
        padding: 1px 8px;
        border-radius: 3px;
        font-size: 9pt;
        color: #333;
    }

    /* --- Certifications --- */
    .cert-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 20px;
        margin-top: 2px;
    }

    .cert-item {
        display: flex;
        flex-direction: column;
    }

    .cert-name {
        font-size: 9.5pt;
        font-weight: 600;
        color: #111;
    }

    .cert-issuer {
        font-size: 8.5pt;
        color: #666;
    }

    /* --- Languages --- */
    .languages-row {
        display: flex;
        gap: 25px;
        font-size: 10pt;
        color: #333;
        margin-top: 2px;
    }

    .languages-row .lang-item {
        display: flex;
        gap: 5px;
    }

    .languages-row .lang-name {
        font-weight: 600;
        color: #111;
    }

    .languages-row .lang-level {
        color: #555;
    }

    @media screen and (max-width: 768px) {
        body {
            padding: 0;
            background-color: #fff;
        }

        .document {
            padding: 24px 20px;
            box-shadow: none;
            max-width: 100%;
        }

        h1 {
            font-size: 18pt;
            letter-spacing: 2px;
            margin-bottom: 8px;
        }

        h2 {
            font-size: 10pt;
            margin-top: 18px;
            margin-bottom: 8px;
            gap: 6px;
            letter-spacing: 1px;
        }

        h2 svg {
            width: 14px;
            height: 14px;
        }

        p {
            font-size: 9pt;
            line-height: 1.5;
        }

        .contact-info {
            gap: 4px 10px;
            font-size: 8.5pt;
            margin-bottom: 16px;
        }

        .contact-info .separator {
            display: none;
        }

        .contact-info a {
            gap: 4px;
        }

        .contact-info svg {
            width: 12px;
            height: 12px;
        }

        .entry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
        }

        .entry-meta {
            text-align: left;
            font-size: 8.5pt;
        }

        .entry-title,
        .entry-sub,
        .project-title {
            font-size: 9.5pt;
        }

        .project-tech {
            font-size: 8.5pt;
        }

        .project-details {
            font-size: 9pt;
            padding-left: 16px;
        }

        .project-details li {
            margin-bottom: 3px;
            line-height: 1.45;
        }

        .entry {
            margin-bottom: 10px;
        }

        .project-entry {
            margin-bottom: 12px;
        }

        .skills-grid {
            grid-template-columns: 1fr;
            gap: 2px 0;
            font-size: 9pt;
        }

        .skill-category {
            margin-top: 6px;
            font-size: 8.5pt;
        }

        .skill-tag {
            font-size: 8pt;
            padding: 1px 6px;
        }

        .cert-grid {
            grid-template-columns: 1fr;
            gap: 8px;
        }

        .cert-name {
            font-size: 8.5pt;
        }

        .cert-issuer {
            font-size: 7.5pt;
        }

        .languages-row {
            font-size: 9pt;
            gap: 16px;
        }

        .section-toggle {
            width: 26px;
            height: 13px;
        }

        .section-toggle .slider:before {
            height: 9px;
            width: 9px;
        }

        .section-toggle input:checked + .slider:before {
            transform: translateX(13px);
        }

        .print-btn {
            bottom: 12px;
            right: 12px;
            padding: 8px 14px;
            font-size: 8.5pt;
            gap: 5px;
            border-radius: 6px;
        }

        .print-btn svg {
            width: 14px;
            height: 14px;
        }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download PDF
  </button>

  <div class="document">
    <h1>Olimpiu Ticudean</h1>
    <div class="contact-info">
      <a href="mailto:contact@ticudean.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        contact@ticudean.com
      </a>
      <span class="separator">|</span>
      <a href="https://linkedin.com/in/olimpiu-ticudean" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        LinkedIn
      </a>
      <span class="separator">|</span>
      <a href="https://github.com/olimpiu98" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        GitHub
      </a>
      <span class="separator">|</span>
      <a href="https://ticudean.com" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        ticudean.com
      </a>
    </div>

    <!-- SUMMARY -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
        SUMMARY
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <p>BSc (Hons) Computing graduate with practical experience in web development through personal projects and work. Skilled in JavaScript, TypeScript, React, and Node.js, with additional certifications in cloud technologies. I enjoy building modern web applications, solving technical problems, and continuously improving my skills as a software developer.</p>
    </section>

    <!-- PROFESSIONAL EXPERIENCE -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h20v14H2z"/><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M6 21v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>
        PROFESSIONAL EXPERIENCE
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <div class="project-entry">
        <div class="entry-header"><span class="entry-title">Lidl Great Britain Limited</span><span class="entry-meta">October 2018 &mdash; Present | Runcorn, UK</span></div>
        <span class="entry-sub">Warehouse Operative</span>
        <ul class="project-details">
          <li>Operated in a dynamic environment where clear communication and coordination is essential to achieve daily targets.</li>
          <li>Utilised an internal Quality Control System (QCS) daily to monitor stock quality and quickly communicate with Head Office.</li>
          <li>Daily interaction with the logistics software inspired me to design the architecture and development of a custom full-stack Quality Control System project for my university dissertation.</li>
        </ul>
      </div>
      <div class="project-entry">
        <div class="entry-header"><span class="entry-title">Reea Digital</span><span class="entry-meta">Jun 2021 &mdash; Dec 2022 | Remote, RO</span></div>
        <span class="entry-sub">Junior Web Developer (part-time)</span>
        <ul class="project-details">
          <li>Collaborated remotely with a team of 4 developers to build modern, interactive web applications using HTML, CSS, and JavaScript.</li>
          <li>Contributed to the development of multiple websites such as indoor cycling studio and an excavation company, focusing on interactive features, clean user interfaces, and responsive design.</li>
        </ul>
      </div>
    </section>

    <!-- PROJECTS -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v13H3z"/><path d="M3 7l9-4 9 4"/></svg>
        PROJECTS
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <div class="project-entry">
        <div class="project-header"><span class="project-title">QCS - Quality Control System</span></div>
        <span class="project-tech"><strong>Tech Stack:</strong> React, Node.js, Express.js, MySQL, REST API</span>
        <ul class="project-details">
          <li>Built a full-stack web application featuring a React frontend and a Node.js/Express backend with a RESTful API.</li>
          <li>Enabled users to manage and monitor information in real time with a clean, responsive UI.</li>
          <li>Architected separate deployment of client and server layers for scalability and maintainability.</li>
        </ul>
      </div>
      <div class="project-entry">
        <div class="project-header"><span class="project-title">Coinlist - Cryptocurrency Price Tracker</span></div>
        <span class="project-tech"><strong>Tech Stack:</strong> React, JavaScript, REST API</span>
        <ul class="project-details">
          <li>Developed a React application that fetches and displays live cryptocurrency data via a public API.</li>
          <li>Implemented a responsive, filterable coin list with real-time price updates.</li>
          <li>Demonstrated proficiency in RESTful API integration, component-based architecture, and state management.</li>
        </ul>
      </div>
      <div class="project-entry">
        <div class="project-header"><span class="project-title">Comets of Web3 - Blockchain Development</span></div>
        <span class="project-tech"><strong>Tech Stack:</strong> Solana, Typescript, Rust</span>
        <ul class="project-details">
          <li>Developed a blockchain project for Solana as part of the Comets of Web3 developer programme.</li>
          <li>Gained practical experience in low-level systems programming and smart contract integration.</li>
          <li>Demonstrated initiative in learning decentralized application (dApp) concepts beyond the standard web development curriculum.</li>
        </ul>
      </div>
    </section>

    <!-- EDUCATION -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        EDUCATION
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <div class="entry"><div class="entry-header"><span class="entry-title">Arden University</span><span class="entry-meta">2021 &mdash; 2025 | Manchester, UK</span></div><span class="entry-sub">BSc (Hons) Computing with Foundation Year</span></div>
      <div class="entry"><div class="entry-header"><span class="entry-title">Comets of Web3</span><span class="entry-meta">2024 | Remote, UK</span></div><span class="entry-sub">Blockchain Developer Program</span></div>
      <div class="entry"><div class="entry-header"><span class="entry-title">OpenClassrooms</span><span class="entry-meta">2022 &mdash; 2023 | Remote, UK</span></div><span class="entry-sub">Front End Web Development</span></div>
      <div class="entry"><div class="entry-header"><span class="entry-title">Technologic School "Gheorghe Sincai"</span><span class="entry-meta">2013 &mdash; 2017 | Mures, RO</span></div><span class="entry-sub">CAD/CADD Drafting and Design Technician</span></div>
    </section>

    <!-- CERTIFICATIONS -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        CERTIFICATIONS
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <div class="cert-grid">
        <div class="cert-item"><span class="cert-name">AWS Cloud Technical Essentials</span><span class="cert-issuer">Amazon Web Services, Coursera</span></div>
        <div class="cert-item"><span class="cert-name">Developing Cloud Apps with Node.js and React</span><span class="cert-issuer">IBM Skills Network, Coursera</span></div>
        <div class="cert-item"><span class="cert-name">Front-End JavaScript Frameworks: Angular</span><span class="cert-issuer">HKU of Science and Technology, Coursera</span></div>
        <div class="cert-item"><span class="cert-name">Building AI Powered Chatbots</span><span class="cert-issuer">IBM Skills Network, Coursera</span></div>
        <div class="cert-item"><span class="cert-name">Introduction to Cloud Computing</span><span class="cert-issuer">IBM Skills Network, Coursera</span></div>
        <div class="cert-item"><span class="cert-name">Getting Started with Git and GitHub</span><span class="cert-issuer">IBM Skills Network, Coursera</span></div>
      </div>
    </section>

    <!-- TECHNICAL EXPERIENCE & SKILLS -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a9 9 0 0 0 .6-3 9 9 0 0 0-.6-3"/><path d="M4.6 15a9 9 0 0 1-.6-3 9 9 0 0 1 .6-3"/><path d="M12 21v-3"/><path d="M12 6V3"/></svg>
        TECHNICAL EXPERIENCE & SKILLS
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <div class="skills-grid">
        <div class="skill-category">Programming Languages</div><div class="skill-list"><span class="skill-tag">JavaScript / TypeScript</span><span class="skill-tag">Python</span><span class="skill-tag">Java</span><span class="skill-tag">SQL</span></div>
        <div class="skill-category">Markup & Styling</div><div class="skill-list"><span class="skill-tag">HTML</span><span class="skill-tag">XML</span><span class="skill-tag">CSS</span><span class="skill-tag">SCSS</span></div>
        <div class="skill-category">Frameworks</div><div class="skill-list"><span class="skill-tag">React</span><span class="skill-tag">Express</span><span class="skill-tag">Tailwind</span><span class="skill-tag">Bootstrap</span><span class="skill-tag">Materialize</span></div>
        <div class="skill-category">Tools & Platforms</div><div class="skill-list"><span class="skill-tag">Git</span><span class="skill-tag">VS Code</span><span class="skill-tag">Postman</span><span class="skill-tag">Oracle APEX</span><span class="skill-tag">Docker</span></div>
        <div class="skill-category">Cloud & Deployment</div><div class="skill-list"><span class="skill-tag">AWS</span><span class="skill-tag">Azure</span><span class="skill-tag">Netlify</span><span class="skill-tag">OVH</span><span class="skill-tag">Firebase</span><span class="skill-tag">Cloudflare</span></div>
        <div class="skill-category">Systems & Environments</div><div class="skill-list"><span class="skill-tag">WSL</span><span class="skill-tag">VirtualBox</span><span class="skill-tag">Nginx</span><span class="skill-tag">Apache</span><span class="skill-tag">Node.js</span></div>
      </div>
    </section>

    <!-- LANGUAGES -->
    <section class="cv-section">
      <h2>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        LANGUAGES
        <label class="section-toggle"><input type="checkbox" checked onchange="toggleSection(this)" /><span class="slider"></span></label>
      </h2>
      <div class="languages-row">
        <div class="lang-item"><span class="lang-name">Romanian</span><span class="lang-level">(Native)</span></div>
        <div class="lang-item"><span class="lang-name">English</span><span class="lang-level">(Professional Fluency)</span></div>
      </div>
    </section>
  </div>

  <script>
    function toggleSection(checkbox) {
      const section = checkbox.closest('.cv-section');
      if (checkbox.checked) {
        section.classList.remove('exclude-print');
      } else {
        section.classList.add('exclude-print');
      }
    }
  </script>
</body>
</html>`;

  win.document.open();
  win.document.write(htmlContent);
  win.document.close();
}
