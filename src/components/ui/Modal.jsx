import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../data/icons';

export default function Modal({ isOpen, onClose, children, size = 'md', zIndex = 'z-[100]' }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-3xl',
    lg: 'max-w-5xl'
  };

  const modalJSX = (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 sm:p-6`}>
          {/* Ambient Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Professional Hairline Border Floating Modal */}
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full ${sizeClasses[size]} bg-surface border border-border text-text rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] z-10`}
          >
            {/* Theme-Aware Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 z-30 w-8 h-8 rounded-full bg-surface-hover hover:bg-surface border border-border text-muted hover:text-text flex items-center justify-center transition-all shadow-sm"
              aria-label="Close modal"
              title="Close modal (Esc)"
            >
              <Icon name="X" size={15} />
            </button>

            {/* Scrollable Body Container */}
            <div className="overflow-y-auto custom-scrollbar flex-grow">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render at document.body level via React Portal to prevent clipping
  return createPortal(modalJSX, document.body);
}
