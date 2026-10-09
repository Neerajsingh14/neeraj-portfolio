"use client";
import { useEffect, useRef } from "react";

// Grid + mouse spotlight, poori site ke peeche (screen par fixed)
export default function SiteBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // spotlight sirf mouse wale device par cursor ke saath chalti hai
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const mask =
    "radial-gradient(ellipse 100% 85% at 50% 35%, black 30%, transparent 100%)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {/* grid */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      {/* mouse spotlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 72%) var(--my, 28%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}