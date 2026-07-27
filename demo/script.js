/* ═══════════════════════════════════════════════════
   Olimpiu Ticudean — Portfolio Script
   ═══════════════════════════════════════════════════ */

/* ── Spotlight ──────────────────────────────────── */
document.addEventListener('mousemove', e => {
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

/* ── Theme Toggle ───────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

let favicon = document.querySelector('link[rel="icon"]');
if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
}

function generateFavicon(circleColor) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const cx = 32, cy = 32;

    // Circle
    ctx.beginPath();
    ctx.arc(cx, cy - 2, 26, 0, Math.PI * 2);
    ctx.fillStyle = circleColor;
    ctx.fill();

    // "T" letter
    const textColor = circleColor === '#ffffff' ? '#000000' : '#ffffff';
    ctx.fillStyle = textColor;
    const shrink = textColor === '#ffffff' ? 2 : 0;
    const barW = 36 - shrink * 2;
    const barH = 11 - shrink;
    const stemW = 11 - shrink;
    const startY = 17 + shrink / 2;

    ctx.beginPath();
    ctx.roundRect
        ? ctx.roundRect(cx - barW / 2, startY, barW, barH, 2)
        : ctx.rect(cx - barW / 2, startY, barW, barH);
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect
        ? ctx.roundRect(cx - stemW / 2, startY + barH - 2, stemW, 36, 2)
        : ctx.rect(cx - stemW / 2, startY + barH - 2, stemW, 36);
    ctx.fill();

    return canvas.toDataURL('image/png');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
    moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    favicon.href = generateFavicon(theme === 'dark' ? '#ffffff' : '#000000');
}

// Init — default to dark black theme on every device
const savedTheme = 'dark';
applyTheme(savedTheme);

// Wait for fonts, then regenerate favicon
document.fonts.ready.then(() => applyTheme(savedTheme));

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
});

/* ── Hamburger Menu ─────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('visible');
    requestAnimationFrame(() => mobileMenu.classList.toggle('open'));
});

mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('visible', 'open');
    });
});

/* ── Scroll Reveal ──────────────────────────────── */
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.reveal-section').forEach(section => {
    revealObserver.observe(section);
});

/* ── Navbar Scroll ──────────────────────────────── */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ── Active Nav Link (scroll spy) ──────────────── */
const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ── 3D Card Tilt ───────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ── Project Modal ──────────────────────────────── */
const projectsData = [
    {
        num: '01',
        title: 'Lorem Ipsum Project 01',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        tags: ['Tag One', 'Tag Two', 'Tag Three'],
        features: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer nec odio praesent', 'Libero cursus ante dapibus']
    },
    {
        num: '02',
        title: 'Lorem Ipsum Project 02',
        desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        tags: ['Tag One', 'Tag Two', 'Tag Three'],
        features: ['Duis aute irure dolor in reprehenderit', 'Voluptate velit esse cillum', 'Excepteur sint occaecat cupidatat', 'Sunt in culpa qui officia']
    },
    {
        num: '03',
        title: 'Lorem Ipsum Project 03',
        desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
        tags: ['Tag One', 'Tag Two', 'Tag Three'],
        features: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer nec odio praesent', 'Libero cursus ante dapibus']
    },
    {
        num: '04',
        title: 'Lorem Ipsum Project 04',
        desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
        tags: ['Tag One', 'Tag Two', 'Tag Three'],
        features: ['Duis aute irure dolor in reprehenderit', 'Voluptate velit esse cillum', 'Excepteur sint occaecat cupidatat', 'Sunt in culpa qui officia']
    },
    {
        num: '05',
        title: 'Lorem Ipsum Project 05',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        gradient: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
        tags: ['Tag One', 'Tag Two', 'Tag Three'],
        features: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Integer nec odio praesent', 'Libero cursus ante dapibus']
    },
    {
        num: '06',
        title: 'Lorem Ipsum Project 06',
        desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        gradient: 'linear-gradient(135deg, #d97706, #fbbf24)',
        tags: ['Tag One', 'Tag Two', 'Tag Three'],
        features: ['Duis aute irure dolor in reprehenderit', 'Voluptate velit esse cillum', 'Excepteur sint occaecat cupidatat', 'Sunt in culpa qui officia']
    }
];

const modalOverlay = document.getElementById('project-modal');
if (modalOverlay) {
    const modalCloseBtn = document.getElementById('modal-close');
    const mPreview = document.getElementById('modal-preview');
    const mNum = document.getElementById('modal-num');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    const mFeatures = document.getElementById('modal-features-list');
    const mTags = document.getElementById('modal-tags');

    function openModal(index) {
        const data = projectsData[index];
        if(!data) return;
        
        mPreview.style.background = data.gradient;
        mNum.textContent = data.num;
        mTitle.textContent = data.title;
        mDesc.textContent = data.desc;
        
        mFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
        mTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
        
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        const otherActive = document.querySelector('.modal-overlay.active:not(#project-modal)');
        if (!otherActive) document.body.classList.remove('modal-open');
    }

    // Event delegation for project cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card) {
            e.preventDefault();
            const idx = card.getAttribute('data-project-index');
            if (idx !== null) openModal(parseInt(idx, 10));
        }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

/* ── All Projects Grid Modal Controller ─────────── */
const allProjectsModal = document.getElementById('all-projects-modal');
if (allProjectsModal) {
    const allProjTriggers = document.querySelectorAll('.all-projects-trigger');
    const allProjCloseBtn = document.getElementById('all-projects-modal-close');
    const modalProjectsGrid = document.getElementById('modal-projects-grid');

    function renderModalProjects() {
        if (!modalProjectsGrid) return;
        modalProjectsGrid.innerHTML = projectsData.map((proj, idx) => `
            <a class="project-card" href="#" data-project-index="${idx}">
                <div class="project-preview">
                    <div class="project-preview-inner" style="background:${proj.gradient}"></div>
                    <span class="project-num">${proj.num}</span>
                </div>
                <div class="project-info">
                    <div class="project-title">
                        <h3>${proj.title}</h3>
                        <div class="project-arrow-placeholder">${UI_ICONS.arrow}</div>
                    </div>
                    <p class="project-desc">${proj.desc}</p>
                    <div class="project-tags">${proj.tags.map(t => `<span>${t}</span>`).join('')}</div>
                </div>
            </a>
        `).join('');
    }

    function openAllProjectsModal() {
        renderModalProjects();
        allProjectsModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeAllProjectsModal() {
        allProjectsModal.classList.remove('active');
        const otherActive = document.querySelector('.modal-overlay.active:not(#all-projects-modal)');
        if (!otherActive) document.body.classList.remove('modal-open');
    }

    allProjTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openAllProjectsModal();
        });
    });

    if (allProjCloseBtn) allProjCloseBtn.addEventListener('click', closeAllProjectsModal);
    allProjectsModal.addEventListener('click', (e) => {
        if (e.target === allProjectsModal) closeAllProjectsModal();
    });
}

/* ── Resume Access Confirmation Modal ───────────── */
const resumeModal = document.getElementById('resume-modal');
if (resumeModal) {
    const resumeTriggers = document.querySelectorAll('.resume-trigger');
    const resumeCloseBtn = document.getElementById('resume-modal-close');
    const resumeStayBtn = document.getElementById('resume-stay-btn');
    const resumeProceedBtn = document.getElementById('resume-proceed-btn');

    function openResumeModal() {
        resumeModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeResumeModal() {
        resumeModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    resumeTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openResumeModal();
        });
    });

    if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResumeModal);
    if (resumeStayBtn) resumeStayBtn.addEventListener('click', closeResumeModal);
    if (resumeProceedBtn) {
        resumeProceedBtn.addEventListener('click', () => {
            closeResumeModal();
        });
    }

    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) closeResumeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeResumeModal();
        }
    });
}

/* ── Skills & Credentials Vault Controller ──────── */
const vaultData = [
    {
        category: 'certificates',
        title: 'Lorem Ipsum Title 01',
        issuer: 'Placeholder Institution',
        date: '2024',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        badge: 'Badge 01'
    },
    {
        category: 'certificates',
        title: 'Lorem Ipsum Title 02',
        issuer: 'Placeholder Institution',
        date: '2023',
        desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        badge: 'Badge 02'
    },
    {
        category: 'education',
        title: 'Lorem Ipsum Degree Title',
        issuer: 'Placeholder University',
        date: '2018 - 2022',
        desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        badge: 'Degree'
    },
    {
        category: 'education',
        title: 'Lorem Ipsum Specialization',
        issuer: 'Placeholder Academy',
        date: '2023',
        desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        badge: 'Specialization'
    },
    {
        category: 'skills',
        title: 'Lorem Ipsum Core Competency 01',
        issuer: 'Core Competency',
        date: 'Level 01',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.',
        badge: 'Category A'
    },
    {
        category: 'skills',
        title: 'Lorem Ipsum Core Competency 02',
        issuer: 'Core Competency',
        date: 'Level 02',
        desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        badge: 'Category B'
    }
];

/* ── Credentials Directory Table Modal ── */
const previewGrid = document.getElementById('credentials-preview-grid');
if (previewGrid) {
    const top3 = vaultData.slice(0, 3);
    previewGrid.innerHTML = top3.map(item => `
        <div class="vault-card">
            <div>
                <div class="vault-top">
                    <span class="vault-badge">${item.badge}</span>
                    <span class="vault-date">${item.date}</span>
                </div>
                <h3 class="vault-title">${item.title}</h3>
                <p class="vault-desc">${item.desc}</p>
            </div>
            <div class="vault-footer">
                <span class="vault-issuer">${item.issuer}</span>
            </div>
        </div>
    `).join('');
}

const credentialsModal = document.getElementById('credentials-modal');
if (credentialsModal) {
    const credTriggers = document.querySelectorAll('.credentials-trigger');
    const credCloseBtn = document.getElementById('credentials-modal-close');
    const tableBody = document.getElementById('credentials-table-body');
    const tableTabs = document.querySelectorAll('.table-tab');

    function renderTable(filter = 'all') {
        const filtered = filter === 'all' 
            ? vaultData 
            : vaultData.filter(item => item.category === filter);

        if (tableBody) {
            tableBody.innerHTML = filtered.map(item => `
                <tr>
                    <td><span class="table-badge">${item.badge}</span></td>
                    <td>
                        <span class="table-title">${item.title}</span>
                        <span class="table-desc">${item.desc}</span>
                    </td>
                    <td>${item.issuer}</td>
                    <td>${item.date}</td>
                </tr>
            `).join('');
        }
    }

    function openCredModal() {
        renderTable('all');
        credentialsModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeCredModal() {
        credentialsModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    credTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCredModal();
        });
    });

    if (credCloseBtn) credCloseBtn.addEventListener('click', closeCredModal);
    credentialsModal.addEventListener('click', (e) => {
        if (e.target === credentialsModal) closeCredModal();
    });

    tableTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tableTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTable(tab.getAttribute('data-table-filter'));
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && credentialsModal.classList.contains('active')) {
            closeCredModal();
        }
    });
}
