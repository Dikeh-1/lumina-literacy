import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

// Lazy load Spline for performance
const Spline = lazy(() => import("@splinetool/react-spline"));

// Spotlight effect component
function Spotlight({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 70% 40%, rgba(201, 168, 76, 0.12), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(400px circle at 30% 60%, rgba(46, 74, 147, 0.08), transparent 50%)",
        }}
      />
    </motion.div>
  );
}

// 3D placeholder - elegant floating book visualization
function BookVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#E3C66D]/10 blur-[80px] animate-pulse-glow" />
      
      {/* Floating book SVG */}
      <motion.div
        className="relative"
        animate={{ 
          y: [-10, 10, -10],
          rotateY: [0, 5, 0, -5, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Light rays */}
          {[...Array(7)].map((_, i) => (
            <motion.line
              key={i}
              x1="160"
              y1="140"
              x2={100 + i * 20}
              y2={40 + Math.abs(i - 3) * 10}
              stroke="url(#goldGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3], pathLength: 1 }}
              transition={{ 
                duration: 2 + i * 0.3, 
                repeat: Infinity,
                delay: i * 0.2 
              }}
            />
          ))}
          
          {/* Open book - left page */}
          <motion.path
            d="M160 180 L60 160 L60 220 L160 240 Z"
            fill="url(#creamFill)"
            stroke="#C9A84C"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          {/* Open book - right page */}
          <motion.path
            d="M160 180 L260 160 L260 220 L160 240 Z"
            fill="url(#creamFill2)"
            stroke="#C9A84C"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          {/* Book spine */}
          <line x1="160" y1="175" x2="160" y2="245" stroke="#A88426" strokeWidth="2" />
          
          {/* Page lines - left */}
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={`left-${i}`}
              x1={80}
              y1={190 + i * 10}
              x2={145}
              y2={195 + i * 10}
              stroke="#1B2D5E"
              strokeWidth="0.8"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.15 }}
            />
          ))}
          
          {/* Page lines - right */}
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={`right-${i}`}
              x1={175}
              y1={195 + i * 10}
              x2={240}
              y2={190 + i * 10}
              stroke="#1B2D5E"
              strokeWidth="0.8"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 1.2 + i * 0.15 }}
            />
          ))}
          
          {/* Floating letters */}
          {["A", "B", "I", "D", "E"].map((letter, i) => (
            <motion.text
              key={letter}
              x={90 + i * 35}
              y={150}
              fill="#C9A84C"
              fontSize="16"
              fontFamily="Cormorant Garamond, serif"
              fontWeight="600"
              opacity="0.6"
              animate={{
                y: [150, 130 - i * 5, 150],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              {letter}
            </motion.text>
          ))}
          
          {/* African geometric patterns (subtle) */}
          <motion.g opacity="0.15">
            {/* Diamond patterns */}
            <motion.path
              d="M70 130 L80 120 L90 130 L80 140 Z"
              stroke="#E3C66D"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M230 130 L240 120 L250 130 L240 140 Z"
              stroke="#E3C66D"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            {/* Zigzag */}
            <motion.polyline
              points="100,270 110,260 120,270 130,260 140,270 150,260 160,270"
              stroke="#C9A84C"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.g>
          
          {/* Gold particles */}
          {[...Array(12)].map((_, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={80 + Math.random() * 160}
              cy={100 + Math.random() * 120}
              r={1 + Math.random() * 2}
              fill="#E3C66D"
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -30 - Math.random() * 40],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E3C66D" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="creamFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFCF7" />
              <stop offset="100%" stopColor="#FBF8F2" />
            </linearGradient>
            <linearGradient id="creamFill2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFCF7" />
              <stop offset="100%" stopColor="#FBF8F2" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

export default function SplineHero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <Spotlight className="inset-0" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            className="flex flex-col gap-8 order-2 lg:order-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-[#C9A84C]/20">
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                <span className="text-xs font-medium tracking-wider text-[#C9A84C]/90 uppercase">
                  TRCN Licensed · Google & Microsoft Certified
                </span>
              </div>
            </motion.div>
            
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span className="text-[#FFFCF7] block">Where African Stories</span>
              <span className="block mt-2" style={{
                background: "linear-gradient(135deg, #E3C66D, #C9A84C, #A88426)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Build Brilliant Minds
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-base md:text-lg text-[#FFFCF7]/60 max-w-lg leading-relaxed font-light"
            >
              We help schools, educators and families transform literacy outcomes 
              through culturally authentic African stories and evidence-based 
              reading interventions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(201,168,76,0.35)] hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #A88426)",
                  color: "#FFFCF7",
                }}
              >
                <span className="relative z-10">Partner With Us</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#E3C66D] to-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </a>
              
              <a
                href="#programs"
                className="group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-full border border-[#C9A84C]/30 text-[#C9A84C]/90 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/5 transition-all duration-500 hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" />
                <span>Explore Programs</span>
              </a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-6 mt-4 pt-6 border-t border-white/10"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>500+</div>
                <div className="text-xs text-[#FFFCF7]/40 mt-0.5">Children</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>88%</div>
                <div className="text-xs text-[#FFFCF7]/40 mt-0.5">Proficiency</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>5+</div>
                <div className="text-xs text-[#FFFCF7]/40 mt-0.5">Schools</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Spline / Book Visualization */}
          <motion.div
            className="relative order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Glow behind the 3D scene */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#C9A84C]/10 blur-[100px]" />
              <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-[#2E4A93]/10 blur-[80px]" />
            </div>
            
            {/* Card container with glassmorphism */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              <Suspense
                fallback={<BookVisualization />}
              >
                {/* Replace URL with actual Spline scene when available */}
                <BookVisualization />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#FFFCF7]/30">Scroll</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-[#C9A84C]/30 flex items-start justify-center p-1"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-[#C9A84C]/60"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
