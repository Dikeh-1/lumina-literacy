import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, GraduationCap, BarChart3 } from "lucide-react";
import { LampContainer } from "../ui/lamp";

const features = [
  {
    icon: BookOpen,
    title: "Culturally Authentic Publishing",
    description: "Our flagship library features hundreds of beautifully illustrated, culturally authentic storybooks. Children finally see themselves in the stories they read.",
  },
  {
    icon: ClipboardCheck,
    title: "Data-Driven Reading Audits",
    description: "Baseline assessments for entire schools, instantly highlighting gaps in phonics, fluency, and comprehension.",
  },
  {
    icon: GraduationCap,
    title: "Teacher Professional Development",
    description: "Empowering educators with culturally responsive pedagogy and modern storytelling techniques to create dynamic classrooms.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Assessment",
    description: "Digital tools that seamlessly track individual student growth and adjust interventions in real time for maximum impact.",
  },
];

export default function StoryBridges() {
  return (
    <section id="platform">
      <LampContainer
        badge={
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#C9A84C]">
            OUR PLATFORM
          </span>
        }
      >
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="bg-gradient-to-b from-[#FFFCF7] to-[#E3C66D]/80 py-2 bg-clip-text text-center text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-transparent"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          StoryBridges<span className="text-[#C9A84C]">+</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="text-lg md:text-xl text-[#FFFCF7]/70 max-w-2xl text-center font-light leading-relaxed mt-6 mb-16"
        >
          A comprehensive literacy ecosystem powered by African stories. Discover how our end-to-end platform transforms learning.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4"
        >
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-colors duration-300 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-6 border border-[#C9A84C]/20 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
                <feature.icon className="w-6 h-6 text-[#C9A84C]" />
              </div>
              <h3 className="text-xl font-bold text-[#FFFCF7] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {feature.title}
              </h3>
              <p className="text-sm text-[#FFFCF7]/50 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </LampContainer>
    </section>
  );
}
