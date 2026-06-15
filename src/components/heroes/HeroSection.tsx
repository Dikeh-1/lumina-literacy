import AnimatedShaderHero from "../ui/animated-shader-hero";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <AnimatedShaderHero
        trustBadge={{
          text: "Africa's Premier Literacy Tech",
          icons: [
            <BookOpen size={14} />,
            <GraduationCap size={14} />
          ],
        }}
        headline={{
          line1: "Where African Stories",
          line2: "Build Brilliant Minds",
        }}
        subtitle="Empowering educators with culturally immersive, technology-driven literacy interventions designed specifically for the African child."
        buttons={{
          primary: {
            text: "Partner With Us",
            onClick: () => {
              window.dispatchEvent(new CustomEvent('show-contact-form'));
            },
          },
          secondary: {
            text: "Explore Our Impact",
            onClick: () => {
              document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" });
            },
          },
        }}
      />
    </section>
  );
}
