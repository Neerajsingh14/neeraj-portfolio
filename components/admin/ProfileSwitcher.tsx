"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { selectProfile } from "@/lib/actions";
import { useAdmin } from "./AdminContext";

export default function ProfileSwitcher({
  profiles,
  active,
  current,
}: {
  profiles: { id: string; label: string }[];
  active: string;
  current: string;
}) {
  const router = useRouter();
  const { confirmLeave, toast } = useAdmin();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const cur = profiles.find((p) => p.id === current);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id: string) => {
    setOpen(false);
    if (id === current) return;
    if (!confirmLeave()) return;
    start(async () => {
      const r = await selectProfile(id);
      if (r.ok) router.refresh();
      else toast("err", r.error ?? "Profile badal nahi paya");
    });
  };

  return (
    <div ref={ref} className="relative">
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-muted/70">
        Editing profile
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={pending}
        className={`flex w-full items-center gap-3 rounded-xl border bg-bg/60 px-3.5 py-3 text-left transition hover:border-white/25 disabled:opacity-60 ${
          open ? "border-accent" : "border-white/10"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-accent-fg">
          {(cur?.label ?? "?").charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{cur?.label}</span>
          <span className="block text-xs text-muted">
            {current === active ? "Live on site" : "Not live"}
          </span>
        </span>
        <ChevronsUpDown size={16} className="shrink-0 text-muted" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-white/10 bg-surface p-1.5 shadow-2xl shadow-black/60"
          >
            {profiles.map((p) => (
              <li key={p.id} role="option" aria-selected={p.id === current}>
                <button
                  type="button"
                  onClick={() => pick(p.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    p.id === current
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:bg-white/5 hover:text-fg"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{p.label}</span>
                  {p.id === active && (
                    <span className="rounded-full border border-green-400/40 bg-green-400/10 px-2 py-0.5 font-mono text-[10px] text-green-400">
                      Live
                    </span>
                  )}
                  {p.id === current && <Check size={15} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}