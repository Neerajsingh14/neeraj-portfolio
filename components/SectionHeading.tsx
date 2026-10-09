"use client";
import Reveal from "./Reveal";
import { useSite } from "./SiteProvider";

// admin ke "Sections" page se title/subtitle yahin lagte hain (eyebrow = section ka naam)
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const { sections } = useSite();
  const k = eyebrow.toLowerCase();
  const t = sections[`${k}_title`];
  const s = sections[`${k}_subtitle`];
  const T = typeof t === "string" && t ? t : title;
  const S = typeof s === "string" ? s : subtitle;

  return (
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">{T}</h2>
      {S && (
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{S}</p>
      )}
    </Reveal>
  );
}