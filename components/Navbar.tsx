"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { navLinks, profile, socials, whatsappUrl } from "@/lib/portfolio";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { socialIcons, WhatsappIcon } from "./icons";

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // active section highlight
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

  // mobile menu: scroll lock, Escape, resize
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
        className="fixed left-1/2 top-3 z-[70] w-[94%] max-w-7xl -translate-x-1/2 sm:top-4 sm:w-[92%]"
      >
        <nav className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-bg/70 px-3 py-2 backdrop-blur-xl sm:px-4">
          {/* name logo */}
          <a
            href="#top"
            onClick={(e) => go(e, "top")}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 font-display text-base font-bold text-accent-fg">
              N
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              {profile.shortName}
              <span className="text-accent">.</span>
            </span>
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  className={`rounded-full px-2.5 py-1.5 text-[13px] transition xl:px-3.5 xl:text-sm ${
                    active === l.id
                      ? "bg-white/10 text-fg"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => go(e, "contact")}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:scale-105 sm:px-5"
            >
              Let&apos;s talk
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition active:scale-95 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile: chhota dropdown card (full sidebar nahi) */}
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
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top right" }}
              className="fixed right-3 top-[76px] z-[60] max-h-[calc(100dvh-96px)] w-[min(88vw,340px)] overflow-y-auto rounded-3xl border border-white/10 bg-surface/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl sm:right-4 sm:top-[84px] lg:hidden"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map((l, i) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className={`rounded-xl px-3 py-2.5 text-sm transition ${
                      i === navLinks.length - 1 ? "col-span-2 text-center" : ""
                    } ${
                      active === l.id
                        ? "bg-accent/15 text-accent"
                        : "bg-white/[0.03] text-muted active:bg-white/10"
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#04210f] transition active:scale-95"
              >
                <WhatsappIcon size={18} />
                Chat on WhatsApp
              </a>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex gap-2">
                  {socials
                    .filter((s) => s.key !== "whatsapp")
                    .map((s) => {
                      const Icon = socialIcons[s.key];
                      return (
                        <a
                          key={s.key}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.name}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-accent hover:text-accent"
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                </div>
                <a
                  href={profile.resume}
                  download
                  className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
                >
                  <Download size={15} />
                  Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}