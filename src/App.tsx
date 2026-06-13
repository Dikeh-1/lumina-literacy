import { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/heroes/HeroSection";
import Footer from "./components/Footer";
import { UnderMaintenanceModal } from "./components/ui/UnderMaintenanceModal";

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
    <div className="flex items-center justify-center py-24">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C9A84C" }} />
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C9A84C", animationDelay: "0.2s" }} />
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C9A84C", animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}

function PageLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading: ramp to 90% quickly, then finish on window load
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 15 + 5;
      });
    }, 80);

    const finish = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(onDone, 400);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }
    // Safety fallback
    const fallback = setTimeout(finish, 2500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", finish);
      clearTimeout(fallback);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "#101B38" }}
    >
      {/* Logo */}
      <div className="mb-8">
        <img
          src="https://res.cloudinary.com/dxvvzuu3n/image/upload/v1781340134/loooooo_pbkjvi.png"
          alt="Lumina Literacy Solutions"
          className="h-16 w-auto"
        />
      </div>

      {/* Loading bar */}
      <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: "linear-gradient(90deg, #C9A84C, #E3C66D)",
          }}
        />
      </div>

      <p className="mt-4 text-white/40 text-xs tracking-widest uppercase">
        Loading...
      </p>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#FBF8F2" }}>
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}

      <UnderMaintenanceModal />
      <Navbar />

      {/* Hero */}
      <div id="home">
        <HeroSection />
      </div>

      {/* Certification Badges Marquee */}
      <Suspense fallback={<SectionLoader />}>
        <CertificationMarquee />
      </Suspense>

      {/* About Lumina */}
      <Suspense fallback={<SectionLoader />}>
        <div id="about">
          <AboutLumina />
        </div>
      </Suspense>

      {/* Impact Statistics */}
      <Suspense fallback={<SectionLoader />}>
        <div id="impact">
          <ImpactStats />
        </div>
      </Suspense>

      {/* StoryBridges+ Bento Grid */}
      <Suspense fallback={<SectionLoader />}>
        <StoryBridges />
      </Suspense>

      {/* Literacy Crisis */}
      <Suspense fallback={<SectionLoader />}>
        <div id="challenge">
          <LiteracyCrisis />
        </div>
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
        <div id="programs">
          <Programs />
        </div>
      </Suspense>

      {/* CSR Section */}
      <Suspense fallback={<SectionLoader />}>
        <div id="resources">
          <CSRSection />
        </div>
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
