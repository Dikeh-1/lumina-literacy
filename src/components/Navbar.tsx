import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "#programs" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Always-visible static navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#101B38]/90 backdrop-blur-xl border-b border-[#C9A84C]/15 shadow-[0_1px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dxvvzuu3n/image/upload/v1781340134/loooooo_pbkjvi.png"
              alt="Lumina Literacy Solutions"
              className="h-8 lg:h-10 w-auto"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-full text-white/70 hover:text-white group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[#C9A84C] to-[#E3C66D] transition-all duration-200 group-hover:w-5 rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block flex-shrink-0">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("show-maintenance"))}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold tracking-wide rounded-full transition-all duration-200 hover:opacity-90 hover:shadow-[0_4px_20px_rgba(201,168,76,0.35)]"
              style={{ background: "linear-gradient(135deg, #C9A84C, #A88426)", color: "#FFFCF7" }}
            >
              Partner With Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 p-2.5 rounded-lg text-white transition-colors duration-200 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <X key="close" className="w-6 h-6" />
              ) : (
                <Menu key="menu" className="w-6 h-6" />
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#101B38]/75 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#0D1628] shadow-2xl border-l border-[#C9A84C]/10 flex flex-col">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <img
                  src="https://res.cloudinary.com/dxvvzuu3n/image/upload/v1781340134/loooooo_pbkjvi.png"
                  alt="Lumina Literacy Solutions"
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col px-4 py-6 gap-1 flex-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 hover:text-white text-lg font-medium py-4 px-5 rounded-xl hover:bg-white/[0.06] transition-colors duration-200 border border-transparent hover:border-[#C9A84C]/10"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* CTA */}
              <div className="px-6 pb-8 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("show-maintenance"));
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-semibold tracking-wide rounded-full text-[#101B38] transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #E3C66D, #C9A84C)" }}
                >
                  Partner With Us
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-white/25 mt-5">
                  © 2026 Lumina Literacy Solutions Ltd
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
