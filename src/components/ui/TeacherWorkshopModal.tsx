import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function TeacherWorkshopModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const showEvent = () => setIsOpen(true);
    window.addEventListener('show-teacher-workshop', showEvent);
    return () => window.removeEventListener('show-teacher-workshop', showEvent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#101B38]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-[#FBF8F2] rounded-2xl shadow-2xl overflow-hidden border border-[#C9A84C]/20 flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#1B2D5E]/10 bg-white">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1B2D5E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Teacher Workshop
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#1B2D5E]/60 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content (Iframe container) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 m-0 bg-white relative w-full h-full -webkit-overflow-scrolling-touch">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSfr-tZw1cY9pwGYfgsa_-_qhGBaDb-DKdHnZX5W0nGFaoCC9w/viewform?embedded=true" 
                className="w-full h-full min-h-[1347px] sm:min-h-[1200px]"
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0}
                title="Lumina Teacher Workshop Request Form"
              >
                Loading…
              </iframe>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
