import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "The StoryBridges program transformed our reading outcomes. Children are now eager to read because they see themselves in the stories.",
    name: "Mrs. Adaeze Okafor",
    role: "Head Teacher, Bright Future Academy",
  },
  {
    quote:
      "Finally, a literacy intervention that understands our cultural context. The results speak for themselves.",
    name: "Mr. Emeka Nwosu",
    role: "Education Director, Premier Schools Group",
  },
  {
    quote:
      "Our students\u2019 reading proficiency jumped by 38% in just 12 weeks. The impact has been remarkable.",
    name: "Mrs. Fatima Ibrahim",
    role: "Principal, Al-Noor International School",
  },
  {
    quote:
      "Lumina does not just provide books \u2014 they provide a complete ecosystem for literacy development.",
    name: "Dr. Chioma Eze",
    role: "Education Consultant",
  },
  {
    quote:
      "The teacher training component elevated our entire literacy curriculum. Our teachers are more confident and effective.",
    name: "Mr. David Adeleke",
    role: "School Director, Heritage Academy",
  },
  {
    quote:
      "Every Nigerian child deserves culturally authentic stories. Lumina is making this a reality.",
    name: "Mrs. Ngozi Obi",
    role: "Parent & Education Advocate",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-2xl border p-6"
      style={{
        minWidth: 350,
        maxWidth: 400,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderColor: "rgba(201, 168, 76, 0.1)",
      }}
    >
      {/* Stars – top right */}
      <div className="absolute right-6 top-6 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4"
            fill="#C9A84C"
            style={{ color: "#C9A84C" }}
          />
        ))}
      </div>

      {/* Gold quote mark */}
      <span
        className="block text-5xl font-bold leading-none select-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#C9A84C",
        }}
      >
        &ldquo;
      </span>

      {/* Quote */}
      <p
        className="mt-2 text-base italic leading-relaxed"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "rgba(27, 45, 94, 0.7)",
        }}
      >
        {testimonial.quote}
      </p>

      {/* Author */}
      <div className="mt-6">
        <p
          className="text-sm font-semibold"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#1B2D5E",
          }}
        >
          {testimonial.name}
        </p>
        <p
          className="mt-0.5 text-sm"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "rgba(27, 45, 94, 0.5)",
          }}
        >
          {testimonial.role}
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation: marquee 45s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden py-24"
        style={{ backgroundColor: "#FBF8F2" }}
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center text-xs font-semibold uppercase tracking-[0.25em]"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#C9A84C",
            }}
          >
            Testimonials
          </motion.p>

          {/* Section heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-center text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#1B2D5E",
            }}
          >
            What Educators Say
          </motion.h2>
        </div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14"
        >
          {/* Fade masks on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
            style={{
              background:
                "linear-gradient(to right, #FBF8F2, transparent)",
            }}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
            style={{
              background:
                "linear-gradient(to left, #FBF8F2, transparent)",
            }}
          />

          <div className="marquee-track flex gap-6 w-max">
            {doubled.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
