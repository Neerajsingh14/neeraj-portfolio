"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Briefcase, Calendar, Clock, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { experience } from "@/lib/portfolio";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="wrap py-20 md:py-28">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've worked"
        subtitle="My professional journey so far, from building user interfaces to guiding students."
      />

      <div ref={ref} className="relative mt-12">
        {/* timeline line + scroll progress */}
        <div className="absolute bottom-2 left-[19px] top-2 w-0.5 rounded-full bg-white/10" />
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute bottom-2 left-[19px] top-2 w-0.5 rounded-full bg-gradient-to-b from-accent to-accent-2"
        />

        {experience.map((e, i) => (
          <Reveal
            key={e.company + e.period}
            delay={i * 0.08}
            className="relative pb-10 pl-16 last:pb-0"
          >
            <span className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-bg text-accent shadow-lg shadow-accent/30">
              {i === 0 && (
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/25" />
              )}
              <Briefcase size={18} className="relative" />
            </span>

            <div className="rounded-3xl border border-white/10 bg-surface p-6 transition hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 font-display text-lg font-bold text-accent-fg">
                    {e.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-snug md:text-2xl">
                      {e.position}
                    </h3>
                    <p className="text-muted">{e.company}</p>
                  </div>
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-accent">
                  {e.type}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={15} className="text-accent" />
                  {e.period}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={15} className="text-accent" />
                  {e.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-accent" />
                  {e.location} ({e.mode})
                </span>
              </div>

              <p className="mt-5 leading-relaxed text-muted">{e.description}</p>

              {e.points && (
                <ul className="mt-4 space-y-2 text-muted">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}