import { ExternalLink } from "lucide-react";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent active:scale-95 disabled:opacity-40";

export function PageHeader({
  eyebrow,
  title,
  description,
  previewHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  previewHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {previewHref && (
        <a href={previewHref} target="_blank" rel="noreferrer" className={btnGhost}>
          <ExternalLink size={16} />
          View on site
        </a>
      )}
    </div>
  );
}

export function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-4 z-20 mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-surface p-3 pl-5 shadow-2xl shadow-black/50">
      {children}
    </div>
  );
}

export function StatusDot({ dirty, idle }: { dirty: boolean; idle?: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2.5 text-sm">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          dirty ? "animate-pulse bg-amber-400" : "bg-green-400"
        }`}
      />
      <span className={dirty ? "text-amber-300" : "text-muted"}>
        {dirty ? "Unsaved changes" : idle ?? "All changes saved"}
      </span>
    </span>
  );
}