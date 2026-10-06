import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <p className="font-mono text-sm uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-bold md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
    </Reveal>
  );
}