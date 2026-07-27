/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        border: 'var(--border-color)',
        'border-hover': 'var(--border-hover)',
        'nav-bg': 'var(--nav-bg)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
