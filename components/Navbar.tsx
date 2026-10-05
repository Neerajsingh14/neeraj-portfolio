"use client";
import { motion } from "motion/react";

const links = ["About", "Projects", "Skills", "Contact"];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-4 left-1/2 z-50 w-[92%] max-w-5xl -translate-x-1/2"
    >
      <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
        <a href="#" className="font-semibold tracking-tight">
          Neeraj<span className="text-accent">.</span>
        </a>

        <ul className="hidden gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="transition hover:text-fg">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:scale-105"
        >
          Let&apos;s talk
        </a>
      </nav>
    </motion.header>
  );
}