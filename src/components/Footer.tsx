import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Globe,
  Camera,
  Link2,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const quickLinks = [
  {
    title: "Programs",
    links: [
      { label: "School Adoption", href: "#programs" },
      { label: "StoryBridges+ Kit", href: "#programs" },
      { label: "Teacher Workshops", href: "#programs" },
      { label: "Reading Audits", href: "#programs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "The Song of Gurara", href: "https://wa.me/2348130309009?text=Hello%20Lumina%20Literacy,%20I%20would%20like%20to%20request%20a%20sample%20copy%20for%20Song%20of%20Gurara" },
      { label: "Impact Reports", href: "#impact" },
      { label: "Research & Insights", href: "#challenge" },
      { label: "Blog", action: "maintenance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" }, 
      { label: "Our Team", action: "maintenance" }, 
      { label: "Careers", action: "maintenance" }, 
      { label: "Press", action: "maintenance" }
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", action: "maintenance" }, 
      { label: "Terms of Service", action: "maintenance" }, 
      { label: "Cookie Policy", action: "maintenance" }
    ],
  },
];

const socialLinks = [
  { icon: Globe, label: "Tales & Treasures", href: "https://talesandtreasures.com.ng", target: "_blank" },
  { icon: MessageCircle, label: "Twitter/X", action: "maintenance" },
  { icon: Camera, label: "Instagram", action: "maintenance" },
  { icon: Link2, label: "LinkedIn", action: "maintenance" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative bg-[#101B38] overflow-hidden" id="contact">
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#C9A84C]/3 blur-[150px]" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-[#2E4A93]/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-8">
        {/* Top Section: Logo + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-white/[0.06]">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#101B38] inline-block p-2 rounded-xl mb-6">
              <img
                src="https://res.cloudinary.com/dxvvzuu3n/image/upload/v1781340134/loooooo_pbkjvi.png"
                alt="Lumina Literacy Solutions"
                className="h-16 w-auto rounded-lg"
              />
            </div>
            <p className="text-[#FFFCF7]/50 max-w-md leading-relaxed text-sm">
              Where African Stories Build Brilliant Minds. We help schools,
              educators and families transform literacy outcomes through
              culturally authentic African stories and evidence-based reading
              interventions.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-3 text-[#FFFCF7]/40 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A84C]/60" />
                <span>Abuja, Nigeria</span>
              </div>
              <a href="mailto:hello@luminaliteracy.com" className="flex items-center gap-3 text-[#FFFCF7]/40 text-sm hover:text-[#C9A84C] transition-colors duration-300">
                <Mail className="w-4 h-4 text-[#C9A84C]/60" />
                <span>hello@luminaliteracy.com</span>
              </a>
              <a href="tel:+2348130309009" className="flex items-center gap-3 text-[#FFFCF7]/40 text-sm hover:text-[#C9A84C] transition-colors duration-300">
                <Phone className="w-4 h-4 text-[#C9A84C]/60" />
                <span>(+234) 8130309009</span>
              </a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h3
              className="text-2xl font-bold text-[#FFFCF7] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Stay Illuminated
            </h3>
            <p className="text-[#FFFCF7]/40 text-sm mb-6">
              Get updates on new publications, impact stories, and literacy
              insights delivered to your inbox.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                try {
                  // Connect to tales & treasures newsletter backend
                  await fetch('https://talesandtreasures.com.ng/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  });
                } catch (error) {
                  console.error(error);
                }
                alert("Thank you for subscribing!");
                setEmail("");
              }}
              className="flex gap-3"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFFCF7]/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#FFFCF7] text-sm placeholder:text-[#FFFCF7]/20 focus:outline-none focus:border-[#C9A84C]/30 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="group flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #A88426)",
                  color: "#FFFCF7",
                }}
              >
                <span className="hidden sm:inline">Subscribe</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {quickLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C]/70 mb-4">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.action === "maintenance" ? (
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('show-maintenance'))}
                        className="text-sm text-[#FFFCF7]/40 hover:text-[#C9A84C] transition-colors duration-300 text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href?.startsWith('http') ? "_blank" : undefined}
                        className="text-sm text-[#FFFCF7]/40 hover:text-[#C9A84C] transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.06]">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              social.action === "maintenance" ? (
                <button
                  key={social.label}
                  onClick={() => window.dispatchEvent(new CustomEvent('show-maintenance'))}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-[#FFFCF7]/30 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ) : (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.target}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-[#FFFCF7]/30 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              )
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-[#FFFCF7]/25">
            © {new Date().getFullYear()} Lumina Literacy Solutions Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
