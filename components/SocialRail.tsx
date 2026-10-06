"use client";
import { motion } from "motion/react";
import { socials } from "@/lib/portfolio";
import { socialIcons } from "./icons";

export default function SocialRail() {
  return (
    <div className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex">
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ originY: 0 }}
        className="h-16 w-px bg-gradient-to-b from-transparent to-accent"
      />

      {socials.map((s, i) => {
        const Icon = socialIcons[s.key];
        const wa = s.key === "whatsapp";
        return (
          <motion.a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.12 }}
            whileHover={{ scale: 1.15, x: 4 }}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted backdrop-blur-md transition-colors ${
              wa
                ? "hover:border-[#25D366] hover:text-[#25D366]"
                : "hover:border-accent hover:text-accent"
            }`}
          >
            <Icon size={20} />
            <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg border border-white/10 bg-surface px-3 py-1 text-xs text-fg opacity-0 transition group-hover:opacity-100">
              {s.name}
            </span>
          </motion.a>
        );
      })}

      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{ originY: 0 }}
        className="h-16 w-px bg-gradient-to-b from-accent to-transparent"
      />
    </div>
  );
}