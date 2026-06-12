import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const credentials = [
  "M.Ed",
  "MA",
  "PGDE",
  "TRCN Licensed",
  "Google Certified Educator",
  "Microsoft Certified Educator",
  "Diana Award Judge 2026",
  "TEF Entrepreneur",
];

export default function FounderShowcase() {
  return (
    <section
      style={{ backgroundColor: "#FBF8F2" }}
      className="py-24 px-6 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold uppercase text-center mb-3"
          style={{
            color: "#C9A84C",
            letterSpacing: "0.3em",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Leadership
        </motion.p>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1B2D5E",
          }}
        >
          Meet the Founder
        </motion.h2>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE — Portrait Area */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[380px] mx-auto lg:mx-0"
          >
            <div
              className="relative rounded-2xl overflow-hidden p-4"
              style={{
                background: "linear-gradient(160deg, #1B2D5E 0%, #101B38 100%)",
                border: "1.5px solid rgba(201, 168, 76, 0.35)",
                boxShadow:
                  "0 0 60px rgba(201, 168, 76, 0.08), 0 25px 50px rgba(16, 27, 56, 0.25)",
              }}
            >
              {/* African Geometric Pattern Overlay */}
              <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                viewBox="0 0 400 500"
                style={{ opacity: 0.06 }}
              >
                <defs>
                  <pattern
                    id="africanPattern"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    {/* Concentric diamond */}
                    <polygon
                      points="30,5 55,30 30,55 5,30"
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1.2"
                    />
                    <polygon
                      points="30,14 46,30 30,46 14,30"
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="0.8"
                    />
                    {/* Corner accents */}
                    <circle cx="30" cy="30" r="2.5" fill="#C9A84C" />
                    <line
                      x1="30"
                      y1="0"
                      x2="30"
                      y2="5"
                      stroke="#C9A84C"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="30"
                      y1="55"
                      x2="30"
                      y2="60"
                      stroke="#C9A84C"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="0"
                      y1="30"
                      x2="5"
                      y2="30"
                      stroke="#C9A84C"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="55"
                      y1="30"
                      x2="60"
                      y2="30"
                      stroke="#C9A84C"
                      strokeWidth="0.8"
                    />
                    {/* Small triangles at corners */}
                    <polygon points="0,0 8,0 0,8" fill="#C9A84C" opacity="0.4" />
                    <polygon
                      points="60,0 52,0 60,8"
                      fill="#C9A84C"
                      opacity="0.4"
                    />
                    <polygon
                      points="0,60 8,60 0,52"
                      fill="#C9A84C"
                      opacity="0.4"
                    />
                    <polygon
                      points="60,60 52,60 60,52"
                      fill="#C9A84C"
                      opacity="0.4"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#africanPattern)"
                />
              </svg>

              {/* Founder Image */}
              <motion.img
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                src="https://res.cloudinary.com/dxvvzuu3n/image/upload/v1774778904/tales-and-treasures/r6ccdnycavj2xaxml88y.jpg"
                alt="Blessing Michael - Founder of Lumina Literacy"
                className="relative w-full h-auto rounded-xl shadow-md z-10"
              />

              {/* Decorative corner accents */}
              <div
                className="absolute top-4 left-4 w-10 h-10"
                style={{
                  borderTop: "2px solid rgba(201, 168, 76, 0.3)",
                  borderLeft: "2px solid rgba(201, 168, 76, 0.3)",
                }}
              />
              <div
                className="absolute top-4 right-4 w-10 h-10"
                style={{
                  borderTop: "2px solid rgba(201, 168, 76, 0.3)",
                  borderRight: "2px solid rgba(201, 168, 76, 0.3)",
                }}
              />
              <div
                className="absolute bottom-4 left-4 w-10 h-10"
                style={{
                  borderBottom: "2px solid rgba(201, 168, 76, 0.3)",
                  borderLeft: "2px solid rgba(201, 168, 76, 0.3)",
                }}
              />
              <div
                className="absolute bottom-4 right-4 w-10 h-10"
                style={{
                  borderBottom: "2px solid rgba(201, 168, 76, 0.3)",
                  borderRight: "2px solid rgba(201, 168, 76, 0.3)",
                }}
              />
            </div>
          </motion.div>

          {/* RIGHT SIDE — Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            {/* Name */}
            <h3
              className="text-3xl font-bold mb-1"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1B2D5E",
              }}
            >
              Blessing Michael
            </h3>

            {/* Title */}
            <p
              className="text-sm uppercase font-semibold mb-6"
              style={{
                color: "#C9A84C",
                letterSpacing: "0.15em",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Founder &amp; CEO
            </p>

            {/* Bio */}
            <p
              className="text-base leading-relaxed mb-8"
              style={{
                color: "rgba(27, 45, 94, 0.75)",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.8,
              }}
            >
              A passionate educator with over a decade of experience in literacy
              development, Blessing Michael founded Lumina Literacy Solutions to
              bridge the gap between quality education and cultural authenticity.
              Her vision: every Nigerian child deserves to see themselves
              reflected in the stories they read.
            </p>

            {/* Credentials */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.3 },
                },
              }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {credentials.map((credential) => (
                <motion.span
                  key={credential}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    border: "1px solid rgba(201, 168, 76, 0.2)",
                    backgroundColor: "rgba(201, 168, 76, 0.05)",
                    color: "rgba(27, 45, 94, 0.7)",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {credential}
                </motion.span>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative pl-6"
              style={{
                borderLeft: "3px solid rgba(201, 168, 76, 0.35)",
              }}
            >
              <Quote
                size={20}
                className="absolute -top-1 -left-3 bg-[#FBF8F2] p-0.5"
                style={{ color: "#C9A84C" }}
              />
              <p
                className="text-lg italic leading-relaxed"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#C9A84C",
                }}
              >
                &ldquo;Every child&rsquo;s story matters. When children read
                stories that reflect their world, they don&rsquo;t just learn to
                read — they learn to believe in themselves.&rdquo;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
