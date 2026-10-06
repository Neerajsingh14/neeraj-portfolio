"use client";
import { motion } from "motion/react";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { profile, stats } from "@/lib/portfolio";
import { scrollToId } from "@/lib/scroll";

const codeLines = [
  "const developer = {",
  '  name: "Neeraj",',
  '  role: "Full Stack",',
  '  stack: ["React", "Spring Boot",',
  '          "PostgreSQL"],',
  "  openToWork: true,",
  "};",
];

export default function Hero() {
  const words = profile.headline.split(" ");

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px] md:h-[500px] md:w-[500px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-accent-2/20 blur-[120px] md:h-[400px] md:w-[400px]" />

      <div className="wrap relative grid items-center gap-12 pb-16 pt-28 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-muted sm:text-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Open to opportunities
          </motion.span>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 font-mono text-xs uppercase tracking-widest text-muted sm:text-sm"
          >
            Hi, I&apos;m {profile.name}
          </motion.p>

          <h1 className="mt-3 flex flex-wrap gap-x-3 text-4xl font-bold leading-tight tracking-tight sm:gap-x-4 sm:text-5xl md:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="overflow-hidden pb-2">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.4 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`inline-block ${
                    i === words.length - 1
                      ? "bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-6 max-w-xl text-base text-muted sm:text-lg"
          >
            <span className="text-fg">{profile.role}.</span> {profile.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-3 inline-flex items-center gap-2 text-sm text-muted"
          >
            <MapPin size={16} className="text-accent" />
            {profile.location}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-8 flex flex-wrap gap-3 sm:gap-4"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("projects");
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-fg transition hover:scale-105"
            >
              View Projects
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium transition hover:bg-white/10"
            >
              <Download size={18} />
              Resume
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className="rounded-full px-4 py-3 font-medium text-muted transition hover:text-fg"
            >
              Contact me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-4 sm:mt-14 sm:gap-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold sm:text-3xl">{s.value}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right: code card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-3xl border border-white/10 bg-surface/70 shadow-2xl shadow-accent/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 font-mono text-xs text-muted">
                developer.ts
              </span>
            </div>
            <div className="p-6 font-mono text-sm leading-7">
              {codeLines.map((line, i) => (
                <div key={i} className="whitespace-pre text-muted">
                  <span className="mr-4 select-none text-white/20">{i + 1}</span>
                  <span className={i === 0 || i === 6 ? "text-accent" : ""}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}