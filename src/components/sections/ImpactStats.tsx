import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useMotionValue, useMotionTemplate } from "framer-motion";
import { Users, School, TrendingUp, Clock, type LucideIcon } from "lucide-react";
import { ContainerScroll } from "../ui/container-scroll-animation";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}

const stats: StatItem[] = [
  { value: 500, suffix: "+", label: "Children Impacted", icon: Users },
  { value: 5, suffix: "+", label: "School Partnerships", icon: School },
  { value: 88, suffix: "%", label: "Reading Proficiency", icon: TrendingUp },
  { value: 12, suffix: " Weeks", label: "Average Intervention", icon: Clock },
];

function useCountUp(target: number, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [target, duration]
  );

  useEffect(() => {
    if (!shouldStart) return;
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldStart, animate]);

  return count;
}

function StatCard({ stat, shouldAnimate }: { stat: StatItem; shouldAnimate: boolean }) {
  const count = useCountUp(stat.value, 2000, shouldAnimate);
  const Icon = stat.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0px 20px 40px rgba(27,45,94,0.12)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group flex flex-col items-center justify-center text-center px-4 py-8 md:px-6 md:py-10 rounded-2xl h-full border-b-2 cursor-pointer transition-colors duration-300 hover:bg-white/90"
      style={{
        borderColor: "rgba(201,168,76,0.3)",
        background: "rgba(255,252,247,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full mb-4 md:mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: "#C9A84C" }} strokeWidth={2} />
      </div>

      <span
        className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#C9A84C",
        }}
      >
        {count}
        {stat.suffix}
      </span>

      <span
        className="mt-3 text-xs md:text-sm font-medium tracking-wide uppercase group-hover:text-[#1B2D5E] transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "rgba(27,45,94,0.7)",
          letterSpacing: "0.08em",
        }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function ImpactStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Interactive Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const titleComponent = (
    <div className="mb-4 md:mb-8 relative z-10">
      <span
        className="inline-block text-xs md:text-sm font-semibold tracking-widest uppercase mb-4"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "#C9A84C",
          letterSpacing: "0.15em",
        }}
      >
        Measurable Outcomes
      </span>
      <h2
        className="text-5xl md:text-6xl lg:text-7xl font-semibold"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#1B2D5E",
          lineHeight: 1.1,
        }}
      >
        Our Impact in <br />
        <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Numbers</span>
      </h2>
      <div
        className="mx-auto mt-6 w-16 h-0.5 rounded-full"
        style={{ backgroundColor: "#C9A84C" }}
      />
    </div>
  );

  return (
    <section
      className="relative overflow-hidden group"
      style={{
        backgroundColor: "#FFFFFF",
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 20% 40%, rgba(201,168,76,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 60%, rgba(46,74,147,0.03) 0%, transparent 55%)
        `,
      }}
    >
      <div className="relative z-10">
        <ContainerScroll titleComponent={titleComponent}>
          <div ref={sectionRef} className="h-full w-full flex items-center justify-center p-2">
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full h-full p-2 md:p-4"
            >
              {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} shouldAnimate={isInView} />
              ))}
            </motion.div>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}
