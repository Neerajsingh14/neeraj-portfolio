"use client";
import { useState } from "react";
import { BadgeCheck, Calendar, Check, Copy, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { CertificateItem } from "@/lib/content-types";

function CopyId({ id }: { id: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* clipboard allowed nahi */
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-3 py-2">
      <span className="min-w-0 flex-1 break-all font-mono text-[11px] text-muted">
        <span className="text-muted/60">ID </span>
        {id}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy credential ID"
        className="shrink-0 rounded-md p-1.5 text-muted transition hover:bg-white/10 hover:text-accent"
      >
        {done ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export default function Certificates({ items }: { items: CertificateItem[] }) {
  return (
    <section id="certificates" className="wrap py-16 md:py-24">
      <SectionHeading
        eyebrow="Certificates"
        title="Learning & achievements"
        subtitle="Industry certifications and courses that sharpen my skills."
      />

      {items.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted">
          Certificates coming soon.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((c, i) => {
            const color = c.color || "#38bdf8";
            return (
              <Reveal key={c.id} delay={i * 0.05}>
                <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface transition duration-300 hover:-translate-y-0.5 hover:border-white/25">
                  {/* colour wash */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `linear-gradient(100deg, ${color}22, transparent 45%)`,
                    }}
                  />
                  {/* bada outline number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-5 right-4 select-none font-display text-8xl font-bold leading-none text-transparent"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.06)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative grid gap-5 p-5 sm:p-6 md:grid-cols-[auto_1fr_minmax(0,300px)] md:items-center md:gap-7">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-bold"
                      style={{ backgroundColor: `${color}2e`, color }}
                    >
                      {(c.issuer || "C").charAt(0)}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {c.issuer && (
                          <span className="font-mono text-xs uppercase tracking-widest text-muted">
                            {c.issuer}
                          </span>
                        )}
                        {c.tag && (
                          <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                            {c.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-base font-semibold leading-snug sm:text-lg">
                        {c.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                        {c.issued && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={14} className="text-accent" />
                            Issued {c.issued}
                          </span>
                        )}
                        {c.expires && (
                          <span className="inline-flex items-center gap-1.5">
                            <BadgeCheck size={14} className="text-accent-2" />
                            Valid till {c.expires}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {c.credentialId && <CopyId id={c.credentialId} />}
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent transition hover:bg-accent hover:text-accent-fg"
                        >
                          Verify credential
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {!c.credentialId && !c.url && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted">
                          <Check size={13} className="text-accent" />
                          Course completed
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}