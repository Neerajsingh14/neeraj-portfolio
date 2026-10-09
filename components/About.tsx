"use client";
import { Download } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useSite } from "./SiteProvider";

export default function About() {
  const { about, profile } = useSite();

  return (
    <section id="about" className="wrap py-16 md:py-24">
      <SectionHeading eyebrow="About" title="About me" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <Reveal>
          <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {profile.resume && (
            <a
              href={profile.resume}
              download
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition hover:scale-105"
            >
              <Download size={16} />
              Download Resume
            </a>
          )}
        </Reveal>

        {about.facts.length > 0 && (
          <Reveal delay={0.1}>
            <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface">
              {about.facts.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-6 px-5 py-4"
                >
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                    {f.label}
                  </dt>
                  <dd className="text-right text-sm">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}