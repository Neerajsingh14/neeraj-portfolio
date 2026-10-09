import { socialIcons } from "./icons";
import type { SocialKey } from "@/lib/portfolio";

// hover par har icon apne brand ke color me (Instagram par asli gradient)
const BRAND: Record<SocialKey, string> = {
  github: "#ffffff",
  linkedin: "#0a77d5",
  instagram: "#e1306c",
  whatsapp: "#25d366",
};

export default function SocialLink({
  social,
  iconSize = 20,
  box = "h-11 w-11",
  tip = false,
  className = "",
}: {
  social: { key: SocialKey; name: string; href: string };
  iconSize?: number;
  box?: string;
  tip?: boolean;
  className?: string;
}) {
  const Icon = socialIcons[social.key];
  const ig = social.key === "instagram";

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      aria-label={social.name}
      style={{ "--brand": BRAND[social.key] } as React.CSSProperties}
      className={`group relative flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-white/[0.08] hover:text-[var(--brand)] hover:shadow-[0_0_22px_-4px_var(--brand)] ${box} ${className}`}
    >
      <Icon
        size={iconSize}
        className={ig ? "transition group-hover:fill-[url(#ig-grad)]" : ""}
      />
      {tip && (
        <span className="pointer-events-none absolute left-[3.5rem] whitespace-nowrap rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-xs text-fg opacity-0 shadow-lg transition group-hover:opacity-100">
          {social.name}
        </span>
      )}
    </a>
  );
}