import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Star, Heart, Users, Sparkles } from "lucide-react";

// Lightning shader canvas for the electric divider
function LightningCanvas({ hoverProgress }: { hoverProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const isInView = useInView(canvasRef, { margin: "200px" });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const drawLightning = (
      x: number,
      y1: number,
      y2: number,
      segments: number,
      spread: number,
      alpha: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x, y1);

      const segHeight = (y2 - y1) / segments;
      for (let i = 1; i < segments; i++) {
        const offsetX = (Math.random() - 0.5) * spread;
        ctx.lineTo(x + offsetX, y1 + segHeight * i);
      }
      ctx.lineTo(x, y2);

      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glow
      ctx.strokeStyle = `rgba(227, 198, 109, ${alpha * 0.3})`;
      ctx.lineWidth = 6;
      ctx.stroke();
    };

    const render = () => {
      animRef.current = requestAnimationFrame(render);
      if (!isInViewRef.current) return;

      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;

      // Main vertical glow line
      const gradient = ctx.createLinearGradient(centerX, 0, centerX, canvas.height);
      gradient.addColorStop(0, "rgba(201, 168, 76, 0)");
      gradient.addColorStop(0.3, `rgba(201, 168, 76, ${0.15 + hoverProgress * 0.2})`);
      gradient.addColorStop(0.5, `rgba(227, 198, 109, ${0.25 + hoverProgress * 0.3})`);
      gradient.addColorStop(0.7, `rgba(201, 168, 76, ${0.15 + hoverProgress * 0.2})`);
      gradient.addColorStop(1, "rgba(201, 168, 76, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - 1, 0, 2, canvas.height);

      // Wider glow
      const glowGradient = ctx.createRadialGradient(
        centerX, canvas.height / 2, 0,
        centerX, canvas.height / 2, 40 + hoverProgress * 30
      );
      glowGradient.addColorStop(0, `rgba(201, 168, 76, ${0.08 + hoverProgress * 0.1})`);
      glowGradient.addColorStop(1, "rgba(201, 168, 76, 0)");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lightning bolts
      const boltCount = 2 + Math.floor(hoverProgress * 4);
      for (let i = 0; i < boltCount; i++) {
        if (Math.random() > 0.7 - hoverProgress * 0.3) {
          const startY = Math.random() * canvas.height;
          const length = 60 + Math.random() * 150;
          drawLightning(
            centerX,
            startY,
            startY + length,
            8 + Math.floor(Math.random() * 6),
            15 + hoverProgress * 20,
            0.3 + hoverProgress * 0.4 + Math.random() * 0.2
          );
        }
      }

      // Floating particles along the line
      for (let i = 0; i < 8; i++) {
        const py = (time * 50 + i * canvas.height / 8) % canvas.height;
        const px = centerX + Math.sin(time * 2 + i) * (5 + hoverProgress * 10);
        const size = 1.5 + Math.sin(time * 3 + i) * 0.8;
        
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227, 198, 109, ${0.4 + hoverProgress * 0.3})`;
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [hoverProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
}

const revealKeywords = [
  { word: "Heritage", icon: Star, color: "#C9A84C" },
  { word: "Culture", icon: Heart, color: "#E3C66D" },
  { word: "Identity", icon: Users, color: "#C9A84C" },
  { word: "Literacy", icon: BookOpen, color: "#E3C66D" },
  { word: "Learning", icon: Sparkles, color: "#C9A84C" },
];

export default function LightningSplit() {
  const [hoverProgress, setHoverProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const centerDist = Math.abs(x - 0.5);
      const progress = Math.max(0, 1 - centerDist * 4);
      setHoverProgress(progress);
    },
    []
  );

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#101B38]">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#2E4A93]/8 blur-[120px]" />

      {/* Section Header */}
      <motion.div
        className="text-center mb-16 px-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">
          Flagship Publication
        </span>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FFFCF7] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Discover{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #E3C66D, #C9A84C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            The Song of Gurara
          </span>
        </h2>
        <p className="text-[#FFFCF7]/50 max-w-2xl mx-auto text-base md:text-lg">
          A culturally authentic literacy experience that celebrates Nigerian
          heritage while strengthening reading confidence and comprehension.
        </p>
      </motion.div>

      {/* Split Container */}
      <div
        ref={containerRef}
        className="relative max-w-6xl mx-auto px-6 md:px-12"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setHoverProgress(0);
        }}
      >
        <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px] rounded-2xl overflow-hidden border border-[#C9A84C]/10">
          {/* Lightning Divider */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-20 z-20">
            <LightningCanvas hoverProgress={hoverProgress} />
          </div>

          {/* LEFT PANEL - Book Cover */}
          <motion.div
            className="relative flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-[#0D1629] to-[#152244]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Book mockup */}
            <motion.div
              className="relative"
              animate={{
                y: isHovering ? -8 : 0,
                rotateY: hoverProgress * 5,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Book shadow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/30 rounded-full blur-xl" />

              {/* Book cover */}
              <div
                className="relative w-56 h-80 md:w-64 md:h-[370px] rounded-lg overflow-hidden shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, #1B2D5E, #101B38)",
                  boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,${0.1 + hoverProgress * 0.15})`,
                }}
              >
                {/* Cover design */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  {/* African pattern top border */}
                  <div className="absolute top-0 inset-x-0 h-12 overflow-hidden opacity-30">
                    <svg width="100%" height="48" viewBox="0 0 260 48">
                      <pattern id="kente" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill="#C9A84C" opacity="0.4" />
                        <rect x="10" y="10" width="10" height="10" fill="#E3C66D" opacity="0.3" />
                      </pattern>
                      <rect width="260" height="48" fill="url(#kente)" />
                    </svg>
                  </div>

                  {/* Golden emblem */}
                  <motion.div
                    className="mb-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
                      <circle cx="24" cy="24" r="16" fill="none" stroke="#E3C66D" strokeWidth="0.3" />
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <line
                          key={i}
                          x1="24"
                          y1="4"
                          x2="24"
                          y2="12"
                          stroke="#C9A84C"
                          strokeWidth="0.5"
                          transform={`rotate(${angle} 24 24)`}
                        />
                      ))}
                    </svg>
                  </motion.div>

                  <h3
                    className="text-[#E3C66D] text-xl md:text-2xl font-bold leading-tight mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    The Song
                    <br />
                    of Gurara
                  </h3>
                  <div className="w-12 h-px bg-[#C9A84C]/40 mb-3" />
                  <p className="text-[#FFFCF7]/40 text-[10px] tracking-widest uppercase">
                    Lumina Literacy Solutions
                  </p>

                  {/* African pattern bottom border */}
                  <div className="absolute bottom-0 inset-x-0 h-8 overflow-hidden opacity-20">
                    <svg width="100%" height="32" viewBox="0 0 260 32">
                      <pattern id="kente2" width="16" height="16" patternUnits="userSpaceOnUse">
                        <polygon points="8,0 16,8 8,16 0,8" fill="#C9A84C" opacity="0.5" />
                      </pattern>
                      <rect width="260" height="32" fill="url(#kente2)" />
                    </svg>
                  </div>
                </div>

                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
              </div>
            </motion.div>

            {/* Book details below */}
            <motion.div
              className="mt-8 text-center"
              animate={{ opacity: isHovering ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[#C9A84C] text-sm font-medium tracking-wider uppercase mb-1">
                Ages 6 – 12
              </p>
              <p className="text-[#FFFCF7]/40 text-xs">
                Illustrated · 48 Pages · Full Colour
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT PANEL - Book Overview */}
          <motion.div
            className="relative flex flex-col justify-center p-8 md:p-12 bg-gradient-to-bl from-[#0F1D3A] to-[#131F3E]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-md">
              <h3
                className="text-2xl md:text-3xl font-bold text-[#FFFCF7] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                A Story That Bridges{" "}
                <span className="text-[#C9A84C]">Worlds</span>
              </h3>

              <p className="text-[#FFFCF7]/60 leading-relaxed mb-6 text-sm md:text-base">
                Follow a young girl from the banks of the Gurara River as she discovers
                the ancient songs that connect her to her heritage. This beautifully
                illustrated story weaves Nigerian folklore with modern literacy
                development, helping children build reading confidence while
                celebrating their cultural identity.
              </p>

              {/* Key outcomes */}
              <div className="space-y-3 mb-8">
                {[
                  "Strengthens phonemic awareness & fluency",
                  "Builds cultural pride and identity",
                  "Develops comprehension strategies",
                  "Aligned with Nigerian curriculum standards",
                ].map((outcome, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                    <span className="text-[#FFFCF7]/50 text-sm">{outcome}</span>
                  </motion.div>
                ))}
              </div>

              {/* Hover reveal keywords */}
              <motion.div
                className="flex flex-wrap gap-2"
                animate={{ opacity: isHovering ? 1 : 0.5 }}
                transition={{ duration: 0.4 }}
              >
                {revealKeywords.map((item, i) => (
                  <motion.div
                    key={item.word}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovering ? 1 : 0.4,
                      scale: isHovering ? 1 : 0.95,
                    }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <item.icon className="w-3 h-3" style={{ color: item.color }} />
                    <span className="text-xs font-medium text-[#C9A84C]">{item.word}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold tracking-wide rounded-full transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #A88426)",
                  color: "#FFFCF7",
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 30px rgba(201,168,76,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen className="w-4 h-4" />
                Request Sample Copy
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
