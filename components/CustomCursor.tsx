"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Asli arrow cursor ke peeche lag kar chalne wali ring (sirf mouse wale device pe)
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 170, damping: 17, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 170, damping: 17, mass: 0.7 });

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setHover(
        !!t?.closest(
          "a, button, input, textarea, select, label, [role='button'], [role='option'], [data-cursor]"
        )
      );
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy, marginLeft: -14, marginTop: -14 }}
      animate={{
        scale: down ? 0.85 : hover ? 1.3 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full border border-accent/60 bg-accent/5"
    />
  );
}