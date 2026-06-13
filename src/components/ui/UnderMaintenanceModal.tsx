import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export function UnderMaintenanceModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShow = () => setIsOpen(true);
    window.addEventListener('show-maintenance', handleShow);
    return () => window.removeEventListener('show-maintenance', handleShow);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#101B38]/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#FFFCF7] p-8 shadow-2xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#1B2D5E]/60 transition-colors hover:bg-[#1B2D5E]/5 hover:text-[#1B2D5E]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ rotate: -15, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  damping: 10,
                  stiffness: 100,
                  delay: 0.1,
                }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100"
              >
                <AlertTriangle className="h-10 w-10 text-orange-500" />
              </motion.div>
              <h2
                className="mb-2 text-3xl font-bold text-[#1B2D5E]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Under Maintenance
              </h2>
              <p className="mb-8 text-[#1B2D5E]/70">
                Sorry, our Dev Team is still working on this feature. It will be available soon!
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-full py-3.5 text-sm font-semibold tracking-wide text-[#FFFCF7] transition-all duration-300 hover:scale-[1.02] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #A88426)',
                }}
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
