import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, FileText, Cookie } from 'lucide-react';

type ModalType = 'maintenance' | 'privacy' | 'terms' | 'cookies' | null;

const legalContent: Record<string, { title: string; icon: React.ElementType; body: React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    body: (
      <div className="text-left space-y-4 text-sm text-[#1B2D5E]/70 leading-relaxed">
        <p><strong className="text-[#1B2D5E]">Last updated: June 2026</strong></p>
        <p>Lumina Literacy Solutions Ltd ("we", "our", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal data.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Information We Collect</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Email addresses submitted via our newsletter signup</li>
          <li>Enquiry details submitted through contact forms</li>
          <li>General site analytics (pages visited, device type, location region)</li>
        </ul>
        <h4 className="font-semibold text-[#1B2D5E]">How We Use Your Data</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>To send our Tales & Treasures newsletter (with your consent)</li>
          <li>To respond to partnership or programme enquiries</li>
          <li>To improve our website and services</li>
        </ul>
        <h4 className="font-semibold text-[#1B2D5E]">Data Sharing</h4>
        <p>We do not sell, trade, or rent your personal data to third parties. Data may be shared with trusted service providers (e.g., email platforms) strictly for the purposes above.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Your Rights</h4>
        <p>You may request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:hello@luminaliteracy.com" className="text-[#C9A84C] underline">hello@luminaliteracy.com</a>.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Contact</h4>
        <p>Lumina Literacy Solutions Ltd, Abuja, Nigeria. Email: hello@luminaliteracy.com</p>
      </div>
    ),
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    body: (
      <div className="text-left space-y-4 text-sm text-[#1B2D5E]/70 leading-relaxed">
        <p><strong className="text-[#1B2D5E]">Last updated: June 2026</strong></p>
        <p>By accessing or using the Lumina Literacy Solutions website ("Site"), you agree to be bound by these Terms of Service.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Use of the Site</h4>
        <p>The Site and its content are provided for informational purposes about our literacy programmes, publications, and partnership opportunities. You may not reproduce or redistribute any content without written permission.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Intellectual Property</h4>
        <p>All content, logos, text, and graphics on this Site are the property of Lumina Literacy Solutions Ltd and are protected by Nigerian and international copyright laws.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Disclaimer</h4>
        <p>The Site is provided "as is." We make no warranties regarding accuracy, completeness, or fitness for a particular purpose. We are not liable for any losses arising from your use of this Site.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Newsletter Subscriptions</h4>
        <p>By subscribing to our newsletter, you consent to receiving periodic emails from Lumina Literacy Solutions. You may unsubscribe at any time via the unsubscribe link in any email.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Governing Law</h4>
        <p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p>
      </div>
    ),
  },
  cookies: {
    title: 'Cookie Policy',
    icon: Cookie,
    body: (
      <div className="text-left space-y-4 text-sm text-[#1B2D5E]/70 leading-relaxed">
        <p><strong className="text-[#1B2D5E]">Last updated: June 2026</strong></p>
        <p>This Cookie Policy explains what cookies are and how Lumina Literacy Solutions Ltd uses them on this website.</p>
        <h4 className="font-semibold text-[#1B2D5E]">What Are Cookies?</h4>
        <p>Cookies are small text files stored on your device when you visit a website. They help us understand how visitors use our Site and improve your experience.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Cookies We Use</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Essential cookies:</strong> Required for core site functionality (e.g., navigation preferences)</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our pages (e.g., pages visited, time spent)</li>
          <li><strong>Preference cookies:</strong> Remember settings such as language or region</li>
        </ul>
        <h4 className="font-semibold text-[#1B2D5E]">Managing Cookies</h4>
        <p>Most browsers allow you to control cookies through their settings. Disabling certain cookies may affect the functionality of some Site features. You can also opt out of analytics cookies without affecting your browsing experience.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Third-Party Cookies</h4>
        <p>We may use third-party services (such as analytics providers) that set their own cookies. These are governed by the respective third parties' privacy policies.</p>
        <h4 className="font-semibold text-[#1B2D5E]">Contact</h4>
        <p>Questions? Email us at <a href="mailto:hello@luminaliteracy.com" className="text-[#C9A84C] underline">hello@luminaliteracy.com</a>.</p>
      </div>
    ),
  },
};

export function UnderMaintenanceModal() {
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const handleMaintenance = () => setModal('maintenance');
    const handlePrivacy = () => setModal('privacy');
    const handleTerms = () => setModal('terms');
    const handleCookies = () => setModal('cookies');

    window.addEventListener('show-maintenance', handleMaintenance);
    window.addEventListener('show-privacy', handlePrivacy);
    window.addEventListener('show-terms', handleTerms);
    window.addEventListener('show-cookies', handleCookies);

    return () => {
      window.removeEventListener('show-maintenance', handleMaintenance);
      window.removeEventListener('show-privacy', handlePrivacy);
      window.removeEventListener('show-terms', handleTerms);
      window.removeEventListener('show-cookies', handleCookies);
    };
  }, []);

  const close = () => setModal(null);
  const isLegal = modal === 'privacy' || modal === 'terms' || modal === 'cookies';

  return (
    <AnimatePresence>
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#101B38]/65 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative w-full overflow-hidden rounded-3xl bg-[#FFFCF7] shadow-2xl ${isLegal ? 'max-w-lg max-h-[85vh] flex flex-col' : 'max-w-md'}`}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#1B2D5E]/50 transition-colors hover:bg-[#1B2D5E]/8 hover:text-[#1B2D5E]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* MAINTENANCE */}
            {modal === 'maintenance' && (
              <div className="flex flex-col items-center text-center p-8">
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.1 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100"
                >
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                </motion.div>
                <h2 className="mb-2 text-3xl font-bold text-[#1B2D5E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Under Maintenance
                </h2>
                <p className="mb-8 text-[#1B2D5E]/65">
                  Sorry, our Dev Team is still working on this feature. It will be available very soon!
                </p>
                <button
                  onClick={close}
                  className="w-full rounded-full py-3.5 text-sm font-semibold tracking-wide text-[#FFFCF7] transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #A88426)' }}
                >
                  Got it, thanks!
                </button>
              </div>
            )}

            {/* LEGAL CONTENT */}
            {isLegal && modal && legalContent[modal] && (() => {
              const { title, icon: Icon, body } = legalContent[modal];
              return (
                <>
                  <div className="px-6 pt-6 pb-4 border-b border-[#1B2D5E]/8 flex items-center gap-3 flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#C9A84C]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1B2D5E] pr-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {title}
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    {body}
                  </div>
                  <div className="px-6 py-4 border-t border-[#1B2D5E]/8 flex-shrink-0">
                    <button
                      onClick={close}
                      className="w-full rounded-full py-3 text-sm font-semibold text-[#FFFCF7] transition-all duration-200 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #C9A84C, #A88426)' }}
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
