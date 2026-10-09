import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Circle,
  CircleCheck,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Mail,
  MailCheck,
  Plus,
  Radio,
  Rocket,
  Settings,
  Sparkles,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getAdminCtx, recentMessages, unreadCount } from "@/lib/admin-data";
import { mailConfigured } from "@/lib/mail";

export const dynamic = "force-dynamic";

const card = "rounded-2xl border border-white/10 bg-surface";
const R = 34;
const C = 2 * Math.PI * R;

export default async function AdminHome() {
  const [ctx, unread, recent] = await Promise.all([
    getAdminCtx(),
    unreadCount(),
    recentMessages(4),
  ]);

  const c = ctx.content;
  const g = ctx.global;
  const live = ctx.meta.profiles.find((p) => p.id === ctx.meta.active);
  const editing = ctx.meta.profiles.find((p) => p.id === ctx.pid);
  const mailOn = mailConfigured();
  const vis = (a: { visible: boolean }[]) => a.filter((x) => x.visible).length;

  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    }).format(new Date())
  );
  const greet =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* ---- setup checklist ---- */
  const missingLive = c.projects.filter((p) => p.visible && !p.live).length;
  const checks = [
    {
      ok: !!c.hero.photo,
      todo: "Add a profile photo",
      done: "Profile photo added",
      href: "/admin/hero",
    },
    {
      ok: c.projects.some((p) => p.visible && p.image),
      todo: "Add a screenshot to a project",
      done: "Project screenshots added",
      href: "/admin/projects",
    },
    {
      ok: missingLive === 0,
      todo: `Add live demo links (${missingLive} project${missingLive === 1 ? "" : "s"} missing)`,
      done: "All projects have live demo links",
      href: "/admin/projects",
    },
    {
      ok: c.about.paragraphs.filter((p) => p.trim()).length >= 2,
      todo: "Write at least 2 About paragraphs",
      done: "About section written",
      href: "/admin/about",
    },
    {
      ok: !!(g.github && g.linkedin && g.instagram),
      todo: "Add all social links",
      done: "Social links added",
      href: "/admin/settings",
    },
    {
      ok: !!g.resume,
      todo: "Add your resume link",
      done: "Resume link added",
      href: "/admin/settings",
    },
    {
      ok: vis(c.certificates) > 0,
      todo: "Add a certificate",
      done: "Certificates added",
      href: "/admin/certificates",
    },
    {
      ok: mailOn,
      todo: "Turn on email alerts",
      done: "Email alerts are on",
      href: "/admin/messages",
    },
  ];
  const doneCount = checks.filter((x) => x.ok).length;
  const pct = Math.round((doneCount / checks.length) * 100);
  const ordered = [...checks.filter((x) => !x.ok), ...checks.filter((x) => x.ok)];

  const stats: {
    label: string;
    shown: number;
    total: number;
    icon: LucideIcon;
    href: string;
  }[] = [
    { label: "Projects", shown: vis(c.projects), total: c.projects.length, icon: Rocket, href: "/admin/projects" },
    { label: "Skills", shown: vis(c.skills), total: c.skills.length, icon: Wrench, href: "/admin/skills" },
    { label: "Experience", shown: vis(c.experience), total: c.experience.length, icon: Briefcase, href: "/admin/experience" },
    { label: "Certificates", shown: vis(c.certificates), total: c.certificates.length, icon: Award, href: "/admin/certificates" },
  ];

  const on = (k: string) => c.sections[`${k}_show`] !== false;
  const sections: {
    label: string;
    icon: LucideIcon;
    href: string;
    count: string;
    show: boolean;
  }[] = [
    { label: "About", icon: User, href: "/admin/about", count: `${c.about.paragraphs.length} paragraphs`, show: on("about") },
    { label: "Experience", icon: Briefcase, href: "/admin/experience", count: `${vis(c.experience)} items`, show: on("experience") },
    { label: "Skills", icon: Wrench, href: "/admin/skills", count: `${vis(c.skills)} skills`, show: on("skills") },
    { label: "Projects", icon: Rocket, href: "/admin/projects", count: `${vis(c.projects)} projects`, show: on("projects") },
    { label: "Education", icon: GraduationCap, href: "/admin/education", count: `${vis(c.education)} degrees`, show: on("education") },
    { label: "Certificates", icon: Award, href: "/admin/certificates", count: `${vis(c.certificates)} certificates`, show: on("certificates") },
    { label: "Contact", icon: Mail, href: "/admin/sections", count: "Form and details", show: on("contact") },
  ];

  const quick: { label: string; note: string; href: string; icon: LucideIcon }[] = [
    { label: "Edit hero", note: "Naam, role, rotating line", href: "/admin/hero", icon: Sparkles },
    { label: "Add project", note: "Screenshot ke saath", href: "/admin/projects", icon: Plus },
    { label: "Add certificate", note: "ID aur verify link", href: "/admin/certificates", icon: Award },
    { label: "New profile", note: "Frontend, AI, aur aur", href: "/admin/profiles", icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* welcome */}
      <div className={`${card} relative overflow-hidden p-6 sm:p-10`}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(620px 280px at 100% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%), radial-gradient(520px 260px at 0% 100%, color-mix(in srgb, var(--accent-2) 12%, transparent), transparent 70%)",
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div className="min-w-0 max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {greet}
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              Welcome back, {g.brand}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">
              Yahan se site ka poora content badlo. Save karte hi public site update ho
              jati hai.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition hover:brightness-110"
              >
                <ExternalLink size={16} />
                View live site
              </a>
              <Link
                href="/admin/profiles"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                <Layers size={16} />
                Manage profiles
              </Link>
            </div>
          </div>

          {/* completeness ring */}
          <div className="flex items-center gap-5">
            <div className="relative h-32 w-32 shrink-0">
              <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="pc-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--accent)" }} />
                    <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
                  </linearGradient>
                </defs>
                <circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="7"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="url(#pc-grad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - pct / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold">{pct}%</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Complete
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold">Profile setup</p>
              <p className="mt-1 text-sm text-muted">
                {doneCount} of {checks.length} done
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* live + editing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${card} flex items-center gap-4 p-5`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
            <Radio size={22} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Live profile
            </p>
            <p className="mt-1 truncate text-lg font-semibold">{live?.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-accent/40 bg-surface p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Settings size={22} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Editing now
            </p>
            <p className="mt-1 truncate text-lg font-semibold">{editing?.label}</p>
          </div>
        </div>
      </div>

      {/* stats */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
          This profile (visible / total)
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            const p = s.total ? Math.round((s.shown / s.total) * 100) : 0;
            return (
              <Link
                key={s.label}
                href={s.href}
                className={`${card} group p-5 transition hover:-translate-y-1 hover:border-accent/50`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon size={19} />
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-muted transition group-hover:text-accent"
                  />
                </div>
                <p className="mt-4 font-display text-3xl font-bold">
                  {s.shown}
                  <span className="text-lg font-medium text-muted"> / {s.total}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted">{s.label}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                    style={{ width: `${p}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* checklist + sections | messages + status */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Setup checklist</p>
              <span className="font-mono text-xs text-muted">
                {doneCount}/{checks.length}
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              {ordered.map((x) => (
                <Link
                  key={x.todo}
                  href={x.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.04]"
                >
                  {x.ok ? (
                    <CircleCheck size={19} className="shrink-0 text-green-400" />
                  ) : (
                    <Circle size={19} className="shrink-0 text-amber-300" />
                  )}
                  <span
                    className={`min-w-0 flex-1 text-[15px] ${
                      x.ok ? "text-muted" : ""
                    }`}
                  >
                    {x.ok ? x.done : x.todo}
                  </span>
                  {!x.ok && (
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-muted transition group-hover:text-accent"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Sections on your site</p>
              <Link
                href="/admin/sections"
                className="text-sm text-accent transition hover:underline"
              >
                Edit headings
              </Link>
            </div>
            <div className="mt-4 divide-y divide-white/10">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="group flex items-center gap-4 py-3.5 transition first:pt-1 last:pb-1"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-muted transition group-hover:bg-accent/15 group-hover:text-accent">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium">{s.label}</span>
                      <span className="block text-sm text-muted">{s.count}</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                        s.show
                          ? "border-green-400/30 bg-green-400/10 text-green-400"
                          : "border-white/10 bg-white/5 text-muted"
                      }`}
                    >
                      {s.show ? <Eye size={12} /> : <EyeOff size={12} />}
                      {s.show ? "Shown" : "Hidden"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* messages */}
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Recent messages</p>
              {unread > 0 && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent-fg">
                  {unread} new
                </span>
              )}
            </div>

            {recent.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Abhi koi message nahi aaya.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recent.map((m) => (
                  <Link
                    key={m.id}
                    href="/admin/messages"
                    className="block rounded-xl bg-white/[0.03] p-3.5 transition hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
                        {!m.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                        )}
                        <span className="truncate">{m.name}</span>
                      </p>
                      <span className="shrink-0 font-mono text-[11px] text-muted">
                        {new Date(m.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          timeZone: "Asia/Kolkata",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{m.message}</p>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/admin/messages"
              className="mt-4 inline-flex items-center gap-2 text-sm text-accent transition hover:underline"
            >
              Open inbox <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* status */}
          <div className={`${card} p-5 sm:p-6`}>
            <p className="font-semibold">System status</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <MailCheck size={16} /> Email alerts
                </span>
                <span
                  className={`font-mono text-xs ${
                    mailOn ? "text-green-400" : "text-amber-300"
                  }`}
                >
                  {mailOn ? "ON" : "Setup baaki"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Layers size={16} /> Profiles
                </span>
                <span className="font-mono text-xs">{ctx.meta.profiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Mail size={16} /> Unread
                </span>
                <span className="font-mono text-xs">{unread}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
          Quick actions
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.label}
                href={q.href}
                className={`${card} group p-5 transition hover:-translate-y-1 hover:border-accent/50`}
              >
                <Icon size={19} className="text-accent" />
                <p className="mt-3 font-semibold">{q.label}</p>
                <p className="mt-1 text-sm text-muted">{q.note}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}