# Project Overview & Architecture Guide

## 📌 About the Project
This project is a high-performance, single-page developer portfolio web application built for **Olimpiu Ticudean** (BSc Hons Computing Graduate). It presents an ultra-professional, modern digital experience featuring authentic CV credentials, real full-stack projects, and interactive tech stack showcases.

---

## 🛠️ Technology Stack
- **Core Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables (`index.css`)
- **Icons**: `react-icons/si`, `react-icons/fa6`, `lucide-react`
- **Animations & Micro-interactions**: Framer Motion + 3D Tilt Card Component
- **Theme System**: React Context (`ThemeContext.jsx`) with `localStorage` persistence (`portfolio_theme`)
- **Backend / Services**: Firebase Cloud Firestore integration (`AuthContext.jsx`, `useProjects`, `useCredentials`, `AdminEditorModal.jsx`)

---

## 📁 Key File Structure
```
src/
├── components/
│   ├── admin/
│   │   ├── AdminEditorModal.jsx# Admin Content Studio with Image URL field, Live Preview, and Move Up (▲) / Move Down (▼) Re-Ordering System
│   ├── layout/
│   │   ├── Header.jsx          # Scroll-spy nav, theme toggle, hover underline
│   │   ├── Footer.jsx          # Admin lock, social links (X, LinkedIn, GitHub, Email), back-to-top
│   ├── sections/
│   │   ├── Hero.jsx            # Clean oversized title, subtitle, evidenced primary CTA
│   │   ├── Technologies.jsx    # 3x4 sequential reading wave grid, 41 tech pool items, centered show-all directory button & modal
│   │   ├── Credentials.jsx     # Top 3 credentials, vault directory modal
│   │   ├── Projects.jsx        # Top 3 3D tilt project cards, image render / mesh gradient banners, modal preview
│   │   ├── Contact.jsx         # Left headline, right social cards (X @tic_oli, LinkedIn, GitHub), direct message CTA
│   ├── ui/
│   │   ├── Modal.jsx           # Portal-based modal escaping stacking contexts (createPortal)
│   │   ├── TiltCard.jsx        # 3D mouse perspective tilt card component
├── contexts/
│   ├── ThemeContext.jsx        # Dark/Light mode theme state & persistence
│   ├── AuthContext.jsx         # Admin authentication state
├── data/
│   ├── icons.jsx               # Tech brand color mapping & contrast adjustments
├── utils/
│   ├── constants.js            # Authentic CV datasets (MOCK_PROJECTS, MOCK_CREDENTIALS)
├── index.css                   # WCAG AAA compliant Slate 950 & Slate 50 color tokens
```

---

## 🔐 Admin Studio Capabilities
1. **Project Image Editing**: Every project has an **Image URL or Local Path (`image` / `imageUrl`)** field in Admin Mode with a live card preview box.
2. **Real-time Re-ordering (Move Up ▲ / Move Down ▼)**: Items can be re-ordered directly in Admin Mode via ▲ / ▼ buttons or the `order` numerical field. Firestore updates the `order` property instantly.
