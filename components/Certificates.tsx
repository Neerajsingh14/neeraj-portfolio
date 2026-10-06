import { BadgeCheck, Calendar, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { certificates } from "@/lib/portfolio";

export default function Certificates() {
  const oracle = certificates.filter((c) => c.issuer === "Oracle").length;

  return (
    <section id="certificates" className="wrap py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.5fr] lg:gap-16">
        {/* left: sticky heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Certificates"
            title="Learning & achievements"
            subtitle="Industry certifications and courses that sharpen my skills."
          />
          <Reveal delay={0.1} className="mt-8 grid max-w-sm grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-surface p-4">
              <p className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-display text-3xl font-bold text-transparent">
                {String(certificates.length).padStart(2, "0")}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                Certificates
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface p-4">
              <p className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-display text-3xl font-bold text-transparent">
                {String(oracle).padStart(2, "0")}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                Oracle certified
              </p>
            </div>
          </Reveal>
        </div>

        {/* right: one by one */}
        <div className="space-y-4">
          {certificates.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-5 pl-7 transition hover:border-accent/50 sm:p-6 sm:pl-8">
                <span
                  className="absolute bottom-5 left-0 top-5 w-1 rounded-r-full"
                  style={{ backgroundColor: c.color }}
                />

                <div className="flex items-start gap-4 sm:gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold"
                    style={{ backgroundColor: `${c.color}26`, color: c.color }}
                  >
                    {c.issuer[0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted">
                        {c.issuer}
                      </span>
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-accent">
                        {c.tag}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold leading-snug sm:text-xl">
                      {c.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                      <span className="inline-flex items-center gap-2">
                        <Calendar size={15} className="text-accent" />
                        Issued {c.issued}
                      </span>
                      {c.expires && (
                        <span className="inline-flex items-center gap-2">
                          <BadgeCheck size={15} className="text-accent-2" />
                          Valid till {c.expires}
                        </span>
                      )}
                    </div>

                    {c.credentialId && (
                      <p className="mt-3 break-all rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-muted">
                        ID: {c.credentialId}
                      </p>
                    )}

                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent transition hover:text-accent-2"
                      >
                        Verify credential
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  <span className="hidden font-mono text-sm text-muted/40 sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}