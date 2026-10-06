"use client";
import { useRef, useState } from "react";

export default function BrowserFrame({
  label,
  image,
  title,
  tech,
}: {
  label: string;
  image?: string;
  title: string;
  tech: string[];
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isMouse = useRef(true);
  const [offset, setOffset] = useState(0);
  const [hover, setHover] = useState(false);

  const start = () => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (frame && inner) {
      setOffset(Math.max(0, inner.scrollHeight - frame.clientHeight));
    }
    setHover(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl shadow-accent/10">
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 truncate rounded-lg bg-black/30 px-3 py-1 font-mono text-xs text-muted">
          {label}
        </div>
      </div>

      <div
        ref={frameRef}
        onPointerDown={(e) => {
          isMouse.current = e.pointerType === "mouse";
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") start();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHover(false);
        }}
        onClick={() => {
          if (!isMouse.current) {
            if (hover) setHover(false);
            else start();
          }
        }}
        className="relative h-[280px] cursor-pointer overflow-hidden sm:h-[320px] md:h-[380px]"
      >
        <div
          ref={innerRef}
          style={{
            transform: `translateY(${hover ? -offset : 0}px)`,
            transitionProperty: "transform",
            transitionTimingFunction: "linear",
            transitionDuration: hover ? `${Math.max(2, offset / 150)}s` : "0.6s",
          }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={title} className="block w-full" />
          ) : (
            <Placeholder title={title} tech={tech} />
          )}
        </div>

        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-muted backdrop-blur-md">
          {hover ? (
            "Scrolling..."
          ) : (
            <>
              <span className="hint-mouse">Hover to scroll preview</span>
              <span className="hint-touch">Tap to scroll preview</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

function Placeholder({ title, tech }: { title: string; tech: string[] }) {
  return (
    <div className="h-[900px] bg-gradient-to-b from-accent/25 via-surface to-accent-2/20 p-8">
      <p className="font-display text-3xl font-bold">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-3 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
      </div>
      <div className="mt-10 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="mt-8 h-48 rounded-xl bg-white/5" />
      <div className="mt-6 space-y-3">
        <div className="h-3 w-2/3 rounded bg-white/10" />
        <div className="h-3 w-1/3 rounded bg-white/10" />
      </div>
    </div>
  );
}