import React, { useEffect, useState } from "react"
import { ArrowRight } from 'lucide-react'

export function TuringLanding() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <div className="min-h-[80vh] bg-[#101B38] text-white overflow-hidden relative">
      {/* Subtle background gradient overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#101B38] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B38] via-transparent to-transparent opacity-50" />
      </div>

      {/* Main Content */}
      <main className="relative flex flex-col justify-center min-h-[80vh] py-20">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
            <img 
              src="/images/school_background.png" 
              alt="Background" 
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
            />
        </div>

        <div className="content-wrapper w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row justify-between items-end relative z-20">
          {/* Left Content */}
          <div className="max-w-[800px] pb-10 lg:pb-0">
            <p className="uppercase tracking-[0.2em] text-sm font-semibold text-[#C9A84C] mb-6">
              Become a Partner
            </p>
            <h2 
                className="text-[48px] md:text-[64px] lg:text-[80px] font-bold leading-[1.1] mb-6 tracking-[-0.02em] text-[#FFFCF7]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Fund Literacy.
              <br />
              <span className="text-[#C9A84C]">Transform Futures.</span>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-[#FFFCF7]/70 mb-10 max-w-2xl font-sans">
              Partner with us to sponsor literacy programs for underserved schools across Nigeria. Every contribution creates lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('show-maintenance'))}
                className="flex items-center justify-center gap-2.5 text-[#101B38] py-4 px-8 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(201,168,76,0.2)] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
                style={{ background: "linear-gradient(135deg, #E3C66D, #C9A84C)" }}
              >
                Become a partner
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('show-maintenance'))}
                className="bg-[#101B38]/60 backdrop-blur-md border border-[#C9A84C]/30 text-[#FFFCF7] py-4 px-8 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:border-[#C9A84C]/60 hover:scale-105 inline-block text-center"
              >
                Download CSR Brochure
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-row gap-12 items-end pt-12 lg:pt-0 pb-2">
            <div className="text-left">
              <div 
                className="text-[48px] lg:text-[64px] font-light leading-none mb-3 text-[#E3C66D]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                100+
              </div>
              <div className="text-sm uppercase tracking-wider text-[#FFFCF7]/60 font-medium">Schools Reached</div>
            </div>
            <div className="text-left">
              <div 
                className="text-[48px] lg:text-[64px] font-light leading-none mb-3 text-[#E3C66D]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                50k+
              </div>
              <div className="text-sm uppercase tracking-wider text-[#FFFCF7]/60 font-medium">Students Impacted</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
