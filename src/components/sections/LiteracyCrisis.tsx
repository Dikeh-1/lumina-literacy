import { motion } from "framer-motion";
import { BookX, Globe, School } from "lucide-react";

const stats = [
  {
    icon: <BookX className="w-8 h-8 text-[#D96C4A]" />,
    number: "70%",
    description: "of Nigerian children struggle with grade-level reading.",
  },
  {
    icon: <Globe className="w-8 h-8 text-[#2E4A93]" />,
    number: "90%",
    description: "of classroom books are culturally foreign, alienating young minds.",
  },
  {
    icon: <School className="w-8 h-8 text-[#C9A84C]" />,
    number: "800+",
    description: "private schools in Abuja urgently need culturally relevant content.",
  },
];

export default function LiteracyCrisis() {
  return (
    <section className="relative py-24 md:py-32 bg-[#FBF8F2] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Area */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="uppercase tracking-widest text-xs font-semibold text-[#D96C4A] mb-4"
          >
            The Challenge
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#101B38] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Literacy Crisis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#101B38]/70"
          >
            Across Africa, a silent emergency is unfolding. Millions of children are falling behind not because they lack potential, but because the resources they use do not reflect their reality.
          </motion.p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-[#101B38]/5 hover:shadow-xl hover:border-[#C9A84C]/30 transition-all duration-300"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/0 to-transparent group-hover:via-[#C9A84C] transition-all duration-500 rounded-t-full" />
              
              <div className="w-14 h-14 rounded-xl bg-[#FBF8F2] flex items-center justify-center mb-8 border border-[#101B38]/5 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              <div 
                className="text-5xl md:text-6xl font-bold text-[#101B38] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat.number}
              </div>
              
              <p className="text-[#101B38]/70 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p 
            className="text-2xl md:text-3xl text-[#2E4A93] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Lumina exists to change this.
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}
