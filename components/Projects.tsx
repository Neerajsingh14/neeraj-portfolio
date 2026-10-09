"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import BrowserFrame from "./BrowserFrame";
import { GithubIcon } from "./icons";
import { projectFilterOrder } from "@/lib/portfolio";
import type { ProjectItem } from "@/lib/content-types";

const ALL = "All Projects";

export default function Projects({ projects }: { projects: ProjectItem[] }) {
  const [active, setActive] = useState(ALL);

  // filter tabs: jis category me project hoga wahi tab banega
  const tabs = useMemo(() => {
    const cats = Array.from(new Set(projects.flatMap((p) => p.categories)));
    const rank = (c: string) => {
      const i = projectFilterOrder.indexOf(c);
      return i < 0 ? 99 : i;
    };
    cats.sort((a, b) => rank(a) - rank(b));
    return [ALL, ...cats];
  }, [projects]);

  const shown =
    active === ALL
      ? projects
      : projects.filter((p) => p.categories.includes(active));

  return (
    <section id="projects" className="wrap py-16 md:py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        subtitle="Frontend and full stack applications built with React, Spring Boot, PHP and more."
      />

      {projects.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted">
          Projects coming soon.
        </p>
      ) : (
        <>
          {/* filter pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className="relative rounded-full border border-white/10 bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-white/25"
              >
                {active === t && (
                  <motion.span
                    layoutId="proj-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-2 shadow-lg shadow-accent/30"
                  />
                )}
                <span
                  className={`relative transition-colors ${
                    active === t ? "text-accent-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {t}
                </span>
              </button>
            ))}
          </div>

          <div key={active} className="mt-12 space-y-20 md:mt-14 md:space-y-24">
            {shown.map((p, i) => (
              <article
                key={p.id}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p.categories[0] && (
                      <span className="rounded border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
                        {p.categories[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                    {p.title}
                  </h3>
                  {p.period && (
                    <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
                      {p.period}
                    </p>
                  )}
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                    {p.description}
                  </p>

                  {p.highlights.length > 0 && (
                    <ul className="mt-4 max-w-lg space-y-2 text-sm text-muted sm:text-base">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {p.tech.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {p.live ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-accent-fg shadow-lg shadow-accent/25 transition hover:scale-105"
                      >
                        Live demo
                        <ArrowUpRight
                          size={15}
                          className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    ) : (
                      <span
                        title="Coming soon"
                        aria-disabled="true"
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-accent/35 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white/70"
                      >
                        Live demo
                        <ArrowUpRight size={15} />
                      </span>
                    )}
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition hover:border-accent hover:text-accent"
                      >
                        <GithubIcon size={15} />
                        GitHub
                      </a>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <BrowserFrame
                    label={(p.live || p.github || "preview").replace(
                      /^https?:\/\//,
                      ""
                    )}
                    image={p.image || undefined}
                    title={p.title}
                    tech={p.tech}
                  />
                </motion.div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}