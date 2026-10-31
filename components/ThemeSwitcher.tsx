"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";

const KEY = "portfolio-theme";

type Opt = { id: string; name: string; bg: string; a: string };

// Theme ke rang badalne ho to do jagah badlo: yahan aur app/globals.css ke "theme switcher" block me
const FIXED: Opt[] = [
  { id: "emerald", name: "Emerald & Lime", bg: "#07130f", a: "#34d399" },
  { id: "indigo", name: "Indigo & Sky", bg: "#0a0d1f", a: "#818cf8" },
  { id: "ocean", name: "Ocean Blue", bg: "#09121f", a: "#4da3ff" },
];
const IDS = FIXED.map((t) => t.id);

// "Default" ke rang site ke :root se padhe jate hain (theme hata kar, turant wapas laga kar)
function readDefaults() {
  const root = document.documentElement;
  const cur = root.getAttribute("data-theme");
  root.removeAttribute("data-theme");
  const cs = getComputedStyle(root);
  const get = (v: string, d: string) => cs.getPropertyValue(v).trim() || d;
  const out = { bg: get("--bg", "#0b0b0c"), a: get("--accent", "#6ee0b8") };
  if (cur) root.setAttribute("data-theme", cur);
  return out;
}

// gol swatch: aadha dark (background), aadha accent
function Swatch({ bg, a }: { bg: string; a: string }) {
  return (
    <span
      className="h-8 w-8 shrink-0 rounded-full border border-white/25"
      style={{ background: `linear-gradient(90deg, ${bg} 50%, ${a} 50%)` }}
    />
  );
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("default");
  const [def, setDef] = useState({ bg: "#0b0b0c", a: "#6ee0b8" });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDef(readDefaults());

    let saved = document.documentElement.getAttribute("data-theme");
    if (!saved) {
      try {
        const s = localStorage.getItem(KEY);
        if (s && IDS.includes(s)) {
          saved = s;
          document.documentElement.setAttribute("data-theme", s);
        }
      } catch {
        /* storage band hai */
      }
    }
    if (saved && IDS.includes(saved)) setCurrent(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const apply = (id: string) => {
    const root = document.documentElement;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-anim");
      setTimeout(() => root.classList.remove("theme-anim"), 500);
    }

    if (id === "default") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", id);

    try {
      localStorage.setItem(KEY, id);
    } catch {
      /* storage band hai */
    }
    setCurrent(id);
    setOpen(false);
  };

  const options: Opt[] = [{ id: "default", name: "Default", ...def }, ...FIXED];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change colour theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-surface text-accent shadow-lg shadow-black/40 transition hover:scale-105 active:scale-95 ${
          open ? "border-accent" : "border-accent/50 hover:border-accent"
        }`}
      >
        <Palette size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Colour theme"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-full right-0 z-10 mb-3 w-[17rem] rounded-2xl border border-white/10 bg-surface px-4 pb-3 pt-4 shadow-2xl shadow-black/60"
          >
            <p className="pb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              Colour theme
            </p>

            <div className="space-y-0.5">
              {options.map((o) => {
                const on = o.id === current;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    onClick={() => apply(o.id)}
                    className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3.5 rounded-lg px-2 py-2.5 text-left transition hover:bg-white/5"
                  >
                    <Swatch bg={o.bg} a={o.a} />
                    <span className="min-w-0 flex-1 truncate text-[15px] text-fg">
                      {o.name}
                    </span>
                    {on && <Check size={18} className="shrink-0 text-accent" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}