"use client";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import BrowserFrame from "./BrowserFrame";
import { GithubIcon } from "./icons";
import { projects } from "@/lib/portfolio";

export default function Projects() {
  return (
    <section id="projects" className="wrap py-20 md:py-28">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        subtitle="Full stack and frontend applications built with React, Spring Boot, PHP and more."
      />

      <div className="mt-14 space-y-24 md:mt-16 md:space-y-28">
        {projects.map((p, i) => (
          <article
            key={p.title}
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
                <span className="rounded border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
                  {p.category}
                </span>
              </div>

              <h3 className="mt-5 text-4xl font-bold md:text-5xl">{p.title}</h3>
              <p className="mt-4 font-mono text-sm uppercase tracking-widest text-muted">
                {p.period}
              </p>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                {p.description}
              </p>

              <ul className="mt-5 max-w-lg space-y-2 text-muted">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Live demo + GitHub, side by side */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {p.live ? (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-accent-fg shadow-lg shadow-accent/30 transition hover:scale-105"
                  >
                    Live demo
                    <ArrowUpRight
                      size={16}
                      className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <span
                    title="Coming soon"
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-accent/40 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-white/70"
                  >
                    Live demo
                    <ArrowUpRight size={16} />
                  </span>
                )}
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-mono text-sm uppercase tracking-widest transition hover:border-accent hover:text-accent"
                >
                  <GithubIcon size={16} />
                  GitHub
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <BrowserFrame
                label={(p.live || p.github).replace(/^https?:\/\//, "")}
                image={p.image}
                title={p.title}
                tech={p.tech}
              />
            </motion.div>
          </article>
        ))}
      </div>
    </section>
  );
}