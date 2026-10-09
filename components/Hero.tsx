"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  Download,
  Layers,
  MapPin,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import CountUp from "./CountUp";
import HeroVisual from "./HeroVisual";
import { devicon, resolveIcon } from "@/lib/devicon";
import { useSite } from "./SiteProvider";
import { scrollToId } from "@/lib/scroll";
import type { HeroContent } from "@/lib/content-types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.15 + i * 0.1, duration: 0.6, ease },
});

const statIcons: Record<string, LucideIcon> = {
  Projects: Rocket,
  Experience: Briefcase,
  Skills: Layers,
};

const techChips = [
  { n: "React", s: "react", invert: false },
  { n: "Next.js", s: "nextjs", invert: true },
  { n: "Tailwind", s: "tailwindcss", invert: false },
  { n: "JavaScript", s: "javascript", invert: false },
];

function Rotator({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % phrases.length), 2600);
    return () => clearInterval(id);
  }, [phrases.length]);

  if (phrases.length === 0) return null;
  const text = phrases[i % phrases.length];

  return (
    <span className="relative inline-block h-7 overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className="block whitespace-nowrap bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-semibold leading-7 text-transparent"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({
  hero,
  stats,
}: {
  hero: HeroContent;
  stats: { value: string; label: string }[];
}) {
  const { profile } = useSite();
  const techChips = hero.stack
    .slice(0, 5)
    .map((n) => {
      const ic = resolveIcon(n);
      return { n, s: ic?.slug ?? "", invert: ic?.invert ?? false };
    })
    .filter((t) => t.s);
  // "Neeraj Singh" upar (letter by letter), "Rajpurohit" neeche (shimmer)
  const words = hero.name.split(" ").filter(Boolean);
  const last = words.pop() ?? "";
  const first = words;
  const offsets = first.reduce<number[]>((acc, w, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + first[i - 1].length);
    return acc;
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="wrap relative grid items-center gap-12 pb-20 pt-28 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div>
          {hero.badge && (
            <motion.span
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              {hero.badge}
            </motion.span>
          )}

          {hero.greeting && (
            <motion.p
              {...fadeUp(1)}
              className="mt-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted"
            >
              <span className="h-px w-8 bg-gradient-to-r from-accent to-accent-2" />
              {hero.greeting}
            </motion.p>
          )}

          <h1
            aria-label={hero.name}
            className="mt-3 text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl md:text-7xl xl:text-[5rem]"
          >
            <span className="block" aria-hidden="true">
              {first.map((w, wi) => (
                <span
                  key={w + wi}
                  className="mr-[0.25em] inline-block overflow-hidden pb-2 align-top"
                >
                  {w.split("").map((ch, ci) => (
                    <motion.span
                      key={ci}
                      className="inline-block"
                      initial={{ y: "110%", rotate: 8 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3 + (offsets[wi] + ci) * 0.035,
                        ease,
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-2" aria-hidden="true">
              <motion.span
                className="text-shimmer inline-block bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease }}
              >
                {last}
              </motion.span>
            </span>
          </h1>

          {/* role + location + rotating line */}
          <motion.div {...fadeUp(4)} className="mt-6 flex gap-4">
            <span className="w-0.5 shrink-0 rounded-full bg-gradient-to-b from-accent to-accent-2" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-display text-lg font-semibold sm:text-xl">
                <Sparkles size={19} className="shrink-0 text-accent" />
                {hero.role}
              </p>
              {hero.location && (
                <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
                  <MapPin size={15} className="shrink-0 text-accent" />
                  {hero.location}
                </p>
              )}
              {hero.phrases.length > 0 && (
                <p className="mt-3 flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-muted">I build</span>
                  <Rotator phrases={hero.phrases} />
                </p>
              )}
            </div>
          </motion.div>

          {/* buttons */}
          <motion.div {...fadeUp(5)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("projects");
              }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition hover:scale-105"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">View Projects</span>
              <ArrowRight
                size={17}
                className="relative transition group-hover:translate-x-1"
              />
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              <Download size={17} />
              Resume
            </a>
          </motion.div>

          {/* mobile par code card nahi hota, isliye tech chips */}
          <motion.div
            {...fadeUp(6)}
            className="mt-6 flex flex-wrap gap-2 lg:hidden"
          >
            {techChips.map((t) => (
              <span
                key={t.s}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/70 px-3 py-1.5 text-xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={devicon(t.s)}
                  alt=""
                  width={16}
                  height={16}
                  className={`h-4 w-4 object-contain ${t.invert ? "invert" : ""}`}
                />
                {t.n}
              </span>
            ))}
          </motion.div>

          {/* stats */}
          <motion.div
            {...fadeUp(7)}
            className="mt-9 grid max-w-lg grid-cols-3 gap-3"
          >
            {stats.map((s, i) => {
              const Icon = statIcons[s.label] ?? Sparkles;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-surface/60 p-4 backdrop-blur transition hover:-translate-y-1 hover:border-accent/50"
                >
                  <Icon size={17} className="text-accent" />
                  <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                    <CountUp value={s.value} delay={1.1 + i * 0.15} />
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT */}
        <HeroVisual hero={hero} />
      </div>

      {/* scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => scrollToId("about")}
        aria-label="Scroll down"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition hover:text-fg md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          Scroll
        </span>
        <span className="flex h-8 w-5 justify-center rounded-full border border-white/25 pt-1.5">
          <span className="hero-scroll-dot h-1.5 w-1 rounded-full bg-accent" />
        </span>
      </motion.button>
    </section>
  );
}