import { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollIndicator() {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down
        if (currentScrollY + windowHeight < documentHeight - 100) {
          setDirection("down");
        } else {
          setDirection("up"); // at absolute bottom, only up is possible
        }
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Scrolling up
        if (currentScrollY > 100) {
          setDirection("up");
        } else {
          setDirection("down"); // at absolute top, only down is possible
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial state based on position
    if (window.scrollY > 100) {
      setDirection("up");
    } else {
      setDirection("down");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (direction === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (direction === "down") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {direction && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={handleClick}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-[120] flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#E3C66D] text-[#101B38] shadow-[0_4px_20px_rgba(201,168,76,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border border-[#FFFCF7]/20"
          aria-label={direction === "up" ? "Scroll to top" : "Scroll to bottom"}
        >
          <motion.div
            animate={{ y: direction === "up" ? [0, -3, 0] : [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {direction === "up" ? <ArrowUp size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" /> : <ArrowDown size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
