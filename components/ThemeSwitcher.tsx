"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";

const KEY = "portfolio-theme";

type Opt = { id: string; name: string; bg: string; a: string; b: string };

// Naye theme ke rang yahan aur app/globals.css ke "theme switcher" block me, dono jagah badlo
const FIXED: Opt[] = [
  { id: "violet", name: "Violet Night", bg: "#0f0c1d", a: "#a78bfa", b: "#f472b6" },
  { id: "sunset", name: "Sunset Amber", bg: "#140f0b", a: "#f59e0b", b: "#fb7185" },
  { id: "ocean", name: "Ocean Blue", bg: "#09121f", a: "#4da3ff", b: "#22d3ee" },
];
const IDS = FIXED.map((t) => t.id);

// "Default" ke rang site ke :root se padhe jate hain (theme hata kar, turant wapas laga kar)
function readDefaults() {
  const root = document.documentElement;
  const cur = root.getAttribute("data-theme");
  root.removeAttribute("data-theme");
  const cs = getComputedStyle(root);
  const get = (v: string, d: string) => cs.getPropertyValue(v).trim() || d;
  const out = {
    bg: get("--bg", "#0b0b0c"),
    a: get("--accent", "#6ee0b8"),
    b: get("--accent-2", "#f5a97f"),
  };
  if (cur) root.setAttribute("data-theme", cur);
  return out;
}

function Swatch({ bg, a, b }: { bg: string; a: string; b: string }) {
  return (
    <span
      className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20"
      style={{ background: `linear-gradient(90deg, ${bg} 50%, ${a} 50%)` }}
    >
      <span
        className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border border-black/30"
        style={{ background: b }}
      />
    </span>
  );
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("default");
  const [def, setDef] = useState({ bg: "#0b0b0c", a: "#6ee0b8", b: "#f5a97f" });
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
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-surface/95 text-accent shadow-lg shadow-black/40 transition hover:scale-105 active:scale-95 ${
          open ? "border-accent" : "border-accent/40 hover:border-accent"
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
            className="absolute bottom-full right-0 z-10 mb-3 w-64 rounded-2xl border border-white/10 bg-surface p-3 shadow-2xl shadow-black/60"
          >
            <p className="px-2 pb-2 pt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Colour theme
            </p>

            <div className="space-y-1">
              {options.map((o) => {
                const on = o.id === current;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    onClick={() => apply(o.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
                      on ? "bg-accent/10" : "hover:bg-white/5"
                    }`}
                  >
                    <Swatch bg={o.bg} a={o.a} b={o.b} />
                    <span
                      className={`min-w-0 flex-1 truncate text-[15px] ${
                        on ? "font-medium text-fg" : "text-muted"
                      }`}
                    >
                      {o.name}
                    </span>
                    {on && <Check size={17} className="shrink-0 text-accent" />}
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