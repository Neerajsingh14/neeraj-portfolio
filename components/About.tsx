"use client";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Check,
  Database,
  Download,
  GraduationCap,
  Layers,
  MapPin,
  Smartphone,
  Target,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  aboutParagraphs,
  facts,
  principles,
  profile,
  whatIDo,
} from "@/lib/portfolio";
import { scrollToId } from "@/lib/scroll";

const factIcons: Record<string, LucideIcon> = {
  pin: MapPin,
  grad: GraduationCap,
  briefcase: Briefcase,
  target: Target,
};

const doIcons: Record<string, LucideIcon> = {
  layers: Layers,
  smartphone: Smartphone,
  database: Database,
  brain: Brain,
};

export default function About() {
  return (
    <section id="about" className="wrap py-20 md:py-28">
      <SectionHeading
        eyebrow="About"
        title="Turning ideas into reliable web products"
        subtitle="A developer who cares about clean code, smooth interfaces and the people who use them."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* story */}
        <Reveal className="rounded-3xl border border-white/10 bg-surface p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            My story
          </p>
          <div className="mt-5 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {aboutParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition hover:scale-105"
            >
              <Download size={16} />
              Download Resume
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Let&apos;s talk
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </div>
        </Reveal>

        {/* quick facts */}
        <Reveal
          delay={0.1}
          className="rounded-3xl border border-white/10 bg-surface p-6 sm:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Quick facts
          </p>
          <div className="mt-4 divide-y divide-white/10">
            {facts.map((f) => {
              const Icon = factIcons[f.icon];
              return (
                <div key={f.label} className="flex items-start gap-4 py-4 first:pt-2 last:pb-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted">
                      {f.label}
                    </p>
                    <p className="mt-0.5 text-fg">{f.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* what I do */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whatIDo.map((w, i) => {
          const Icon = doIcons[w.icon];
          return (
            <Reveal
              key={w.title}
              delay={i * 0.07}
              className="group rounded-3xl border border-white/10 bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-accent-fg">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.text}</p>
            </Reveal>
          );
        })}
      </div>

      {/* how I work */}
      <Reveal className="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          How I work
        </p>
        <div className="flex flex-wrap gap-2">
          {principles.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
            >
              <Check size={14} className="text-accent" />
              {p}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}