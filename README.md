# Olimpiu Ticudean — Portfolio

A personal portfolio website built with **React** (Vite) and **Firebase**, featuring a dark/light theme, scroll-reveal animations, an infinite tech marquee, project showcases, and an admin panel for content management via Google sign-in.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Firebase Setup](#firebase-setup)
- [Environment Variables](#environment-variables)
- [CSS Architecture](#css-architecture)
- [Components Guide](#components-guide)
- [Admin Panel](#admin-panel)
- [Firestore Data Schemas](#firestore-data-schemas)
- [Deployment](#deployment)
- [Performance](#performance)

---

## Project Structure

```
src/
├── main.jsx                        # Entry point — renders <App />
├── App.jsx                         # Root: providers, background FX, layout
│
├── config/
│   └── firebase.js                 # Firebase init — exports db, auth, googleProvider
│
├── contexts/
│   ├── ThemeContext.jsx             # Dark / Light theme state + toggle
│   └── AuthContext.jsx             # Firebase Auth state, isAdmin flag
│
├── hooks/
│   ├── useFirestoreDoc.js          # Generic single-document read hook
│   ├── useProjects.js              # CRUD for projects
│   ├── useCredentials.js           # CRUD for certifications / credentials
│   └── useTechStack.js             # CRUD for technologies
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx              # Navbar + theme toggle + hamburger
│   │   ├── MobileMenu.jsx          # Slide-down mobile navigation
│   │   └── Footer.jsx              # Copyright + social links
│   │
│   ├── ui/
│   │   ├── Modal.jsx               # Reusable modal overlay
│   │   ├── ScrollReveal.jsx        # IntersectionObserver wrapper
│   │   ├── ProjectCard.jsx         # Project card with 3D tilt
│   │   └── VaultCard.jsx           # Credential / vault card
│   │
│   ├── sections/
│   │   ├── Hero.jsx                # Hero with animated heading
│   │   ├── Technologies.jsx        # Infinite marquee of tech icons
│   │   ├── Credentials.jsx         # Credential preview grid
│   │   ├── Projects.jsx            # Project preview grid
│   │   └── Contact.jsx             # Contact CTA
│   │
│   ├── modals/
│   │   ├── ProjectDetailModal.jsx  # Single project detail view
│   │   ├── ResumeModal.jsx         # Resume access confirmation
│   │   ├── CredentialsTableModal.jsx # Full filterable credentials table
│   │   └── AllProjectsModal.jsx    # Full projects grid
│   │
│   └── admin/
│       ├── AdminBar.jsx            # Floating toolbar (visible when admin)
│       ├── AdminLogin.jsx          # Google sign-in trigger
│       ├── ProjectEditor.jsx       # Add / Edit / Delete projects
│       ├── CredentialEditor.jsx    # Add / Edit / Delete credentials
│       └── TechStackEditor.jsx     # Add / Edit / Delete technologies
│
├── styles/
│   ├── variables.css               # CSS custom properties (:root, [data-theme])
│   ├── base.css                    # Reset, body, .inner
│   ├── background.css              # Grid, spotlight, ambient glow, noise
│   ├── header.css                  # Navbar
│   ├── hero.css                    # Hero section
│   ├── technologies.css            # Marquee + tech items
│   ├── credentials.css             # Vault cards + table
│   ├── projects.css                # Project cards + grid
│   ├── contact.css                 # Contact section
│   ├── footer.css                  # Footer
│   ├── modals.css                  # All modal styles
│   ├── animations.css              # @keyframes (slideUp, fadeIn)
│   └── responsive.css              # Media queries
│
├── data/
│   └── icons.jsx                   # SVG icon components (tech + UI)
│
└── utils/
    ├── generateFavicon.js          # Canvas-based dynamic favicon
    └── constants.js                # Static strings, social URLs
```

---

## Firebase Setup

### Firebase Config (`src/config/firebase.js`)

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### Firestore Collections

```
perosnal_data/              ← (legacy typo — kept for compatibility)
├── certifications          ← credentials / education / skills
├── projects                ← portfolio project entries
└── tech_stack              ← technology marquee items
```

> **Note:** The collection name `perosnal_data` contains a typo from the original setup. It is kept as-is to avoid a data migration. If you rename it, update every Firestore reference in the `hooks/` directory.

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /personal_data/{document=**} {
      // Public read — anyone can view the portfolio
      allow read: if true;

      // Write — only the authenticated admin
      allow write: if request.auth != null
                   && request.auth.token.email == 'your_admin_email@domain.com';
    }
  }
}
```

### Authentication

- **Provider:** Google Sign-In (popup flow).
- **Purpose:** Admin-only. Public visitors never need to log in.
- **Admin whitelist:** Defined in `src/contexts/AuthContext.jsx` via the `VITE_ADMIN_EMAIL` environment variable.
- **Enable in Firebase Console:** Authentication → Sign-in method → Google → Enable.

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=your_admin_email@domain.com
```

> Vite only exposes variables prefixed with `VITE_`. Firebase client keys are safe to expose — security is enforced by Firestore rules.

---

## CSS Architecture

### Import Order (`main.jsx`)

```javascript
import './styles/variables.css';
import './styles/base.css';
import './styles/background.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/technologies.css';
import './styles/credentials.css';
import './styles/projects.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/modals.css';
import './styles/animations.css';
import './styles/responsive.css';
```

### Design Tokens (`variables.css`)

| Variable | Dark | Light |
|----------|------|-------|
| `--bg` | `#050505` | `#eae6dd` |
| `--surface` | `#0c0c0c` | `#f5f3ef` |
| `--text` | `#f0f0f0` | `#1a1816` |
| `--text-muted` | `#999` | `#6b655e` |
| `--accent` | `#fff` | `#1a1816` |
| `--border-color` | `rgba(255,255,255,.1)` | `rgba(0,0,0,.12)` |
| `--nav-bg` | `rgba(5,5,5,.8)` | `rgba(234,230,221,.92)` |

### Font

**Space Grotesk** from Google Fonts. Load in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Key Behaviors

- **Theme** — The `data-theme` attribute on `<html>` switches between `dark` and `light`. All colors are CSS variables.
- **Spotlight** — A `mousemove` listener sets `--mx` / `--my` on `document.documentElement`. The `.spotlight` div renders a radial gradient at those coordinates.
- **Scroll Reveal** — Elements with `.reveal-content` (and delay classes `.d1`, `.d2`) animate in when their parent `.reveal-section` gets the `.in-view` class via IntersectionObserver.

---

## Components Guide

### Contexts

| Context | Hook | Returns |
|---------|------|---------|
| `ThemeContext` | `useTheme()` | `{ theme, toggleTheme }` |
| `AuthContext` | `useAuth()` | `{ user, isAdmin, loading, loginWithGoogle, logout }` |

### Data Hooks

| Hook | Returns | Firestore Source |
|------|---------|-----------------|
| `useProjects()` | `{ projects, loading, addProject, updateProject, deleteProject }` | `perosnal_data/projects` |
| `useCredentials()` | `{ credentials, loading, addCredential, updateCredential, deleteCredential }` | `perosnal_data/certifications` |
| `useTechStack()` | `{ row1, row2, loading, updateRow1, updateRow2 }` | `perosnal_data/tech_stack` |

### Section Components

| Component | Data Source | Description |
|-----------|-------------|-------------|
| `Hero` | Static (`constants.js`) | Full-screen landing with animated heading + resume button |
| `Technologies` | `useTechStack()` | Two-row infinite marquee of tech icons |
| `Credentials` | `useCredentials()` | Top-3 preview cards + "View More" → table modal |
| `Projects` | `useProjects()` | 3-card preview grid + "View More" → full grid modal |
| `Contact` | Static | CTA heading + email button |

### UI Components

| Component | Props | Notes |
|-----------|-------|-------|
| `Modal` | `isOpen`, `onClose`, `size?` (`''` / `'modal-sm'` / `'modal-lg'`) | Escape key, overlay click, scroll lock |
| `ScrollReveal` | `className?`, `threshold?` | Wraps sections for scroll-triggered `.in-view` |
| `ProjectCard` | `project`, `index`, `onClick` | 3D tilt via mousemove transforms |
| `VaultCard` | `item` | Credential preview card |

---

## Admin Panel

### Access

Hidden from public visitors. Implement one of:
- Triple-click on footer copyright text
- Navigate to `/#admin`
- Keyboard shortcut `Ctrl+Shift+A`

Sign in with Google (`olimpiu.ticudean@gmail.com`). The `<AdminBar />` floating toolbar appears.

### Capabilities

| Action | Component | Description |
|--------|-----------|-------------|
| Add Project | `ProjectEditor` | Modal form to create a new project |
| Edit Project | `ProjectEditor` | Pre-filled form for existing project |
| Delete Project | `ProjectEditor` | Remove with confirmation dialog |
| Add Credential | `CredentialEditor` | Create certification / education / skill entry |
| Edit Credential | `CredentialEditor` | Modify existing credential |
| Delete Credential | `CredentialEditor` | Remove with confirmation |
| Edit Tech Stack | `TechStackEditor` | Add / remove / reorder technologies in the marquee |
| Logout | `AdminBar` | Signs out, hides admin toolbar |

### Editor Fields

**Project:**

| Field | Type | Required |
|-------|------|----------|
| `title` | text | ✅ |
| `desc` | textarea | ✅ |
| `gradient` | two color pickers → generates CSS gradient | ✅ |
| `tags` | comma-separated text | ✅ |
| `features` | multi-line textarea (one per line) | ✅ |
| `url` | text (URL) | ❌ |

**Credential:**

| Field | Type | Required |
|-------|------|----------|
| `category` | select (`certificates` / `education` / `skills`) | ✅ |
| `title` | text | ✅ |
| `issuer` | text | ✅ |
| `date` | text | ✅ |
| `desc` | textarea | ✅ |
| `badge` | text | ✅ |

**Technology:**

| Field | Type | Required |
|-------|------|----------|
| `name` | text | ✅ |
| `svg` | textarea (raw SVG markup) | ✅ |
| `row` | select (Row 1 / Row 2) | ✅ |

---

## Firestore Data Schemas

### `perosnal_data/projects`

```jsonc
{
  "items": [
    {
      "num": "01",
      "title": "Project Title",
      "desc": "Short description of the project.",
      "gradient": "linear-gradient(135deg, #667eea, #764ba2)",
      "tags": ["React", "Firebase", "Node.js"],
      "features": [
        "Feature description one",
        "Feature description two"
      ],
      "url": "https://example.com",  // optional
      "order": 0
    }
  ]
}
```

### `perosnal_data/certifications`

```jsonc
{
  "items": [
    {
      "category": "certificates",  // "certificates" | "education" | "skills"
      "title": "Certification Title",
      "issuer": "Issuing Organization",
      "date": "2024",
      "desc": "Description of the certification.",
      "badge": "Badge Label",
      "order": 0
    }
  ]
}
```

### `perosnal_data/tech_stack`

```jsonc
{
  "row1": [
    { "name": "React", "svg": "<svg ...>...</svg>" }
  ],
  "row2": [
    { "name": "Python", "svg": "<svg ...>...</svg>" }
  ]
}
```

---

## Deployment

### Firebase Hosting

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore security rules
firebase deploy --only firestore:rules
```

### Custom Domain

Firebase Console → Hosting → Add custom domain → Follow DNS verification steps. SSL is provisioned automatically.

---

## Performance

| Optimization | Details |
|-------------|---------|
| **Code splitting** | Lazy-load modals and admin components with `React.lazy()` + `Suspense` |
| **Tree-shaking** | Use Firebase modular SDK — import only `getDoc`, `doc`, etc. |
| **Firestore caching** | `sessionStorage` with 5-minute TTL to avoid redundant reads |
| **CSS** | `will-change: transform` on animated elements; `contain: content` on cards |
| **Images** | If using project screenshots, serve WebP from Firebase Storage with `loading="lazy"` |
| **Font loading** | `font-display: swap` via Google Fonts `&display=swap` parameter |
| **Marquee** | Items duplicated 10× in the track for seamless infinite scroll at any viewport |
