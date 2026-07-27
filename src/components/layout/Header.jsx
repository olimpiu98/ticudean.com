import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../data/icons';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import ThemeToggle from '../ui/ThemeToggle';
import AuthModal from '../auth/AuthModal';
import MembersModal from '../admin/MembersModal';
import { openPrintableResume } from '../../utils/openResume';
import { useFirebaseStatus } from '../../hooks/useFirebaseStatus';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [backendHovered, setBackendHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const { isOnline, isRestricted, errorDetails } = useFirebaseStatus();
  const profileRef = useRef(null);
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => sectionObserver.observe(s));

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((s) => sectionObserver.unobserve(s));
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Resume', href: '#hero', id: 'hero' },
    { name: 'Credentials', href: '#credentials', id: 'credentials' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full h-16 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-nav-bg backdrop-blur-2xl border-b border-border shadow-sm scrolled'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="header-inner h-full flex items-center justify-between">
          
          {/* Logo Name with Backend Service Details Hover Popover */}
          <div 
            className="relative inline-block py-2"
            onMouseEnter={() => setBackendHovered(true)}
            onMouseLeave={() => setBackendHovered(false)}
          >
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="logo flex items-center gap-2"
            >
              <span>Olimpiu Ticudean</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
            </a>

            {/* Premium Backend Service Details Hover Card */}
            <AnimatePresence>
              {backendHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-1.5 w-64 p-4 bg-surface border border-border rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-[200] text-xs pointer-events-none"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      </span>
                      <span className="font-bold text-text uppercase text-[10px] tracking-wider">Backend Service Details</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {isOnline ? 'ONLINE' : isRestricted ? 'RESTRICTED' : 'DEMO'}
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-muted font-medium">Database System:</span>
                      <span className="font-mono text-text font-bold">{isOnline ? 'Firestore Cloud' : isRestricted ? 'Access Blocked' : 'Local JSON'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted font-medium">Auth Provider:</span>
                      <span className="font-mono text-text font-bold">{isOnline ? 'Google OAuth 2.0' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted font-medium">Realtime Sync:</span>
                      <span className={`font-mono font-bold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>{isOnline ? 'Active (0ms)' : 'Blocked'}</span>
                    </div>
                    {isRestricted && (
                      <div className="pt-2 mt-1 border-t border-border/50 text-[10px] text-amber-400 font-mono">
                        ⚠ {errorDetails || 'Security Rules blocking database read.'}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right-Aligned Controls & Links */}
          <div className="nav-group flex items-center gap-1 sm:gap-2">
            
            {/* Navigation Links (Desktop Only - 1024px+) */}
            <nav className="desktop-nav hidden lg:flex items-center">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Divider before Theme Toggle */}
            <div className="nav-divider hidden lg:block"></div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Divider before Sign In / User Profile */}
            <div className="nav-divider hidden lg:block"></div>

            {/* User Profile / Auth State Pill */}
            {loading ? (
              <div className="w-20 h-7 rounded-full bg-surface border border-border animate-pulse shrink-0" />
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border hover:border-border-hover rounded-full transition-all duration-200 shadow-sm"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-accent text-bg flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                      {user.displayName ? user.displayName[0] : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-text max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || 'Member'}
                  </span>
                </button>

                {/* Animated Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 p-3 bg-surface border border-border rounded-2xl shadow-xl z-50 text-xs space-y-2"
                    >
                      {/* User Card */}
                      <div className="p-3 rounded-xl bg-surface-hover/60 border border-border flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-border shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-accent text-bg flex items-center justify-center text-sm font-bold shrink-0">
                            {user.displayName ? user.displayName[0] : 'U'}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <div className="font-bold text-text truncate">{user.displayName || 'Member'}</div>
                          <div className="text-[10px] font-mono text-muted truncate">{user.email}</div>
                          <div className="text-[9px] font-mono text-emerald-400 mt-0.5">Verified Member</div>
                        </div>
                      </div>

                      {/* Admin Mode Status */}
                      {isAdmin && (
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider text-center">
                          Admin Mode Active
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="space-y-1 pt-1">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                openPrintableResume();
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-left font-bold text-text transition-colors text-xs flex items-center justify-between"
                            >
                              <span>Official CV / Resume</span>
                            </button>

                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                setMembersModalOpen(true);
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-left font-bold text-text transition-colors text-xs flex items-center justify-between"
                            >
                              <span>Members Directory</span>
                            </button>
                          </>
                        )}

                        <div className="pt-1 border-t border-border mt-1">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              logout();
                            }}
                            className="w-full px-3 py-2 rounded-lg text-left font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wider text-[10px]"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-primary py-1.5 px-3.5 text-[11px]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Admin Members Directory Modal */}
      <MembersModal isOpen={membersModalOpen} onClose={() => setMembersModalOpen(false)} />
    </>
  );
}
