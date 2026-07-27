/* ═══════════════════════════════════════════════════
   icons.js - Extracted SVGs for easy management
   ═══════════════════════════════════════════════════ */

const UI_ICONS = {
    sun: `<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    arrow: `<svg class="project-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`
};

const TECH_ROW_1 = [
    { name: 'HTML5', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16l-1.5 17L12 22l-6.5-3z"/><path d="M8.5 7l-2 4 2 4"/><path d="M15.5 7l2 4-2 4"/></svg>` },
    { name: 'CSS3', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16l-1.5 17L12 22l-6.5-3z"/><path d="M14.5 8h-5a2 2 0 000 4h3a2 2 0 010 4h-5"/></svg>` },
    { name: 'JavaScript', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="8" font-weight="700" stroke="none" font-family="sans-serif">JS</text></svg>` },
    { name: 'TypeScript', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="8" font-weight="700" stroke="none" font-family="sans-serif">TS</text></svg>` },
    { name: 'React', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/></svg>` },
    { name: 'Next.js', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 16V8l9 12"/><line x1="16" y1="8" x2="16" y2="13"/></svg>` },
    { name: 'Vue.js', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h4l6 14L18 3h4L12 22z"/><path d="M7.5 3L12 11.5 16.5 3"/></svg>` },
    { name: 'Angular', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 2L3 6l1.5 13L12 22l7.5-3L21 6z"/><path d="M9 15l3-10 3 10"/><line x1="10" y1="13" x2="14" y2="13"/></svg>` },
    { name: 'Node.js', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 7v10"/><path d="M7.5 9.5L12 12l4.5-2.5"/></svg>` },
    { name: 'Express.js', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>` }
];

const TECH_ROW_2 = [
    { name: 'Python', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-4 0-5 2-5 4v2h5v1H5.5C3.5 9 2 11 2 14s1.5 4 3.5 4H8v-3c0-2 1.5-3.5 3.5-3.5h5c1.5 0 2.5-1 2.5-2.5V5c0-1.5-2-3-5-3z"/><circle cx="9.5" cy="5.5" r="1" fill="currentColor" stroke="none"/><path d="M12 22c4 0 5-2 5-4v-2h-5v-1h6.5c2 0 3.5-2 3.5-5s-1.5-4-3.5-4H16v3c0 2-1.5 3.5-3.5 3.5h-5c-1.5 0-2.5 1-2.5 2.5v4c0 1.5 2 3 5 3z"/><circle cx="14.5" cy="18.5" r="1" fill="currentColor" stroke="none"/></svg>` },
    { name: 'Git', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><line x1="12" y1="8.5" x2="12" y2="15.5"/><path d="M14.2 7.5Q16.5 9 16 12"/></svg>` },
    { name: 'GitHub', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>` },
    { name: 'MongoDB', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 6 5 10 5 14a7 7 0 0014 0c0-4-3-8-7-12z"/><line x1="12" y1="2" x2="12" y2="22"/></svg>` },
    { name: 'PostgreSQL', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5.5" rx="8" ry="3.5"/><path d="M4 5.5v13c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-13"/><path d="M4 12c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5" opacity=".5"/></svg>` },
    { name: 'Docker', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="3.5" height="3"/><rect x="9.5" y="10" width="3.5" height="3"/><rect x="14" y="10" width="3.5" height="3"/><rect x="9.5" y="6.5" width="3.5" height="3"/><rect x="14" y="6.5" width="3.5" height="3"/><path d="M2 14.5c1 4 5 6 10 6 6.5 0 10-3.5 11-8H2z" stroke-width="1.5"/></svg>` },
    { name: 'Tailwind CSS', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C13.43 10.9 14.6 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.57 7.1 14.4 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.43 16.9 9.6 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.57 13.1 9.4 12 7 12z"/></svg>` },
    { name: 'Figma', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="2" width="5" height="6.5" rx="2.5"/><rect x="12" y="2" width="5" height="6.5" rx="2.5"/><rect x="7" y="8.5" width="5" height="6.5" rx="2.5"/><circle cx="14.5" cy="11.75" r="2.5"/><rect x="7" y="15" width="5" height="6.5" rx="2.5"/></svg>` },
    { name: 'Firebase', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l2.5-16 3.5 7 3-5 7 14z"/><line x1="4" y1="20" x2="20" y2="20"/></svg>` },
    { name: 'AWS', svg: `<svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>` }
];

// --- Injections ---

// 1. Theme Toggle Icons
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.innerHTML = UI_ICONS.sun + UI_ICONS.moon;
}

// 2. Project Arrows
document.querySelectorAll('.project-arrow-placeholder').forEach(el => {
    el.outerHTML = UI_ICONS.arrow;
});

// 3. Marquee Tracks
const buildMarqueeHtml = (techArray) => {
    // Repeat array 10x so Half A is >10,000px wide, guaranteeing zero gaps on any screen width or zoom
    const items = Array(10).fill(techArray).flat();
    return items.map(tech => `
        <div class="tech-item">
            ${tech.svg}
            <span class="tech-name">${tech.name}</span>
        </div>
    `).join('');
};

const track1 = document.getElementById('marquee-track-1');
if (track1) track1.innerHTML = buildMarqueeHtml(TECH_ROW_1);

const track2 = document.getElementById('marquee-track-2');
if (track2) track2.innerHTML = buildMarqueeHtml(TECH_ROW_2);
