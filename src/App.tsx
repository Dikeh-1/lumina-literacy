import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/heroes/HeroSection";
import Footer from "./components/Footer";

// Lazy load sections for performance
const CertificationMarquee = lazy(() => import("./components/sections/CertificationMarquee"));
const AboutLumina = lazy(() => import("./components/sections/AboutLumina"));
const ImpactStats = lazy(() => import("./components/sections/ImpactStats"));
const StoryBridges = lazy(() => import("./components/sections/StoryBridges"));
const LiteracyCrisis = lazy(() => import("./components/sections/LiteracyCrisis"));
const LightningSplit = lazy(() => import("./components/sections/LightningSplit"));
const FounderShowcase = lazy(() => import("./components/sections/FounderShowcase"));
const PilotImpact = lazy(() => import("./components/sections/PilotImpact"));
const Programs = lazy(() => import("./components/sections/Programs"));
const CSRSection = lazy(() => import("./components/sections/CSRSection"));
const Testimonials = lazy(() => import("./components/sections/Testimonials"));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#C9A84C" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#C9A84C", animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#C9A84C", animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FBF8F2" }}>
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Section: Shader Background + Spline Scene + Content */}
      <HeroSection />

      {/* Certification Badges Marquee */}
      <Suspense fallback={<SectionLoader />}>
        <CertificationMarquee />
      </Suspense>

      {/* About Lumina */}
      <Suspense fallback={<SectionLoader />}>
        <AboutLumina />
      </Suspense>

      {/* Impact Statistics */}
      <Suspense fallback={<SectionLoader />}>
        <ImpactStats />
      </Suspense>

      {/* StoryBridges+ Bento Grid */}
      <Suspense fallback={<SectionLoader />}>
        <StoryBridges />
      </Suspense>

      {/* Literacy Crisis - Scroll Storytelling */}
      <Suspense fallback={<SectionLoader />}>
        <LiteracyCrisis />
      </Suspense>

      {/* Lightning Split - The Song of Gurara */}
      <Suspense fallback={<SectionLoader />}>
        <LightningSplit />
      </Suspense>

      {/* Founder Showcase */}
      <Suspense fallback={<SectionLoader />}>
        <FounderShowcase />
      </Suspense>

      {/* Pilot Impact Data */}
      <Suspense fallback={<SectionLoader />}>
        <PilotImpact />
      </Suspense>

      {/* Programs / Pricing */}
      <Suspense fallback={<SectionLoader />}>
        <Programs />
      </Suspense>

      {/* CSR Section */}
      <Suspense fallback={<SectionLoader />}>
        <CSRSection />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
