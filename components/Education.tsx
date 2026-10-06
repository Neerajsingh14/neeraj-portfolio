"use client";
import { motion } from "motion/react";
import { GraduationCap, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { education } from "@/lib/portfolio";

export default function Education() {
  return (
    <section id="education" className="wrap py-20 md:py-28">
      <SectionHeading
        eyebrow="Education"
        title="My academic journey"
        subtitle="From BCA to MCA, building a strong foundation in computer applications."
      />

      <Reveal className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-surface">
        {education.map((e) => (
          <div
            key={e.short}
            className="group relative grid gap-6 border-b border-white/10 p-6 transition-colors last:border-b-0 hover:bg-white/[0.03] md:grid-cols-[190px_1fr_250px] md:items-center md:gap-10 md:p-9"
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-accent-2 opacity-0 transition-opacity group-hover:opacity-100" />

            {/* year */}
            <div>
              <p className="font-display text-2xl font-bold tracking-tight">
                {e.start}
                <span className="mx-1.5 text-muted">&ndash;</span>
                {e.end}
              </p>
              <span className="mt-2 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
                Completed
              </span>
            </div>

            {/* degree */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-accent-fg">
                <GraduationCap size={24} />
              </div>
              <div className="min-w-0">
                <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest text-muted">
                  {e.short}
                </span>
                <h3 className="mt-2 text-xl font-semibold leading-snug md:text-2xl">
                  {e.degree}
                </h3>
                <p className="mt-1.5 flex items-start gap-2 text-muted">
                  <MapPin size={16} className="mt-1 shrink-0 text-accent" />
                  {e.school}
                </p>
              </div>
            </div>

            {/* score */}
            <div>
              <div className="flex items-end justify-between">
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {e.label}
                </p>
                <p>
                  <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-display text-4xl font-bold text-transparent">
                    {e.score}
                  </span>
                  <span className="text-muted"> / 10</span>
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${e.score * 10}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                />
              </div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}