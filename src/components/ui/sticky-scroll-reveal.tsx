"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    cardsBreakpoints.forEach((breakpoint, index) => {
      if (latest > breakpoint - 0.2 && latest <= breakpoint + 0.2) {
        setActiveCard(index);
      }
    });
  });

  return (
    <div className="flex justify-center w-full max-w-6xl mx-auto gap-10 lg:gap-20 relative px-4 md:px-8">
      {/* Left side: Sticky content */}
      <motion.div
        className="w-full lg:w-1/2 relative pb-32"
        ref={ref}
      >
        {content.map((item, index) => (
          <div key={item.title + index} className="min-h-[60vh] flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeCard === index ? 1 : 0.3,
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: activeCard === index ? "#FFFCF7" : "rgba(255, 252, 247, 0.4)",
                lineHeight: 1.1,
              }}
            >
              {item.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeCard === index ? 1 : 0.3,
              }}
              className="text-lg md:text-xl leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: activeCard === index ? "rgba(255, 252, 247, 0.8)" : "rgba(255, 252, 247, 0.4)",
              }}
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </motion.div>

      {/* Right side: Sticky Visual */}
      <div className="hidden lg:flex w-1/2 sticky top-0 h-screen items-center justify-center">
        <motion.div
          animate={{
            y: activeCard * -100 + "%",
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="w-full h-[500px] rounded-[30px] overflow-hidden"
          style={{
            border: "1px solid rgba(201, 168, 76, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {content.map((item, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center p-8"
              style={{
                background: `radial-gradient(circle at center, rgba(201, 168, 76, 0.08) 0%, transparent 70%)`
              }}
            >
              {item.content}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
