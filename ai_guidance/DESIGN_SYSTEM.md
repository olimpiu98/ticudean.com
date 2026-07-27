# Design System & Theme Guidelines

## 🎨 Color Palette & WCAG AAA Compliance

The color tokens are engineered based on **W3C WCAG AAA Contrast Standards** (7:1+ contrast ratio) and design principles from **Vercel** and **Linear**.

### 🌙 Dark Theme (Pure Minimalist Obsidian)
- **Background (`--bg`)**: `#050505` (Pure Deep Minimalist Black)
- **Surface Cards (`--surface`)**: `#0c0c0c` (Elevated Card Surface)
- **Surface Hover (`--surface-hover`)**: `#171717` (Subtle Card Hover State)
- **Primary Text (`--text`)**: `#f0f0f0` (**15.8:1 Contrast Ratio**)
- **Muted Text (`--text-muted`)**: `#999999` (**7.1:1 Contrast Ratio**)
- **Borders (`--border-color`)**: `rgba(255, 255, 255, 0.1)` (Subtle 10% Translucent White)
- **Border Hover (`--border-hover`)**: `rgba(255, 255, 255, 0.22)` (Refined 22% Hover Highlight)

### ☀️ Light Theme (Warm-Grey Ceramic & Crisp White)
- **Background (`--bg`)**: `#eae6dd` (Warm Sand/Grey Base)
- **Surface Cards (`--surface`)**: `#f5f3ef` (Elevated Warm Surface)
- **Surface Hover (`--surface-hover`)**: `#ffffff` (Pure Crisp White Pop - **prevents melting into cream background**)
- **Primary Text (`--text`)**: `#1a1816` (**14.9:1 Contrast Ratio**)
- **Muted Text (`--text-muted`)**: `#6b655e` (**6.5:1 Contrast Ratio**)
- **Borders (`--border-color`)**: `rgba(0, 0, 0, 0.12)`
- **Border Hover (`--border-hover`)**: `rgba(0, 0, 0, 0.25)`

---

## 🤖 CRITICAL RULES FOR AI ASSISTANTS

1. **Dark Mode Borders (DO NOT USE `border-text/30` or `border-border/80`)**:
   - **Why**: In Tailwind CSS v3, using opacity modifiers (like `/80` or `/30`) on CSS variable colors (e.g., `border-text/30` where `--text` is `#f0f0f0`) forces Tailwind to output `rgba(240, 240, 240, 0.3)` — producing **stark, bright white borders** against `#050505` black!
   - **Fix**: ALWAYS use `border-border` (`var(--border-color)`) for static borders and `hover:border-border-hover` (`var(--border-hover)`) for hover states.

2. **Light Theme Hover Contrast**:
   - **Why**: If `--surface-hover` is set to cream `#e5e1d6`, elements hovered in light mode blend invisibly into `--bg: #eae6dd`.
   - **Fix**: Keep `--surface-hover` as `#ffffff` (pure white pop with subtle shadow) so hover cards and buttons have crisp, clear visual feedback.

3. **Floating Popovers & Hover Cards Z-Index**:
   - **Why**: Popovers inside fixed headers (like the backend details popover on logo hover) can be overlapped by hero section titles or sticky elements.
   - **Fix**: Header element MUST have `z-[100]` and floating popovers MUST have `z-[200]` with solid non-transparent background (`bg-surface`) so underlying section text never bleeds through.

---

## 🏷️ Brand Colors & Smart Contrast Rules

Tech brand icons use authentic brand colors (`useBrandColor={true}`) mapped in `src/data/icons.jsx`:
- **Dark Brand Colors (e.g., GitHub `#181717`)**: Automatically render as crisp white `#ffffff` in dark theme.
- **Yellow Brand Colors (e.g., JavaScript `#F7DF1E`, Linux `#FCC624`)**: Automatically adjust contrast in light theme for legibility (`#D97706`).

---

## 💎 Component Aesthetics
1. **Modals**: Must use `createPortal(modalJSX, document.body)` to escape local stacking contexts.
2. **Buttons**:
   - Primary CTA ("Request Resume Access"): Evidenced button with outer accent ring (`ring-2 ring-text/20`) and scale transition.
   - Secondary Buttons ("Explore Projects", "Show All Tech"): Compact, rounded-full pill buttons with subtle hover borders (`border-border hover:border-border-hover`).
3. **Cards**: Use `TiltCard.jsx` for 3D mouse perspective interaction (`perspective(800px) rotateX/rotateY`).
