import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield, BarChart3, Settings } from "lucide-react";

// Cookie categories and their descriptions
const COOKIE_KEY = "lumina_cookie_consent";
const COOKIE_EXPIRY_DAYS = 365;

type ConsentState = {
  necessary: true; // always true, can't be toggled
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
};

// Helpers to read/write actual browser cookies
function setCookieConsent(consent: ConsentState) {
  const value = JSON.stringify(consent);
  const expires = new Date(Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookieConsent(): ConsentState | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE_KEY}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

// Apply analytics cookies based on consent
function applyConsent(consent: ConsentState) {
  // Analytics (e.g. Google Analytics placeholder)
  if (consent.analytics) {
    // When you add GA/Clarity, enable it here
    // window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    console.info("[Lumina Cookies] Analytics cookies: GRANTED");
  } else {
    // window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    console.info("[Lumina Cookies] Analytics cookies: DENIED");
  }

  if (consent.preferences) {
    console.info("[Lumina Cookies] Preference cookies: GRANTED");
  }

  if (consent.marketing) {
    console.info("[Lumina Cookies] Marketing cookies: DENIED/GRANTED:", consent.marketing);
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: false,
  });

  // On mount, check if consent already given
  useEffect(() => {
    const saved = getCookieConsent();
    if (saved) {
      applyConsent(saved);
      return; // already consented
    }
    // Small delay so it doesn't flash during loading screen
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: ConsentState = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    setCookieConsent(fullConsent);
    applyConsent(fullConsent);
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    const minimalConsent: ConsentState = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    setCookieConsent(minimalConsent);
    applyConsent(minimalConsent);
    setVisible(false);
  };

  const handleSaveCustom = () => {
    setCookieConsent(consent);
    applyConsent(consent);
    setVisible(false);
  };

  const toggle = (key: keyof Omit<ConsentState, "necessary">) => {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop for customize panel on mobile */}
          {showCustomize && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-[#101B38]/40 backdrop-blur-sm"
              onClick={() => setShowCustomize(false)}
            />
          )}

          {/* Main cookie banner */}
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260, delay: 0.1 }}
            className="fixed bottom-0 left-0 right-0 z-[160] p-3 md:p-4"
          >
            <div className="max-w-5xl mx-auto bg-[#0D1628] border border-[#C9A84C]/20 rounded-2xl shadow-[0_-4px_40px_rgba(0,0,0,0.5)] overflow-hidden">

              {/* --- Customize Panel (expanded) --- */}
              <AnimatePresence>
                {showCustomize && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-b border-white/[0.06]"
                  >
                    <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Necessary */}
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <Shield className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-semibold">Necessary</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C]">Always on</span>
                          </div>
                          <p className="text-white/40 text-xs leading-relaxed">Required for the website to function. Cannot be disabled.</p>
                        </div>
                      </div>

                      {/* Analytics */}
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <BarChart3 className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-semibold">Analytics</span>
                            <button
                              onClick={() => toggle("analytics")}
                              className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${consent.analytics ? "bg-[#C9A84C]" : "bg-white/20"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${consent.analytics ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                          </div>
                          <p className="text-white/40 text-xs leading-relaxed">Help us understand how visitors interact with our site.</p>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <Settings className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-semibold">Preferences</span>
                            <button
                              onClick={() => toggle("preferences")}
                              className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${consent.preferences ? "bg-[#C9A84C]" : "bg-white/20"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${consent.preferences ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                          </div>
                          <p className="text-white/40 text-xs leading-relaxed">Remember your settings and personalise your experience.</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-4 flex justify-end">
                      <button
                        onClick={handleSaveCustom}
                        className="px-5 py-2 rounded-full text-sm font-semibold text-[#101B38] transition-all duration-200 hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #E3C66D, #C9A84C)" }}
                      >
                        Save my choices
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- Main banner row --- */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4">
                {/* Icon + text */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#C9A84C]/15 flex items-center justify-center mt-0.5">
                    <Cookie className="w-5 h-5 text-[#C9A84C]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">We use cookies</p>
                    <p className="text-white/45 text-xs mt-0.5 leading-relaxed">
                      We use cookies to improve your experience and analyse site usage.{" "}
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("show-cookies"))}
                        className="text-[#C9A84C] underline underline-offset-2 hover:text-[#E3C66D]"
                      >
                        Learn more
                      </button>
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setShowCustomize((s) => !s)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-full text-xs font-semibold text-white/60 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all duration-200"
                  >
                    Customise
                  </button>
                  <button
                    onClick={handleRejectNonEssential}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-full text-xs font-semibold text-white/60 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all duration-200"
                  >
                    Reject all
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-xs font-semibold text-[#101B38] transition-all duration-200 hover:opacity-90 shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                    style={{ background: "linear-gradient(135deg, #E3C66D, #C9A84C)" }}
                  >
                    Accept all
                  </button>
                </div>

                {/* Close (same as reject) */}
                <button
                  onClick={handleRejectNonEssential}
                  className="hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-200"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
