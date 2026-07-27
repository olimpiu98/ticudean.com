import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Technologies from './components/sections/Technologies';
import Credentials from './components/sections/Credentials';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import AdminEditorModal from './components/admin/AdminEditorModal';

function AdminBar({ onOpenEditor }) {
  const { user, isAdmin, logout } = useAuth();
  
  if (!user || !isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 bg-surface backdrop-blur-2xl border border-border rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-4 text-xs font-semibold animate-slideUp">
      <span className="text-accent flex items-center gap-2 font-bold uppercase tracking-wider">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Admin Mode
      </span>

      <div className="w-px h-3.5 bg-border"></div>

      <button 
        onClick={onOpenEditor}
        className="px-4 py-1.5 bg-surface-hover border border-border text-text rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
      >
        <span>✏️ Edit Content</span>
      </button>

      <div className="w-px h-3.5 bg-border"></div>

      <button onClick={logout} className="text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider text-[11px] font-bold">
        Logout
      </button>
    </div>
  );
}

function MainLayout() {
  const [isAdminEditorOpen, setIsAdminEditorOpen] = useState(false);

  // Spotlight effect & Scroll Reveal observer
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Native smooth Scroll Reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Background FX Layers */}
      <div className="bg-grid"></div>
      <div className="bg-grid-reveal"></div>
      <div className="spotlight"></div>
      <div className="noise"></div>

      {/* Main Content */}
      <Header onOpenAdminEditor={() => setIsAdminEditorOpen(true)} />
      
      <main>
        <Hero />
        <Technologies />
        <Credentials />
        <Projects />
        <Contact />
      </main>

      <Footer />
      
      {/* Admin Interface */}
      <AdminBar onOpenEditor={() => setIsAdminEditorOpen(true)} />
      <AdminEditorModal isOpen={isAdminEditorOpen} onClose={() => setIsAdminEditorOpen(false)} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
