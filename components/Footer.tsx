import { profile, socials } from "@/lib/portfolio";
import { socialIcons } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="wrap">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {socials.map((s) => {
              const Icon = socialIcons[s.key];
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition hover:border-accent hover:text-accent sm:h-11 sm:w-11"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          <p className="text-right font-mono text-[11px] leading-snug text-muted sm:text-sm">
            Built with <span className="text-accent">Next.js</span> &amp;{" "}
            <span className="text-accent">Tailwind CSS</span>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted/70">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}