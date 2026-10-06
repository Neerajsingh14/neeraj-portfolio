"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { whatsappUrl } from "@/lib/portfolio";
import { scrollToId } from "@/lib/scroll";
import { WhatsappIcon } from "./icons";

const R = 22;
const C = 2 * Math.PI * R;

// Right side stack: upar Back-to-top (scroll ke baad), neeche WhatsApp (mobile/tablet)
export default function FloatingActions() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setShow(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-center gap-3 sm:right-6"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {show && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scrollToId("top")}
            aria-label="Back to top"
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface/95 shadow-xl shadow-accent/20 backdrop-blur-md sm:h-14 sm:w-14"
          >
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 52 52">
              <defs>
                <linearGradient id="btt-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" style={{ stopColor: "var(--accent)" }} />
                  <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
                </linearGradient>
              </defs>
              <circle
                cx="26"
                cy="26"
                r={R}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <circle
                cx="26"
                cy="26"
                r={R}
                fill="none"
                stroke="url(#btt-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.15s linear" }}
              />
            </svg>
            <ArrowUp size={22} className="relative text-accent" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* desktop (xl) pe left rail me WhatsApp hai, isliye yahan hide */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[#04210f] shadow-lg shadow-[#25D366]/30 sm:h-14 sm:w-14 xl:hidden"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30" />
        <WhatsappIcon size={26} className="relative" />
      </motion.a>
    </div>
  );
}