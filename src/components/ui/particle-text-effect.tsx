import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ParticleTextEffectProps {
  words?: string[]
}

const DEFAULT_WORDS = ["HELLO", "21st.dev", "ParticleTextEffect", "BY", "KAINXU"]

export function ParticleTextEffect({ words = DEFAULT_WORDS }: ParticleTextEffectProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 3500) // 3.5 seconds per word
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] md:min-h-[500px] bg-[#101B38] p-8 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101B38] via-[#101B38] to-[#0a1124] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C9A84C] rounded-full blur-[120px] opacity-15 z-0" />

      <div className="relative z-10 w-full flex-1 flex items-center justify-center perspective-1000 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -30, filter: "blur(12px)", scale: 1.05 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Beautiful custom ease
            className="text-center w-full px-4"
          >
            <h3 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #E3C66D 60%, #C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 10px 20px rgba(201, 168, 76, 0.2))",
                wordBreak: "break-word",
              }}
            >
              {words[index]}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-auto text-center max-w-md pt-8">
        <p className="mb-2 uppercase tracking-widest text-[#E3C66D] font-bold text-xs">Lumina Literacy Core</p>
        <p className="text-white/40 text-xs tracking-wide">
          Lighting the path to a brighter future
        </p>
      </div>
    </div>
  )
}
