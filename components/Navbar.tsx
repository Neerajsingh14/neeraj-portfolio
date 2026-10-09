"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Menu, X } from "lucide-react";
import { useSite } from "./SiteProvider";
import { lockScroll, scrollToId } from "@/lib/scroll";
import SocialLink from "./SocialLink";

export default function Navbar() {
  const { navLinks, profile, socials } = useSite();
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // pill hover par us link pe jaati hai, hatane par active section pe wapas
  const current = hovered ?? active;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      lockScroll(false);
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setTimeout(() => scrollToId(id), 200);
    } else {
      scrollToId(id);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed left-1/2 top-3 z-[70] w-[94%] max-w-[1160px] -translate-x-1/2 sm:top-4 sm:w-[92%]"
      >
        <nav className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-bg/70 py-3 pl-6 pr-3 backdrop-blur-xl">
          {/* code-style logo */}
          <a
            href="#top"
            onClick={(e) => go(e, "top")}
            className="font-mono text-lg font-bold tracking-tight"
          >
            <span className="text-accent">&lt;</span>
            {profile.shortName}
            <span className="text-accent">/&gt;</span>
          </a>

          {/* desktop links */}
          <ul
            onMouseLeave={() => setHovered(null)}
            className="relative hidden items-center gap-0.5 lg:flex"
          >
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  onMouseEnter={() => setHovered(l.id)}
                  onFocus={() => setHovered(l.id)}
                  onBlur={() => setHovered(null)}
                  className="relative block rounded-full px-3.5 py-2 text-[14px] xl:text-[15px]"
                >
                  {current === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/10"
                    />
                  )}
                  <span
                    className={`relative transition-colors ${
                      current === l.id ? "text-fg" : "text-muted"
                    }`}
                  >
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Let's talk: sirf desktop par */}
            <a
              href="#contact"
              onClick={(e) => go(e, "contact")}
              className="hidden rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-fg transition hover:scale-105 lg:inline-flex"
            >
              Let&apos;s talk
            </a>
            {/* mobile: sirf menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition active:scale-95 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile menu: links ek ke neeche ek (numbering, WhatsApp, Resume nahi) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              key="panel"
              role="dialog"
              aria-label="Menu"
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top right" }}
              className="fixed right-3 top-[78px] z-[60] max-h-[calc(100dvh-94px)] w-[min(88vw,300px)] overflow-y-auto rounded-3xl border border-white/10 bg-surface/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl sm:right-4 sm:top-[86px] lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.03 }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                      active === l.id
                        ? "bg-accent/15 text-accent"
                        : "text-muted active:bg-white/10"
                    }`}
                  >
                    {l.label}
                    <ChevronRight size={16} className="opacity-50" />
                  </motion.a>
                ))}
              </nav>

              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                {socials
                  .filter((s) => s.key !== "whatsapp")
                  .map((s) => (
                    <SocialLink
                      key={s.key}
                      social={s}
                      iconSize={16}
                      box="h-9 w-9"
                    />
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}