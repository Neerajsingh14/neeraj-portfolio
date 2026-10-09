"use client";
import { motion } from "motion/react";
import { Building2, GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useSite } from "./SiteProvider";

export default function Education() {
  const { education } = useSite();
  // chronological: left se right (purana pehle)
  const items = [...education].sort((a, b) => Number(a.start) - Number(b.start));

  return (
    <section id="education" className="wrap py-16 md:py-24">
      <SectionHeading
        eyebrow="Education"
        title="My academic journey"
        subtitle="From BCA to MCA, building a strong foundation in computer applications."
      />

      <div className="relative mt-10">
        {/* horizontal timeline track (md+) */}
        <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/10 md:block" />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute left-0 top-[22px] hidden h-px bg-gradient-to-r from-accent to-accent-2 md:block"
        />

        <div className="grid gap-8 md:grid-cols-2 md:gap-6">
          {items.map((e, i) => {
            const years = Number(e.end) - Number(e.start);
            return (
              <Reveal key={e.short} delay={i * 0.12}>
                {/* node + year */}
                <div className="relative flex items-center gap-3 pb-5">
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-accent/50 bg-bg text-accent shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_40%,transparent)]">
                    <GraduationCap size={19} />
                  </span>
                  <span className="relative z-10 rounded-full border border-white/10 bg-bg px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
                    {e.start} - {e.end}
                  </span>
                </div>

                {/* card */}
                <div className="rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-accent/50 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <p className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-display text-4xl font-bold text-transparent">
                      {e.short}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                      {years} years
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold leading-snug sm:text-xl">
                    {e.degree}
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                    <Building2 size={16} className="mt-0.5 shrink-0 text-accent" />
                    {e.school}
                  </p>

                  <div className="mt-6">
                    <div className="flex items-end justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                        {e.label}
                      </p>
                      <p>
                        <span className="font-display text-2xl font-bold">
                          {e.score}
                        </span>
                        <span className="text-sm text-muted"> / 10</span>
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}