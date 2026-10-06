"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import { skillGroups, type Skill } from "@/lib/portfolio";

const iconUrl = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;

function SkillIcon({ skill }: { skill: Skill }) {
  const [failed, setFailed] = useState(false);

  if (!skill.icon || failed) {
    return (
      <span className="font-display text-xl font-bold text-accent">
        {skill.name.slice(0, 2)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconUrl(skill.icon)}
      alt=""
      width={36}
      height={36}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-9 w-9 object-contain ${skill.invert ? "invert" : ""}`}
    />
  );
}

export default function Skills() {
  const [tab, setTab] = useState("All");
  const tabs = ["All", ...skillGroups.map((g) => g.title)];

  const items = useMemo(() => {
    const groups =
      tab === "All" ? skillGroups : skillGroups.filter((g) => g.title === tab);
    return groups.flatMap((g) => g.items.map((s) => ({ ...s, group: g.title })));
  }, [tab]);

  return (
    <section id="skills" className="wrap py-20 md:py-28">
      <SectionHeading
        eyebrow="Skills"
        title="My tech stack"
        subtitle="Technologies and tools I use to design, build and ship web applications."
      />

      {/* tabs */}
      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider"
          >
            {tab === t && (
              <motion.span
                layoutId="skill-tab"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-accent"
              />
            )}
            <span
              className={`relative transition-colors ${
                tab === t ? "text-accent-fg" : "text-muted hover:text-fg"
              }`}
            >
              {t}
            </span>
          </button>
        ))}
      </div>

      {/* tiles */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        <AnimatePresence mode="popLayout">
          {items.map((s) => (
            <motion.div
              layout
              key={s.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-surface px-3 py-6 text-center transition-colors hover:border-accent/60"
            >
              <span className="pointer-events-none absolute -top-10 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition group-hover:bg-accent/30" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                <SkillIcon skill={s} />
              </span>
              <span className="relative text-sm font-medium">{s.name}</span>
              <span className="relative font-mono text-[10px] uppercase tracking-widest text-muted">
                {s.group}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}