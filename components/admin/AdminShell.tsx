"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Eye, LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/lib/actions";
import { AdminProvider } from "./AdminContext";
import AdminNav from "./AdminNav";
import ProfileSwitcher from "./ProfileSwitcher";

type P = { id: string; label: string };

const titles: Record<string, string> = {
  hero: "Hero",
  about: "About",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  certificates: "Certificates",
  sections: "Section headings",
  profiles: "Profiles",
  settings: "Settings",
  messages: "Messages",
};

function SidebarBody({
  email,
  unread,
  profiles,
  active,
  current,
  prefix,
  onNavigate,
  onClose,
}: {
  email: string;
  unread: number;
  profiles: P[];
  active: string;
  current: string;
  prefix: string;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* brand + switcher (scroll nahi hote) */}
      <div className="shrink-0 space-y-5 p-5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xl font-bold leading-none">
              <span className="text-accent">&lt;</span>Admin
              <span className="text-accent">/&gt;</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">Portfolio CMS</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition hover:text-fg active:scale-95"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <ProfileSwitcher profiles={profiles} active={active} current={current} />
      </div>

      {/* menu: yahi scroll hota hai */}
      <nav
        aria-label="Admin menu"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2"
      >
        <AdminNav unread={unread} idPrefix={prefix} onNavigate={onNavigate} />
      </nav>

      {/* user + actions */}
      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-accent-fg">
            {(email || "A").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{email}</p>
            <p className="text-xs text-muted">Administrator</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-muted transition hover:border-accent hover:text-accent"
          >
            <ExternalLink size={15} />
            Site
          </a>
          <form action={signOut}>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-muted transition hover:border-red-400/60 hover:text-red-400">
              <LogOut size={15} />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({
  email,
  unread,
  profiles,
  active,
  current,
  children,
}: {
  email: string;
  unread: number;
  profiles: P[];
  active: string;
  current: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const seg = pathname.split("/")[2] ?? "";
  const title = seg ? titles[seg] ?? "Admin" : "Dashboard";
  const liveLabel = profiles.find((p) => p.id === active)?.label ?? "";
  const previewHref = current === active ? "/" : `/?profile=${current}`;

  // page badalne par: upar scroll, drawer band, progress line band
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setOpen(false);
    setNavigating(false);
  }, [pathname]);

  // admin ke kisi bhi link par click karte hi progress line shuru
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (a.target === "_blank" || !href.startsWith("/admin")) return;
      if (href.split("#")[0].split("?")[0] === pathname) return;
      setNavigating(true);
      clearTimeout(timer);
      timer = setTimeout(() => setNavigating(false), 8000);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const body = { email, unread, profiles, active, current };

  return (
    <AdminProvider>
      {/* navigation progress line */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            key="bar"
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: "85%" }}
            exit={{ opacity: 0 }}
            transition={{
              width: { duration: 6, ease: "easeOut" },
              opacity: { duration: 0.25 },
            }}
            className="fixed left-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-accent to-accent-2 shadow-[0_0_12px_var(--accent)]"
          />
        )}
      </AnimatePresence>

      <div className="flex h-dvh overflow-hidden bg-bg">
        {/* desktop sidebar */}
        <aside className="hidden w-[19.5rem] shrink-0 border-r border-white/10 bg-surface/70 lg:block">
          <SidebarBody {...body} prefix="d" />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* top bar */}
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-bg px-4 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition active:scale-95 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <p className="min-w-0 flex-1 truncate text-[15px] text-muted">
              Admin <span className="mx-1.5 text-white/20">/</span>
              <span className="font-medium text-fg">{title}</span>
            </p>

            <span className="hidden items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 font-mono text-xs text-green-400 md:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              Live: {liveLabel}
            </span>

            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3.5 py-2 text-sm transition hover:border-accent hover:text-accent"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Preview</span>
            </a>
          </header>

          {/* main: yahi scroll hota hai */}
          <main
            ref={mainRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mx-auto w-full max-w-5xl p-5 sm:p-8 lg:p-10"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="ov"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              key="dr"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-[21rem] border-r border-white/10 bg-surface shadow-2xl shadow-black/60 lg:hidden"
            >
              <SidebarBody
                {...body}
                prefix="m"
                onNavigate={() => setOpen(false)}
                onClose={() => setOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AdminProvider>
  );
}