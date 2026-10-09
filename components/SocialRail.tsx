"use client";
import { motion } from "motion/react";
import { useSite } from "./SiteProvider";
import SocialLink from "./SocialLink";

export default function SocialRail() {
  const { socials } = useSite();
  return (
    <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ originY: 1 }}
        className="h-16 w-px bg-gradient-to-b from-transparent to-accent"
      />

      {socials.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
        >
          <SocialLink social={s} iconSize={19} box="h-11 w-11" tip />
        </motion.div>
      ))}

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