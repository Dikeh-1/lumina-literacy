import { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/heroes/HeroSection";
import Footer from "./components/Footer";
import { UnderMaintenanceModal } from "./components/ui/UnderMaintenanceModal";
import { CookieConsent } from "./components/ui/CookieConsent";
import { SchoolAdoptionModal } from "./components/ui/SchoolAdoptionModal";
import { StoryBridgesModal } from "./components/ui/StoryBridgesModal";
import { TeacherWorkshopModal } from "./components/ui/TeacherWorkshopModal";
import { PartnerFormModal } from "./components/ui/PartnerFormModal";
import { ScrollIndicator } from "./components/ui/ScrollIndicator";
import { LazySection } from "./components/ui/LazySection";

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
      <CookieConsent />
      <SchoolAdoptionModal />
      <StoryBridgesModal />
      <TeacherWorkshopModal />
      <PartnerFormModal />
      <ScrollIndicator />
      <Navbar />

      {/* Hero */}
      <div id="home">
        <HeroSection />
      </div>

      {/* Certification Badges Marquee */}
      <LazySection height="15vh">
        <Suspense fallback={<SectionLoader />}>
          <CertificationMarquee />
        </Suspense>
      </LazySection>

      {/* About Lumina */}
      <LazySection height="80vh">
        <Suspense fallback={<SectionLoader />}>
          <div id="about">
            <AboutLumina />
          </div>
        </Suspense>
      </LazySection>

      {/* Impact Statistics */}
      <LazySection height="40vh">
        <Suspense fallback={<SectionLoader />}>
          <div id="impact">
            <ImpactStats />
          </div>
        </Suspense>
      </LazySection>

      {/* StoryBridges+ Bento Grid */}
      <LazySection height="100vh">
        <Suspense fallback={<SectionLoader />}>
          <StoryBridges />
        </Suspense>
      </LazySection>

      {/* Literacy Crisis */}
      <LazySection height="100vh">
        <Suspense fallback={<SectionLoader />}>
          <div id="challenge">
            <LiteracyCrisis />
          </div>
        </Suspense>
      </LazySection>

      {/* Lightning Split - The Song of Gurara */}
      <LazySection height="80vh">
        <Suspense fallback={<SectionLoader />}>
          <LightningSplit />
        </Suspense>
      </LazySection>

      {/* Founder Showcase */}
      <LazySection height="80vh">
        <Suspense fallback={<SectionLoader />}>
          <FounderShowcase />
        </Suspense>
      </LazySection>

      {/* Pilot Impact Data */}
      <LazySection height="80vh">
        <Suspense fallback={<SectionLoader />}>
          <PilotImpact />
        </Suspense>
      </LazySection>

      {/* Programs / Pricing */}
      <LazySection height="120vh">
        <Suspense fallback={<SectionLoader />}>
          <div id="programs">
            <Programs />
          </div>
        </Suspense>
      </LazySection>

      {/* CSR Section */}
      <LazySection height="80vh">
        <Suspense fallback={<SectionLoader />}>
          <div id="resources">
            <CSRSection />
          </div>
        </Suspense>
      </LazySection>

      {/* Testimonials */}
      <LazySection height="60vh">
        <Suspense fallback={<SectionLoader />}>
          <Testimonials />
        </Suspense>
      </LazySection>

      {/* Footer */}
      <Footer />
    </div>
  );
}
