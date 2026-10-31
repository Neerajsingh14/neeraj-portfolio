"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Award,
  Briefcase, FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  ListChecks,
  Mail,
  Rocket,
  Settings,
  Sparkles,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useAdmin } from "./AdminContext";

type Item = { href: string; label: string; icon: LucideIcon };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Content",
    items: [
      { href: "/admin/hero", label: "Hero", icon: Sparkles },
      { href: "/admin/about", label: "About", icon: User },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/skills", label: "Skills", icon: Wrench },
      { href: "/admin/projects", label: "Projects", icon: Rocket },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/admin/sections", label: "Section headings", icon: ListChecks },
      { href: "/admin/profiles", label: "Profiles", icon: Layers }, { href: "/admin/resume", label: "Resume", icon: FileText },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    title: "Inbox",
    items: [{ href: "/admin/messages", label: "Messages", icon: Mail }],
  },
];

export default function AdminNav({
  unread,
  idPrefix,
  onNavigate,
}: {
  unread: number;
  idPrefix: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { confirmLeave } = useAdmin();

  const isOn = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  const item = (it: Item) => {
    const Icon = it.icon;
    const on = isOn(it.href);
    return (
      <Link
        key={it.href}
        href={it.href}
        onClick={(e) => {
          if (!confirmLeave()) {
            e.preventDefault();
            return;
          }
          onNavigate?.();
        }}
        className={`group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-[15px] transition-colors ${
          on ? "text-fg" : "text-muted hover:bg-white/5 hover:text-fg"
        }`}
      >
        {on && (
          <motion.span
            layoutId={`${idPrefix}-nav`}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute inset-0 rounded-xl bg-accent/15 ring-1 ring-accent/30"
          >
            <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-accent" />
          </motion.span>
        )}
        <span
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
            on
              ? "bg-accent/20 text-accent"
              : "bg-white/5 group-hover:bg-white/10"
          }`}
        >
          <Icon size={17} />
        </span>
        <span className="relative min-w-0 flex-1 truncate">{it.label}</span>
        {it.href === "/admin/messages" && unread > 0 && (
          <span className="relative rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] font-semibold text-accent-fg">
            {unread}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {item({ href: "/admin", label: "Dashboard", icon: LayoutDashboard })}
      </div>

      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-1">
          <p className="px-2.5 pb-1 font-mono text-[11px] uppercase tracking-widest text-muted/60">
            {g.title}
          </p>
          {g.items.map(item)}
        </div>
      ))}
    </div>
  );
}