import { motion } from "framer-motion";
import {
  GraduationCap,
  Monitor,
  Award,
  Shield,
  Building2,
  FileCheck,
  Rocket,
  Trophy,
  Star,
} from "lucide-react";

const badges = [
  { label: "Google Certified Educator", icon: GraduationCap },
  { label: "Microsoft Certified Educator", icon: Monitor },
  { label: "TRCN Licensed", icon: Award },
  { label: "TRCN Compliant", icon: Shield },
  { label: "CAC Incorporated", icon: Building2 },
  { label: "TIN Registered", icon: FileCheck },
  { label: "TEF 2026 Empowered Entrepreneur", icon: Rocket },
  { label: "TEF 2026 Empowered Enterprise", icon: Trophy },
  { label: "Diana Award Judge 2026", icon: Star },
];

const row1 = badges.slice(0, 5);
const row2 = badges.slice(5);

export default function CertificationMarquee() {
  return (
    <section className="py-20 overflow-hidden" style={{ backgroundColor: "#FBF8F2" }}>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-row:hover .marquee-track {
          animation-play-state: paused !important;
        }
        .cert-badge {
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .cert-badge:hover {
          box-shadow: 0 0 24px rgba(201, 168, 76, 0.25), 0 4px 16px rgba(201, 168, 76, 0.12);
          border-color: rgba(201, 168, 76, 0.5);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#C9A84C", fontFamily: "'Inter', sans-serif" }}
          >
            Trusted & Verified
          </span>
        </motion.div>
      </div>

      {/* Row 1 — scrolls left */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="marquee-row mb-5"
      >
        <div
          className="marquee-track flex w-max gap-5"
          style={{ animation: "marquee 35s linear infinite" }}
        >
          {[...row1, ...row1].map((badge, i) => (
            <BadgeCard key={`r1-${i}`} icon={badge.icon} label={badge.label} />
          ))}
        </div>
      </motion.div>

      {/* Row 2 — scrolls right */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="marquee-row"
      >
        <div
          className="marquee-track flex w-max gap-5"
          style={{ animation: "marquee-reverse 40s linear infinite" }}
        >
          {[...row2, ...row2].map((badge, i) => (
            <BadgeCard key={`r2-${i}`} icon={badge.icon} label={badge.label} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function BadgeCard({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div
      className="cert-badge flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-sm bg-white/80 cursor-default select-none whitespace-nowrap"
      style={{
        border: "1px solid rgba(201, 168, 76, 0.2)",
        minWidth: "max-content",
      }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{ backgroundColor: "rgba(201, 168, 76, 0.1)" }}
      >
        <Icon size={18} strokeWidth={1.8} style={{ color: "#C9A84C" }} />
      </div>
      <span
        className="text-sm font-medium"
        style={{ color: "#1B2D5E", fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}
