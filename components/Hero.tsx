"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const words = ["I", "build", "things", "people", "remember."];

const stats = [
  { value: "10+", label: "Projects" },
  { value: "3+", label: "Years" },
  { value: "5+", label: "Certificates" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      {/* glowing background blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent-2/20 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-5xl pt-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          Available for work
        </motion.span>

        <h1 className="mt-6 flex flex-wrap gap-x-4 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          {words.map((w, i) => (
            <span key={i} className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ delay: 1 }}
          className="mt-6 max-w-xl text-lg text-muted"
        >
          Full Stack Developer crafting fast, modern and beautiful web experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:scale-105"
          >
            View Projects
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-6 py-3 font-medium transition hover:bg-white/10"
          >
            Contact me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 grid max-w-md grid-cols-3 gap-6"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}