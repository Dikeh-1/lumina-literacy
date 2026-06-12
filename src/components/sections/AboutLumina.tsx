import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ABOUT_WORDS = [
  "LUMINA",
  "LITERACY",
  "EMPOWERING",
  "AFRICAN",
  "CHILDREN",
  "THROUGH",
  "READING"
];

export default function AboutLumina() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#FBF8F2" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span
              className="inline-block text-xs font-semibold mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#C9A84C",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Who We Are
            </span>
            
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1B2D5E",
                lineHeight: 1.1,
              }}
            >
              Lighting the path to a brighter future.
            </h2>
            
            <p
              className="text-base md:text-lg mb-8"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(27,45,94,0.7)",
                lineHeight: 1.8,
              }}
            >
              Lumina Literacy is dedicated to eradicating literacy barriers across Nigeria. We provide schools with culturally rich, tailored reading materials, empower teachers through specialized training, and build immersive reading environments that transform students into lifelong learners.
            </p>
          </motion.div>

          {/* Particle Text Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            <ParticleTextEffect words={ABOUT_WORDS} />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
