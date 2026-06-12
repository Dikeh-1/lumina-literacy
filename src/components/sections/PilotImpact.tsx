import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

const RADIUS = 80;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEW_BOX_SIZE = (RADIUS + STROKE_WIDTH) * 2;
const CENTER = RADIUS + STROKE_WIDTH;

interface CircularChartProps {
  percentage: number;
  label: string;
  isGold?: boolean;
  isInView: boolean;
}

function CircularChart({ percentage, label, isGold, isInView }: CircularChartProps) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        setAnimatedOffset(CIRCUMFERENCE * (1 - percentage / 100));
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setAnimatedOffset(CIRCUMFERENCE);
    }
  }, [isInView, percentage]);

  const gradientId = isGold ? "goldGradient" : "navyGradient";

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay: isGold ? 0.3 : 0 }}
    >
      <div className="relative">
        <svg
          width={VIEW_BOX_SIZE}
          height={VIEW_BOX_SIZE}
          viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
          className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 drop-shadow-lg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {isGold ? (
                <>
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#E3C66D" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="rgba(27,45,94,0.3)" />
                  <stop offset="100%" stopColor="rgba(46,74,147,0.3)" />
                </>
              )}
            </linearGradient>
            {isGold && (
              <filter id="goldGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Background track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={isGold ? "rgba(201,168,76,0.12)" : "rgba(27,45,94,0.08)"}
            strokeWidth={STROKE_WIDTH}
          />

          {/* Progress arc */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animatedOffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{
              transition: "stroke-dashoffset 2s ease-out",
            }}
            filter={isGold ? "url(#goldGlow)" : undefined}
          />
        </svg>

        {/* Center percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: isGold ? "#C9A84C" : "#1B2D5E",
            }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className="text-sm md:text-base font-medium tracking-wide uppercase"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: isGold ? "#A88426" : "rgba(27,45,94,0.55)",
            letterSpacing: "0.15em",
          }}
        >
          {label}
        </p>
        <p
          className="text-xs mt-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "rgba(27,45,94,0.4)",
          }}
        >
          Reading Proficiency
        </p>
      </div>
    </motion.div>
  );
}

const metrics = [
  { value: "12", unit: "Weeks", sublabel: "Duration" },
  { value: "500+", unit: "", sublabel: "Students" },
  { value: "5", unit: "", sublabel: "Schools" },
  { value: "38%", unit: "", sublabel: "Improvement" },
];

export default function PilotImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Label */}
          <span
            className="inline-block text-xs font-semibold mb-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#C9A84C",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            PILOT RESULTS
          </span>

          {/* Heading */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#1B2D5E",
              lineHeight: 1.1,
            }}
          >
            Measurable Transformation
          </h2>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "rgba(27,45,94,0.6)",
              lineHeight: 1.7,
            }}
          >
            12-week pilot program results across partner schools
          </p>
        </motion.div>

        {/* Circular Charts */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 lg:gap-10 mb-20">
          {/* BEFORE Chart */}
          <CircularChart
            percentage={50}
            label="Before Intervention"
            isInView={isInView}
          />

          {/* Connector Arrow */}
          <motion.div
            className="flex flex-col items-center gap-2 py-4 md:py-0"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm"
              style={{
                backgroundColor: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <TrendingUp
                size={16}
                style={{ color: "#C9A84C" }}
                strokeWidth={2.5}
              />
              <span
                className="text-sm font-bold"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#A88426",
                  letterSpacing: "0.05em",
                }}
              >
                +38%
              </span>
            </div>

            <div className="hidden md:flex items-center">
              <div
                className="w-8 h-px"
                style={{ backgroundColor: "rgba(201,168,76,0.3)" }}
              />
              <ArrowRight
                size={18}
                style={{ color: "#C9A84C" }}
                strokeWidth={2}
              />
            </div>

            {/* Vertical arrow for mobile */}
            <div className="flex md:hidden flex-col items-center">
              <div
                className="w-px h-6"
                style={{ backgroundColor: "rgba(201,168,76,0.3)" }}
              />
              <ArrowRight
                size={18}
                style={{ color: "#C9A84C", transform: "rotate(90deg)" }}
                strokeWidth={2}
              />
            </div>
          </motion.div>

          {/* AFTER Chart */}
          <CircularChart
            percentage={88}
            label="After Intervention"
            isGold
            isInView={isInView}
          />
        </div>

        {/* Key Metrics Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.sublabel}
              className="text-center py-6 px-4 rounded-2xl"
              style={{
                backgroundColor: "#FFFCF7",
                border: "1px solid rgba(27,45,94,0.06)",
                boxShadow: "0 1px 3px rgba(27,45,94,0.04)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 1.3 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -3,
                boxShadow: "0 8px 24px rgba(27,45,94,0.08)",
                transition: { duration: 0.25 },
              }}
            >
              <span
                className="block text-3xl md:text-4xl font-semibold mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1B2D5E",
                }}
              >
                {metric.value}
                {metric.unit && (
                  <span className="text-xl md:text-2xl ml-0.5">
                    {metric.unit}
                  </span>
                )}
              </span>
              <span
                className="text-xs font-medium uppercase"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(27,45,94,0.45)",
                  letterSpacing: "0.15em",
                }}
              >
                {metric.sublabel}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
        >
          <div
            className="h-px w-24"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
