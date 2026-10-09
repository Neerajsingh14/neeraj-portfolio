"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Sparkles } from "lucide-react";
import { devicon, resolveIcon } from "@/lib/devicon";
import type { HeroContent } from "@/lib/content-types";

type Seg = [string, string];
const M = "text-muted";
const A = "text-accent";
const S = "text-accent-2";
const F = "text-fg";

function buildLines(h: HeroContent): Seg[][] {
  const first = h.name.split(" ")[0] || "Developer";
  const stack = h.stack.slice(0, 3);
  const arr: Seg[] = [
    ["  stack", F],
    [": [", M],
  ];
  stack.forEach((t, i) => {
    arr.push([`"${t}"`, S]);
    if (i < stack.length - 1) arr.push([", ", M]);
  });
  arr.push(["],", M]);

  return [
    [["const ", A], ["developer", F], [" = {", M]],
    [["  name", F], [": ", M], [`"${first}"`, S], [",", M]],
    [["  role", F], [": ", M], [`"${h.role}"`, S], [",", M]],
    arr,
    [["  openToWork", F], [": ", M], ["true", A], [",", M]],
    [["};", M]],
  ];
}

const POS = [
  { cls: "-left-8 top-6", depth: 60, delay: 0.2 },
  { cls: "-left-10 bottom-14", depth: 45, delay: 0.9 },
  { cls: "-right-5 top-24", depth: 70, delay: 0.5 },
];

function Float({
  className,
  depth,
  delay = 0,
  children,
}: {
  className: string;
  depth: number;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${depth}px)` }}>
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const pill =
  "flex items-center gap-2 rounded-full border border-white/10 bg-surface/90 px-3.5 py-2 font-mono text-xs shadow-xl shadow-black/40 backdrop-blur-md";

export default function HeroVisual({ hero }: { hero: HeroContent }) {
  const lines = useMemo(() => buildLines(hero), [hero]);
  const total = useMemo(
    () => lines.reduce((n, l) => n + l.reduce((m, s) => m + s[0].length, 0), 0),
    [lines]
  );

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 110, damping: 14 });
  const sry = useSpring(ry, { stiffness: 110, damping: 14 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= total) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      return;
    }
    const t = setTimeout(() => setCount(count + 1), count === 0 ? 1300 : 26);
    return () => clearTimeout(t);
  }, [count, total]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  let left = count;
  const rendered = lines.map((segs) => {
    const parts: { text: string; cls: string }[] = [];
    for (const [text, cls] of segs) {
      if (left <= 0) break;
      const take = text.slice(0, left);
      left -= take.length;
      parts.push({ text: take, cls });
    }
    return parts;
  });
  let lastIdx = 0;
  rendered.forEach((p, i) => {
    if (p.length > 0) lastIdx = i;
  });

  const initials =
    hero.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className="hidden lg:block"
    >
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative mx-auto w-full max-w-[440px] py-10 [perspective:1200px]"
      >
        <div className="pointer-events-none absolute inset-6 rounded-[2rem] bg-gradient-to-br from-accent to-accent-2 opacity-25 blur-3xl" />

        <motion.div
          style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-3 font-mono text-xs text-muted">developer.ts</span>
                <span className="ml-auto flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-[9px] font-bold text-accent-fg">
                  {hero.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hero.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </span>
              </div>

              <div className="overflow-hidden px-5 py-5 font-mono text-[13px] leading-7">
                {rendered.map((parts, i) => (
                  <div key={i} className="min-h-[1.75rem] whitespace-pre">
                    <span className="mr-4 inline-block w-3 select-none text-right text-white/20">
                      {i + 1}
                    </span>
                    {parts.map((p, j) => (
                      <span key={j} className={p.cls}>
                        {p.text}
                      </span>
                    ))}
                    {i === lastIdx && (
                      <span className="blink ml-px inline-block h-4 w-[7px] translate-y-[3px] bg-accent" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5 font-mono text-[11px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Ready for your next project
              </div>
            </div>
          </motion.div>

          {hero.stack.slice(0, 3).map((name, i) => {
            const ic = resolveIcon(name);
            const p = POS[i];
            return (
              <Float key={name + i} className={p.cls} depth={p.depth} delay={p.delay}>
                <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface/85 px-3 py-2 text-sm font-medium shadow-xl shadow-black/40 backdrop-blur-md">
                  {ic && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={devicon(ic.slug)}
                      alt=""
                      width={20}
                      height={20}
                      className={`h-5 w-5 object-contain ${ic.invert ? "invert" : ""}`}
                    />
                  )}
                  {name}
                </span>
              </Float>
            );
          })}

          <Float className="-right-3 -top-1" depth={80} delay={0.1}>
            <span className={pill}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Open for work
            </span>
          </Float>
          <Float className="-right-6 bottom-6" depth={55} delay={0.7}>
            <span className={pill}>
              <Sparkles size={13} className="text-accent" />
              {hero.role}
            </span>
          </Float>
        </motion.div>
      </div>
    </motion.div>
  );
}