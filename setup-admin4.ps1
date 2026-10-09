function W($path, $content) {
    $full = Join-Path (Get-Location) $path
    $dir = Split-Path $full
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    [System.IO.File]::WriteAllText($full, $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "written: $path"
}

# ================= SITE SMOOTH SCROLL: admin me band =================
W "components/SmoothScroll.tsx" @'
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

type W = Window & { __lenis?: Lenis };

// Lenis sirf public site par chalta hai. Admin me ye wheel scroll rok deta tha
// (sidebar scroll nahi hota tha), isliye /admin par band.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const off = pathname.startsWith("/admin");

  useEffect(() => {
    if (off) return;

    const lenis = new Lenis({ duration: 1.2 });
    (window as W).__lenis = lenis;

    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      delete (window as W).__lenis;
    };
  }, [off]);

  return <>{children}</>;
}
'@

# ================= ADMIN ROOT (bada font, dark scrollbar) =================
W "app/admin/layout.tsx" @'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Portfolio",
  robots: { index: false, follow: false },
};

// Sirf admin pages par lagta hai: bada font, dark scrollbar aur dark dropdowns
const css = `
html{font-size:16.5px;color-scheme:dark}
@media (max-width:640px){html{font-size:16px}}
*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px;border:2px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.3);background-clip:content-box}
`;

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{css}</style>
      {children}
    </>
  );
}
'@

# ================= DATA (ek request me ek hi baar fetch) =================
W "lib/admin-data.ts" @'
import { cache } from "react";
import { cookies } from "next/headers";
import { supabaseServer } from "./supabase-server";
import { globalFrom, loadStore, metaFrom, profileFrom } from "./content";

// cache sirf render ke liye (layout aur page ek hi fetch share karte hain).
// Server actions seedha loadStore use karte hain, isliye stale data nahi aata.
const getStore = cache(loadStore);

export const getAdminCtx = cache(async () => {
  const store = await getStore();
  const meta = metaFrom(store);
  const c = (await cookies()).get("admin_profile")?.value;
  const pid = meta.profiles.some((p) => p.id === c) ? (c as string) : meta.active;
  return { store, meta, pid, ...profileFrom(store, pid), global: globalFrom(store) };
});

export async function unreadCount() {
  try {
    const sb = await supabaseServer();
    const { count } = await sb
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export type RecentMsg = {
  id: string;
  name: string;
  email: string;
  reason: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export async function recentMessages(limit = 4): Promise<RecentMsg[]> {
  try {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("messages")
      .select("id,name,email,reason,message,read,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as RecentMsg[];
  } catch {
    return [];
  }
}
'@

# ================= SCHEMAS (groups ke saath) =================
W "lib/admin-schemas.ts" @'
import { blank } from "./content-types";

export type Field =
  | {
      key: string;
      label: string;
      type: "text" | "url" | "textarea" | "tags" | "lines" | "color" | "toggle";
      placeholder?: string;
      hint?: string;
      half?: boolean;
      group?: string;
    }
  | {
      key: string;
      label: string;
      type: "image";
      folder: string;
      hint?: string;
      half?: boolean;
      group?: string;
    };

type Extra = { placeholder?: string; hint?: string; half?: boolean; group?: string };
const f = (
  type: "text" | "url" | "textarea" | "tags" | "lines" | "color" | "toggle",
  key: string,
  label: string,
  x: Extra = {}
): Field => ({ type, key, label, ...x }) as Field;
const img = (
  key: string,
  label: string,
  folder: string,
  hint?: string,
  group?: string
): Field => ({ type: "image", key, label, folder, hint, group });

const heroFields: Field[] = [
  f("text", "badge", "Availability badge", {
    group: "Intro",
    hint: "Upar wale green badge ka text",
  }),
  f("text", "greeting", "Greeting", { half: true, placeholder: "Hi, I'm" }),
  f("text", "name", "Full name", { half: true }),
  f("text", "role", "Role / title", { half: true }),
  f("text", "location", "Location", { half: true }),
  f("lines", "phrases", "Rotating line (I build ...)", {
    group: "Rotating line and tech",
    hint: "Ek line = ek phrase. Ye apne aap badalte rehte hain",
  }),
  f("tags", "stack", "Tech chips (code card aur mobile)", {
    hint: "Enter se add. Pehle 3 code card me dikhte hain",
  }),
  img(
    "photo",
    "Profile photo",
    "profile",
    "Code card ke header me chhota gol avatar. Khali rahe to initials dikhte hain",
    "Photo"
  ),
];

const aboutFields: Field[] = [
  f("lines", "paragraphs", "About paragraphs", {
    group: "Story",
    hint: "Ek line = ek paragraph",
  }),
  f("lines", "facts", "Quick facts", {
    group: "Facts card",
    hint: "Ek line = ek fact, is format me: Label: Value",
  }),
];

const experienceFields: Field[] = [
  f("text", "position", "Position", { group: "Role" }),
  f("text", "company", "Company", { half: true }),
  f("text", "type", "Type", { half: true, placeholder: "Internship / Full-time" }),
  f("text", "period", "Period", { group: "When and where", half: true, placeholder: "Feb 2026 - May 2026" }),
  f("text", "duration", "Duration", { half: true, placeholder: "4 mos" }),
  f("text", "location", "Location", { half: true }),
  f("text", "mode", "Mode", { half: true, placeholder: "Remote / On-site" }),
  f("textarea", "description", "Description", { group: "Details" }),
  f("lines", "points", "Bullet points", { hint: "Ek line = ek bullet (optional)" }),
  f("tags", "tags", "Tags"),
  f("toggle", "visible", "Show on site"),
];

const skillFields: Field[] = [
  f("text", "name", "Skill", { half: true }),
  f("text", "group", "Group", {
    half: true,
    hint: "Jaise Frontend, Backend & Database. Same naam = ek tab",
  }),
  f("text", "icon", "Icon (optional)", {
    half: true,
    hint: "Khali rahe to naam se logo apne aap milta hai. Devicon slug likh sakte ho",
  }),
  f("toggle", "visible", "Show on site", { half: true }),
];

const projectFields: Field[] = [
  f("text", "title", "Title", { group: "Basics" }),
  f("tags", "categories", "Categories", {
    half: true,
    hint: "Pehli category card pe dikhegi, baaki filter ke liye",
  }),
  f("text", "period", "Period", { half: true, placeholder: "Feb 2026 - May 2026" }),
  f("textarea", "description", "Description", { group: "Details" }),
  f("lines", "highlights", "Highlights", { hint: "Ek line = ek bullet" }),
  f("tags", "tech", "Tech stack"),
  f("url", "live", "Live demo link", {
    group: "Links",
    half: true,
    hint: "Khali rahe to button grey rahega",
    placeholder: "https://",
  }),
  f("url", "github", "GitHub link", { half: true, placeholder: "https://github.com/" }),
  img(
    "image",
    "Screenshot",
    "projects",
    "Lambi full-page screenshot best hai, hover par neeche tak scroll hoti hai",
    "Preview"
  ),
  f("toggle", "visible", "Show on site"),
];

const educationFields: Field[] = [
  f("text", "short", "Short name", { group: "Degree", half: true, placeholder: "MCA" }),
  f("text", "degree", "Degree", { half: true }),
  f("text", "school", "School / University"),
  f("text", "start", "Start year", { group: "Duration and score", half: true }),
  f("text", "end", "End year", { half: true }),
  f("text", "score", "Score", { half: true, hint: "Number likho, jaise 8.9" }),
  f("text", "label", "Score label", { half: true, placeholder: "Final CGPA" }),
  f("toggle", "visible", "Show on site"),
];

const certificateFields: Field[] = [
  f("text", "title", "Title", { group: "Certificate" }),
  f("text", "issuer", "Issuer", { half: true, placeholder: "Oracle" }),
  f("text", "tag", "Tag", { half: true, placeholder: "AI & Cloud" }),
  f("text", "issued", "Issued", { group: "Dates and proof", half: true, placeholder: "Oct 2025" }),
  f("text", "expires", "Valid till", { half: true, hint: "Optional" }),
  f("text", "credentialId", "Credential ID", { hint: "Optional, copy button ke saath dikhega" }),
  f("url", "url", "Verify link", { hint: "Optional", placeholder: "https://" }),
  f("color", "color", "Accent color", { group: "Look", half: true }),
  f("toggle", "visible", "Show on site", { half: true }),
];

const SEC = [
  ["about", "About"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["certificates", "Certificates"],
  ["contact", "Contact"],
] as const;

const sectionFields: Field[] = SEC.flatMap(([k, n]) => [
  f("toggle", `${k}_show`, `Show ${n} section`, { group: n }),
  f("text", `${k}_title`, `${n} heading`, { half: true }),
  f("text", `${k}_subtitle`, `${n} subtitle`, { half: true }),
]);

const settingsFields: Field[] = [
  f("text", "brand", "Logo text", { group: "Brand", half: true, hint: "Navbar me <Naam/> wala" }),
  f("text", "name", "Full name", { half: true }),
  f("text", "email", "Email", { group: "Contact", half: true }),
  f("text", "phone", "Phone", { half: true }),
  f("text", "whatsapp", "WhatsApp number", {
    half: true,
    hint: "Country code ke saath, bina + ya space ke. Jaise 918769667289",
  }),
  f("text", "location", "Location", { half: true }),
  f("url", "github", "GitHub", { group: "Social links", half: true }),
  f("url", "linkedin", "LinkedIn", { half: true }),
  f("url", "instagram", "Instagram", { half: true }),
  f("text", "resume", "Resume link", {
    group: "Resume",
    hint: "public folder ka path (jaise /Neeraj_Singh_Rajpurohit_Resume.pdf) ya poora link",
  }),
];

export type SectionCfg = {
  kind: "object" | "list";
  global?: boolean;
  title: string;
  description: string;
  fields: Field[];
  noun?: string;
  titleKey?: string;
  subtitleKey?: string;
  thumbKey?: string;
  blank?: Record<string, unknown>;
};

export const SECTIONS: Record<string, SectionCfg> = {
  hero: {
    kind: "object",
    title: "Hero",
    description: "Site ke sabse upar wala hissa: naam, role, rotating line aur photo.",
    fields: heroFields,
  },
  about: {
    kind: "object",
    title: "About",
    description: "Tumhare baare me text aur quick facts.",
    fields: aboutFields,
  },
  experience: {
    kind: "list",
    title: "Experience",
    description: "Jobs aur internships. Upar wala pehle dikhta hai.",
    noun: "experience",
    fields: experienceFields,
    blank: blank.experience,
    titleKey: "position",
    subtitleKey: "company",
  },
  skills: {
    kind: "list",
    title: "Skills",
    description: "Har skill ek item hai. Group se tabs bante hain.",
    noun: "skill",
    fields: skillFields,
    blank: blank.skills,
    titleKey: "name",
    subtitleKey: "group",
  },
  projects: {
    kind: "list",
    title: "Projects",
    description: "Add, edit, hide ya delete karo. Screenshot upload bhi yahin se.",
    noun: "project",
    fields: projectFields,
    blank: blank.projects,
    titleKey: "title",
    subtitleKey: "period",
    thumbKey: "image",
  },
  education: {
    kind: "list",
    title: "Education",
    description: "Degrees. Site par saal ke hisaab se left se right dikhte hain.",
    noun: "education",
    fields: educationFields,
    blank: blank.education,
    titleKey: "degree",
    subtitleKey: "school",
  },
  certificates: {
    kind: "list",
    title: "Certificates",
    description: "Add, edit, hide ya delete karo.",
    noun: "certificate",
    fields: certificateFields,
    blank: blank.certificates,
    titleKey: "title",
    subtitleKey: "issuer",
  },
  sections: {
    kind: "object",
    title: "Section headings",
    description: "Har section ka title, subtitle aur show/hide.",
    fields: sectionFields,
  },
  settings: {
    kind: "object",
    global: true,
    title: "Site settings",
    description: "Ye sab profiles me common hai: naam, contact aur social links.",
    fields: settingsFields,
  },
};
'@

# ================= ADMIN: SHARED UI =================
W "components/admin/AdminContext.tsx" @'
"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

type Kind = "ok" | "err";
type ToastItem = { id: number; kind: Kind; text: string };

type Ctx = {
  toast: (kind: Kind, text: string) => void;
  setDirty: (v: boolean) => void;
  confirmLeave: () => boolean;
};

const AdminCtx = createContext<Ctx | null>(null);

export function useAdmin() {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("useAdmin must be used inside AdminProvider");
  return v;
}

// editor ke unsaved changes ka track (page chhodte waqt warning)
export function useDirtyGuard(dirty: boolean) {
  const { setDirty } = useAdmin();

  useEffect(() => {
    setDirty(dirty);
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty, setDirty]);

  useEffect(() => () => setDirty(false), [setDirty]);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dirtyRef = useRef(false);
  const idRef = useRef(0);

  const toast = useCallback((kind: Kind, text: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      kind === "err" ? 5500 : 3000
    );
  }, []);

  const setDirty = useCallback((v: boolean) => {
    dirtyRef.current = v;
  }, []);

  const confirmLeave = useCallback(
    () =>
      !dirtyRef.current ||
      window.confirm("Unsaved changes hain. Page chhod kar jaana hai?"),
    []
  );

  const value = useMemo(
    () => ({ toast, setDirty, confirmLeave }),
    [toast, setDirty, confirmLeave]
  );

  return (
    <AdminCtx.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-surface p-4 shadow-2xl shadow-black/50 ${
                t.kind === "ok" ? "border-green-400/30" : "border-red-400/40"
              }`}
            >
              {t.kind === "ok" ? (
                <CircleCheck size={20} className="mt-0.5 shrink-0 text-green-400" />
              ) : (
                <CircleAlert size={20} className="mt-0.5 shrink-0 text-red-400" />
              )}
              <p className="min-w-0 flex-1 text-sm leading-relaxed">{t.text}</p>
              <button
                onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
                aria-label="Dismiss"
                className="text-muted transition hover:text-fg"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminCtx.Provider>
  );
}
'@

W "components/admin/ui.tsx" @'
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
    <div className="sticky bottom-4 z-20 mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-surface/95 p-3 pl-5 shadow-2xl shadow-black/50 backdrop-blur">
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
'@

W "components/admin/FormKit.tsx" @'
"use client";
import { Fragment, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { Field } from "@/lib/admin-schemas";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-3 text-[15px] outline-none transition placeholder:text-muted/60 hover:border-white/20 focus:border-accent focus:ring-4 focus:ring-accent/10";

/* save se pehle khali lines hatana aur text trim karna */
export function cleanForSave<T extends Record<string, unknown>>(
  fields: Field[],
  obj: T
): T {
  const out: Record<string, unknown> = { ...obj };
  for (const f of fields) {
    const v = out[f.key];
    if (f.type === "lines" && Array.isArray(v)) {
      out[f.key] = v.map((s) => String(s).trim()).filter(Boolean);
    } else if (
      (f.type === "text" || f.type === "url" || f.type === "textarea") &&
      typeof v === "string"
    ) {
      out[f.key] = v.trim();
    }
  }
  return out as T;
}

/* ---------------- tags ---------------- */
function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    parts.forEach((p) => {
      if (!next.includes(p)) next.push(p);
    });
    onChange(next);
    setDraft("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-bg/60 p-2.5 transition hover:border-white/20 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-sm text-accent"
        >
          {t}
          <button
            type="button"
            aria-label={`Remove ${t}`}
            onClick={() => onChange(value.filter((x) => x !== t))}
            className="opacity-70 transition hover:opacity-100"
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length ? "" : placeholder ?? "Type and press Enter"}
        className="min-w-[140px] flex-1 bg-transparent px-2 py-1 text-[15px] outline-none placeholder:text-muted/60"
      />
    </div>
  );
}

/* ---------------- image upload (drag and drop) ---------------- */
function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (v: string) => void;
  folder: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  const upload = async (file: File) => {
    setErr("");
    if (!file.type.startsWith("image/")) {
      setErr("Sirf image file chuno");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr("Image 10MB se choti honi chahiye");
      return;
    }

    setBusy(true);
    const sb = supabaseBrowser();
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${folder}/${Date.now()}-${safe}`;

    const { error } = await sb.storage
      .from("portfolio")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }

    const { data } = sb.storage.from("portfolio").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`flex flex-col gap-4 rounded-2xl border border-dashed p-4 transition sm:flex-row sm:items-center ${
          drag ? "border-accent bg-accent/10" : "border-white/15 bg-bg/40"
        }`}
      >
        <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-bg/60 sm:w-52">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <Upload size={26} className="text-muted/60" />
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 size={24} className="animate-spin" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {busy ? "Uploading..." : "Drag and drop an image here"}
          </p>
          <p className="mt-1 text-xs text-muted">PNG, JPG or WebP, 10MB tak</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm transition hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <ImagePlus size={16} />
              {value ? "Replace image" : "Browse files"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-red-400/60 hover:text-red-400"
              >
                <Trash2 size={16} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ya image ka link / path likho (jaise /projects/shot.png)"
        className={inputCls}
      />
      {err && <p className="text-sm text-red-400">{err}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------- ek field ---------------- */
export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const text = typeof value === "string" ? value : "";
  const list = Array.isArray(value) ? (value as string[]) : [];

  let control: React.ReactNode = null;
  let extra: React.ReactNode = null;

  switch (field.type) {
    case "text":
    case "url":
      control = (
        <input
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          inputMode={field.type === "url" ? "url" : undefined}
          className={inputCls}
        />
      );
      break;

    case "textarea":
      control = (
        <textarea
          rows={5}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${inputCls} resize-y leading-relaxed`}
        />
      );
      break;

    case "lines": {
      const n = list.filter((s) => s.trim()).length;
      control = (
        <textarea
          rows={5}
          value={list.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={field.placeholder}
          className={`${inputCls} resize-y leading-relaxed`}
        />
      );
      extra = <span className="font-mono text-xs text-muted">{n} lines</span>;
      break;
    }

    case "tags":
      control = (
        <TagsInput value={list} onChange={onChange} placeholder={field.placeholder} />
      );
      break;

    case "color": {
      const hex = /^#[0-9a-fA-F]{6}$/.test(text) ? text : "#38bdf8";
      control = (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
          />
          <input
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#38bdf8"
            className={inputCls}
          />
        </div>
      );
      break;
    }

    case "toggle":
      control = (
        <button
          type="button"
          role="switch"
          aria-checked={value === true}
          onClick={() => onChange(!(value === true))}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-bg/60 px-4 py-3 transition hover:border-white/20"
        >
          <span
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              value === true ? "bg-accent" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                value === true ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
          <span className="text-[15px]">
            {value === true ? "Visible on site" : "Hidden"}
          </span>
        </button>
      );
      break;

    case "image":
      control = (
        <ImageField value={text} onChange={onChange} folder={field.folder} />
      );
      break;
  }

  return (
    <div className={field.half ? "" : "sm:col-span-2"}>
      <div className="mb-2 flex items-end justify-between gap-3">
        <span className="text-sm font-medium">{field.label}</span>
        {extra}
      </div>
      {control}
      {field.hint && (
        <p className="mt-2 text-xs leading-relaxed text-muted/80">{field.hint}</p>
      )}
    </div>
  );
}

/* ---------------- fields ka grid (group headings ke saath) ---------------- */
export function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Record<string, unknown>;
  onChange: (key: string, v: unknown) => void;
}) {
  let last = "";
  return (
    <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
      {fields.map((f) => {
        const head = f.group && f.group !== last ? f.group : null;
        if (f.group) last = f.group;
        return (
          <Fragment key={f.key}>
            {head && (
              <div className="flex items-center gap-3 pt-3 first:pt-0 sm:col-span-2">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  {head}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            )}
            <FieldRenderer
              field={f}
              value={values[f.key]}
              onChange={(v) => onChange(f.key, v)}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
'@

# ================= ADMIN: SHELL, NAV, SWITCHER =================
W "components/admin/AdminNav.tsx" @'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Award,
  Briefcase,
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
      { href: "/admin/profiles", label: "Profiles", icon: Layers },
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
        className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] transition-colors ${
          on ? "text-fg" : "text-muted hover:bg-white/5 hover:text-fg"
        }`}
      >
        {on && (
          <motion.span
            layoutId={`${idPrefix}-nav`}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute inset-0 rounded-xl bg-accent/15 ring-1 ring-accent/30"
          />
        )}
        <Icon size={18} className={`relative ${on ? "text-accent" : ""}`} />
        <span className="relative">{it.label}</span>
        {it.href === "/admin/messages" && unread > 0 && (
          <span className="relative ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] font-semibold text-accent-fg">
            {unread}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {item({ href: "/admin", label: "Dashboard", icon: LayoutDashboard })}
      </div>
      {groups.map((g) => (
        <div key={g.title} className="space-y-1">
          <p className="px-3.5 pb-1 font-mono text-[11px] uppercase tracking-widest text-muted/60">
            {g.title}
          </p>
          {g.items.map(item)}
        </div>
      ))}
    </div>
  );
}
'@

W "components/admin/ProfileSwitcher.tsx" @'
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
'@

W "components/admin/AdminShell.tsx" @'
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
          <p className="font-mono text-xl font-bold">
            <span className="text-accent">&lt;</span>Admin
            <span className="text-accent">/&gt;</span>
          </p>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-muted transition hover:text-fg"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <ProfileSwitcher profiles={profiles} active={active} current={current} />
      </div>

      {/* menu: yahi scroll hota hai */}
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
        <AdminNav unread={unread} idPrefix={prefix} onNavigate={onNavigate} />
      </nav>

      {/* user + actions */}
      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-accent-fg">
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
  const mainRef = useRef<HTMLElement>(null);

  const seg = pathname.split("/")[2] ?? "";
  const title = seg ? titles[seg] ?? "Admin" : "Dashboard";
  const liveLabel = profiles.find((p) => p.id === active)?.label ?? "";
  const previewHref = current === active ? "/" : `/?profile=${current}`;

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const body = {
    email,
    unread,
    profiles,
    active,
    current,
  };

  return (
    <AdminProvider>
      <div className="flex h-dvh overflow-hidden bg-bg">
        {/* desktop sidebar */}
        <aside className="hidden w-[19rem] shrink-0 border-r border-white/10 bg-surface/60 lg:block">
          <SidebarBody {...body} prefix="d" />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* top bar */}
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-bg/80 px-4 backdrop-blur sm:px-6">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
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
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-[20rem] border-r border-white/10 bg-surface shadow-2xl shadow-black/60 lg:hidden"
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
'@

# ================= ADMIN: EDITORS =================
W "components/admin/ObjectEditor.tsx" @'
"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, RotateCcw, Save, Undo2 } from "lucide-react";
import { resetContent, saveContent } from "@/lib/actions";
import type { Field } from "@/lib/admin-schemas";
import { cleanForSave, FieldGrid } from "./FormKit";
import { useAdmin, useDirtyGuard } from "./AdminContext";
import { ActionBar, btnGhost, btnPrimary, PageHeader, StatusDot } from "./ui";

export default function ObjectEditor({
  sectionKey,
  eyebrow,
  title,
  description,
  fields,
  initial,
  isCustom,
  previewHref,
}: {
  sectionKey: string;
  eyebrow: string;
  title: string;
  description: string;
  fields: Field[];
  initial: Record<string, unknown>;
  isCustom: boolean;
  previewHref?: string;
}) {
  const { toast } = useAdmin();
  const [data, setData] = useState<Record<string, unknown>>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [pending, start] = useTransition();

  const dirty = JSON.stringify(data) !== saved;
  useDirtyGuard(dirty);

  const set = (key: string, value: unknown) =>
    setData((d) => ({ ...d, [key]: value }));

  const save = () =>
    start(async () => {
      const clean = cleanForSave(fields, data);
      const res = await saveContent(sectionKey, clean);
      if (res.ok) {
        setData(clean);
        setSaved(JSON.stringify(clean));
        toast("ok", "Saved. Site update ho gayi.");
      } else {
        toast("err", res.error ?? "Save nahi hua");
      }
    });

  const discard = () => setData(JSON.parse(saved) as Record<string, unknown>);

  const reset = () => {
    if (!confirm("Saare badlav hata kar default content wapas lagayen?")) return;
    start(async () => {
      const res = await resetContent(sectionKey);
      if (res.ok) window.location.reload();
      else toast("err", res.error ?? "Reset nahi hua");
    });
  };

  // Ctrl+S / Cmd+S
  const saveRef = useRef<() => void>(() => {});
  useEffect(() => {
    saveRef.current = () => {
      if (dirty && !pending) save();
    };
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        previewHref={previewHref}
      />

      <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-5 sm:p-8">
        <FieldGrid fields={fields} values={data} onChange={set} />
      </div>

      <ActionBar>
        <StatusDot dirty={dirty} />
        {isCustom && (
          <button onClick={reset} disabled={pending} className={btnGhost}>
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset to default</span>
          </button>
        )}
        {dirty && (
          <button onClick={discard} disabled={pending} className={btnGhost}>
            <Undo2 size={15} />
            Discard
          </button>
        )}
        <button
          onClick={save}
          disabled={!dirty || pending}
          className={btnPrimary}
          title="Ctrl + S"
        >
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save changes
        </button>
      </ActionBar>
    </div>
  );
}
'@

W "components/admin/ListEditor.tsx" @'
"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Undo2,
} from "lucide-react";
import { resetContent, saveContent } from "@/lib/actions";
import type { Field } from "@/lib/admin-schemas";
import { cleanForSave, FieldGrid, inputCls } from "./FormKit";
import { useAdmin, useDirtyGuard } from "./AdminContext";
import { ActionBar, btnGhost, btnPrimary, PageHeader, StatusDot } from "./ui";

type Item = Record<string, unknown> & { id: string };
type Filter = "all" | "visible" | "hidden";

export default function ListEditor({
  sectionKey,
  eyebrow,
  title,
  description,
  noun,
  fields,
  initial,
  blank,
  titleKey,
  subtitleKey,
  thumbKey,
  isCustom,
  previewHref,
}: {
  sectionKey: string;
  eyebrow: string;
  title: string;
  description: string;
  noun: string;
  fields: Field[];
  initial: Record<string, unknown>[];
  blank: Record<string, unknown>;
  titleKey: string;
  subtitleKey?: string;
  thumbKey?: string;
  isCustom: boolean;
  previewHref?: string;
}) {
  const { toast } = useAdmin();
  const [items, setItems] = useState<Item[]>(initial as Item[]);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, start] = useTransition();

  const dirty = JSON.stringify(items) !== saved;
  useDirtyGuard(dirty);

  const hasVisible = items.some((it) => "visible" in it);
  const visibleCount = items.filter((it) => it.visible !== false).length;

  const update = (id: string, key: string, value: unknown) =>
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, [key]: value } : it))
    );

  const add = () => {
    const id = crypto.randomUUID();
    setQ("");
    setFilter("all");
    setItems((list) => [{ ...blank, id } as Item, ...list]);
    setOpen(id);
    setTimeout(
      () =>
        document
          .getElementById(`item-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      80
    );
  };

  const duplicate = (i: number) =>
    setItems((list) => {
      const src = list[i];
      const copy = {
        ...src,
        id: crypto.randomUUID(),
        [titleKey]: `${String(src[titleKey] ?? "")} (copy)`,
      } as Item;
      const next = [...list];
      next.splice(i + 1, 0, copy);
      return next;
    });

  const move = (i: number, dir: -1 | 1) =>
    setItems((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const remove = (i: number) => {
    const name = String(items[i][titleKey] ?? noun);
    if (!confirm(`"${name}" delete karna hai?`)) return;
    setItems((list) => list.filter((_, idx) => idx !== i));
  };

  const save = () =>
    start(async () => {
      const clean = items.map((it) => cleanForSave(fields, it));
      const res = await saveContent(sectionKey, clean);
      if (res.ok) {
        setItems(clean);
        setSaved(JSON.stringify(clean));
        toast("ok", "Saved. Site update ho gayi.");
      } else {
        toast("err", res.error ?? "Save nahi hua");
      }
    });

  const discard = () => setItems(JSON.parse(saved) as Item[]);

  const reset = () => {
    if (!confirm("Saare badlav hata kar default content wapas lagayen?")) return;
    start(async () => {
      const res = await resetContent(sectionKey);
      if (res.ok) window.location.reload();
      else toast("err", res.error ?? "Reset nahi hua");
    });
  };

  // Ctrl+S / Cmd+S
  const saveRef = useRef<() => void>(() => {});
  useEffect(() => {
    saveRef.current = () => {
      if (dirty && !pending) save();
    };
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const needle = q.trim().toLowerCase();
  const rows = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => {
      const text = `${String(it[titleKey] ?? "")} ${
        subtitleKey ? String(it[subtitleKey] ?? "") : ""
      }`.toLowerCase();
      if (needle && !text.includes(needle)) return false;
      if (filter === "visible" && it.visible === false) return false;
      if (filter === "hidden" && it.visible !== false) return false;
      return true;
    });
  const canMove = !needle && filter === "all";

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        previewHref={previewHref}
      />

      {/* toolbar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={add} className={btnPrimary}>
          <Plus size={17} />
          Add {noun}
        </button>

        <div className="relative min-w-[200px] flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${noun}...`}
            className={`${inputCls} !py-2.5 pl-11`}
          />
        </div>

        {hasVisible && (
          <div className="flex rounded-xl border border-white/10 bg-bg/60 p-1">
            {(["all", "visible", "hidden"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3.5 py-1.5 text-sm capitalize transition ${
                  filter === f
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-fg"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 font-mono text-xs text-muted">
        {items.length} total
        {hasVisible ? `, ${visibleCount} visible` : ""}
        {rows.length !== items.length ? `, ${rows.length} shown` : ""}
      </p>

      {/* list */}
      <div className="mt-3 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-[15px] text-muted">
            {items.length === 0
              ? `Abhi koi ${noun} nahi hai. Upar "Add ${noun}" dabao.`
              : "Is search ya filter me kuch nahi mila."}
          </div>
        )}

        {rows.map(({ it, i }) => {
          const isOpen = open === it.id;
          const hidden = it.visible === false;
          const thumb = thumbKey ? String(it[thumbKey] ?? "") : "";
          const name = String(it[titleKey] ?? "") || "Untitled";
          const sub = subtitleKey ? String(it[subtitleKey] ?? "") : "";

          return (
            <motion.div
              key={it.id}
              id={`item-${it.id}`}
              layout="position"
              transition={{ duration: 0.25 }}
              className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${
                isOpen ? "border-accent/50" : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : it.id)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 font-mono text-sm text-muted">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-base font-semibold ${
                        hidden ? "text-muted line-through" : ""
                      }`}
                    >
                      {name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                      {hidden && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase">
                          Hidden
                        </span>
                      )}
                      <span className="truncate">{sub}</span>
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center">
                  {"visible" in it && (
                    <button
                      type="button"
                      onClick={() => update(it.id, "visible", hidden)}
                      aria-label={hidden ? "Show" : "Hide"}
                      title={hidden ? "Show on site" : "Hide from site"}
                      className={iconBtn}
                    >
                      {hidden ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  )}
                  {canMove && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="Move up"
                        className={iconBtn}
                      >
                        <ArrowUp size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        aria-label="Move down"
                        className={iconBtn}
                      >
                        <ArrowDown size={17} />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => duplicate(i)}
                    aria-label="Duplicate"
                    title="Duplicate"
                    className={`${iconBtn} hidden sm:flex`}
                  >
                    <Copy size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Delete"
                    title="Delete"
                    className={`${iconBtn} hover:!text-red-400`}
                  >
                    <Trash2 size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : it.id)}
                    aria-label="Expand"
                    className={iconBtn}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/10 p-5 sm:p-7">
                      <FieldGrid
                        fields={fields}
                        values={it}
                        onChange={(k, v) => update(it.id, k, v)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <ActionBar>
        <StatusDot dirty={dirty} />
        {isCustom && (
          <button onClick={reset} disabled={pending} className={btnGhost}>
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset to default</span>
          </button>
        )}
        {dirty && (
          <button onClick={discard} disabled={pending} className={btnGhost}>
            <Undo2 size={15} />
            Discard
          </button>
        )}
        <button
          onClick={save}
          disabled={!dirty || pending}
          className={btnPrimary}
          title="Ctrl + S"
        >
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save changes
        </button>
      </ActionBar>
    </div>
  );
}
'@

W "components/admin/ProfilesManager.tsx" @'
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  ExternalLink,
  Pencil,
  Plus,
  Radio,
  Trash2,
  X,
} from "lucide-react";
import {
  createProfile,
  deleteProfile,
  renameProfile,
  selectProfile,
  setActiveProfile,
} from "@/lib/actions";
import { inputCls } from "./FormKit";
import { useAdmin } from "./AdminContext";
import { btnGhost, btnPrimary, PageHeader } from "./ui";

type P = { id: string; label: string };
type Res = { ok: boolean; error?: string; id?: string };

export default function ProfilesManager({
  profiles,
  active,
  current,
}: {
  profiles: P[];
  active: string;
  current: string;
}) {
  const router = useRouter();
  const { toast, confirmLeave } = useAdmin();
  const [pending, start] = useTransition();
  const [label, setLabel] = useState("");
  const [from, setFrom] = useState(current);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const run = (fn: () => Promise<Res>, okText: string, after?: () => void) =>
    start(async () => {
      const r = await fn();
      if (r.ok) {
        toast("ok", okText);
        after?.();
        router.refresh();
      } else {
        toast("err", r.error ?? "Failed");
      }
    });

  const create = () =>
    run(
      async () => {
        const r = await createProfile(label, from);
        if (r.ok && r.id) await selectProfile(r.id);
        return r;
      },
      "Profile ban gaya. Ab usi ko edit kar sakte ho.",
      () => setLabel("")
    );

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/?profile=${id}`
      );
      toast("ok", "Link copy ho gaya");
    } catch {
      toast("err", "Copy nahi hua");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Site"
        title="Profiles"
        description='Har profile ka apna hero, about, skills, projects aur baaki sab alag hota hai. Jo "Live" hai wahi site ke mukhya link par dikhta hai.'
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {profiles.map((p) => {
          const live = p.id === active;
          const editing = p.id === current;
          return (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border bg-surface p-5 transition ${
                editing ? "border-accent/50" : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {editId === p.id ? (
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <input
                      autoFocus
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className={`${inputCls} !py-2`}
                    />
                    <button
                      className={btnGhost}
                      disabled={pending}
                      onClick={() =>
                        run(
                          () => renameProfile(p.id, editLabel),
                          "Naam badal gaya",
                          () => setEditId(null)
                        )
                      }
                    >
                      <Check size={15} />
                    </button>
                    <button className={btnGhost} onClick={() => setEditId(null)}>
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">{p.label}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted">
                      ?profile={p.id}
                    </p>
                  </div>
                )}

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/40 bg-green-400/10 px-3 py-1 font-mono text-[11px] text-green-400">
                      <Radio size={12} /> Live
                    </span>
                  )}
                  {editing && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
                      Editing
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {!editing && (
                  <button
                    className={btnGhost}
                    disabled={pending}
                    onClick={() => {
                      if (!confirmLeave()) return;
                      run(() => selectProfile(p.id), "Ab ye profile edit ho raha hai");
                    }}
                  >
                    Edit this
                  </button>
                )}
                {!live && (
                  <button
                    className={btnGhost}
                    disabled={pending}
                    onClick={() =>
                      run(() => setActiveProfile(p.id), "Ye profile ab Live hai")
                    }
                  >
                    Make live
                  </button>
                )}
                <a
                  href={`/?profile=${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={btnGhost}
                >
                  <ExternalLink size={15} />
                  Preview
                </a>
                <button className={btnGhost} onClick={() => copyLink(p.id)}>
                  <Copy size={15} />
                  Copy link
                </button>
                <button
                  className={btnGhost}
                  onClick={() => {
                    setEditId(p.id);
                    setEditLabel(p.label);
                  }}
                >
                  <Pencil size={15} />
                  Rename
                </button>
                {profiles.length > 1 && (
                  <button
                    className={`${btnGhost} hover:!border-red-400/60 hover:!text-red-400`}
                    disabled={pending}
                    onClick={() => {
                      if (
                        confirm(
                          `"${p.label}" profile aur uska saara content delete karna hai?`
                        )
                      )
                        run(() => deleteProfile(p.id), "Profile delete ho gaya");
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <span className="block h-1 bg-gradient-to-r from-accent to-accent-2" />
        <div className="p-5 sm:p-7">
          <p className="text-lg font-semibold">Create new profile</p>
          <p className="mt-1 text-[15px] text-muted">
            Jaise &quot;Frontend Developer&quot;. Ye kisi existing profile ki copy banta
            hai, phir tum alag se badal sakte ho.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Profile name (jaise Frontend Developer)"
              className={inputCls}
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputCls}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  Copy from: {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={create}
            disabled={pending || !label.trim()}
            className={`${btnPrimary} mt-5`}
          >
            <Plus size={17} />
            Create profile
          </button>
        </div>
      </div>
    </div>
  );
}
'@

W "components/admin/MessagesManager.tsx" @'
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCheck,
  Mail,
  MailCheck,
  Reply,
  Send,
  Trash2,
} from "lucide-react";
import { deleteMessage, markMessage, sendTestEmail } from "@/lib/actions";
import { useAdmin } from "./AdminContext";
import { btnGhost, PageHeader } from "./ui";

export type Msg = {
  id: string;
  name: string;
  email: string;
  reason: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg disabled:opacity-40";

export default function MessagesManager({
  messages,
  mailOn,
  to,
}: {
  messages: Msg[];
  mailOn: boolean;
  to: string;
}) {
  const router = useRouter();
  const { toast } = useAdmin();
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const unread = messages.filter((m) => !m.read);
  const list = tab === "unread" ? unread : messages;

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, okText?: string) =>
    start(async () => {
      const r = await fn();
      if (r.ok) {
        if (okText) toast("ok", okText);
        router.refresh();
      } else {
        toast("err", r.error ?? "Failed");
      }
    });

  const markAll = () =>
    start(async () => {
      const results = await Promise.all(unread.map((m) => markMessage(m.id, true)));
      const bad = results.find((r) => !r.ok);
      if (bad) toast("err", bad.error ?? "Failed");
      else toast("ok", "Sab read mark ho gaye");
      router.refresh();
    });

  const test = () =>
    start(async () => {
      const r = await sendTestEmail();
      if (r.ok) toast("ok", "Test mail bhej di. Inbox aur Spam dono check karo.");
      else toast("err", `Mail fail: ${r.error}`);
    });

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Contact form ke saare messages yahan save hote hain."
      />

      {/* mail status */}
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-surface p-5">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            mailOn ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
          }`}
        >
          {mailOn ? <MailCheck size={22} /> : <Mail size={22} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {mailOn ? "Email alerts ON" : "Email alerts OFF"}
          </p>
          <p className="text-sm text-muted">
            {mailOn
              ? `Har naye message par ${to} par mail aayegi.`
              : ".env.local me RESEND_API_KEY aur CONTACT_TO_EMAIL daalo, phir server restart karo."}
          </p>
        </div>
        <button onClick={test} disabled={pending || !mailOn} className={btnGhost}>
          <Send size={15} />
          Send test email
        </button>
      </div>

      {/* tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-white/10 bg-bg/60 p-1">
          {(
            [
              ["all", `All (${messages.length})`],
              ["unread", `Unread (${unread.length})`],
            ] as const
          ).map(([k, text]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg px-4 py-1.5 text-sm transition ${
                tab === k ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
        {unread.length > 0 && (
          <button onClick={markAll} disabled={pending} className={btnGhost}>
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-[15px] text-muted">
            {tab === "unread" ? "Koi unread message nahi." : "Abhi koi message nahi aaya."}
          </div>
        )}

        {list.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border bg-surface p-5 ${
              m.read ? "border-white/10" : "border-accent/40"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-base font-bold text-accent-fg">
                  {(m.name || "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    {!m.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                    <span className="truncate">{m.name}</span>
                  </p>
                  <a
                    href={`mailto:${m.email}`}
                    className="block truncate text-sm text-muted transition hover:text-accent"
                  >
                    {m.email}
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {m.reason && (
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
                    {m.reason}
                  </span>
                )}
                <span
                  suppressHydrationWarning
                  className="font-mono text-xs text-muted"
                >
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-muted">
              {m.message}
            </p>

            <div className="mt-4 flex items-center gap-1">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                className="mr-2 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:brightness-110"
              >
                <Reply size={15} /> Reply
              </a>
              <button
                className={iconBtn}
                disabled={pending}
                title={m.read ? "Mark unread" : "Mark read"}
                onClick={() => act(() => markMessage(m.id, !m.read))}
              >
                <CheckCheck size={17} />
              </button>
              <button
                className={`${iconBtn} hover:!text-red-400`}
                disabled={pending}
                title="Delete"
                onClick={() => {
                  if (confirm("Ye message delete karna hai?"))
                    act(() => deleteMessage(m.id), "Message delete ho gaya");
                }}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
'@

# ================= ADMIN: PAGES =================
W "app/admin/(panel)/layout.tsx" @'
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { getAdminCtx, unreadCount } from "@/lib/admin-data";
import AdminShell from "@/components/admin/AdminShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const [ctx, unread] = await Promise.all([getAdminCtx(), unreadCount()]);

  return (
    <AdminShell
      email={user.email ?? ""}
      unread={unread}
      profiles={ctx.meta.profiles}
      active={ctx.meta.active}
      current={ctx.pid}
    >
      {children}
    </AdminShell>
  );
}
'@

W "app/admin/(panel)/loading.tsx" @'
export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="h-10 w-72 max-w-full rounded bg-white/10" />
      <div className="h-4 w-[28rem] max-w-full rounded bg-white/5" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-white/10 bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
'@

W "app/admin/(panel)/page.tsx" @'
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Eye,
  EyeOff,
  ExternalLink,
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

export default async function AdminHome() {
  const [ctx, unread, recent] = await Promise.all([
    getAdminCtx(),
    unreadCount(),
    recentMessages(4),
  ]);

  const c = ctx.content;
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
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {greet}
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
            Welcome back, {ctx.global.brand}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
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
            const pct = s.total ? Math.round((s.shown / s.total) * 100) : 0;
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
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* sections + side column */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
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
'@

W "app/admin/(panel)/[section]/page.tsx" @'
import { notFound } from "next/navigation";
import ObjectEditor from "@/components/admin/ObjectEditor";
import ListEditor from "@/components/admin/ListEditor";
import { getAdminCtx } from "@/lib/admin-data";
import { SECTIONS } from "@/lib/admin-schemas";
import type { SectionKey } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const ANCHOR: Record<string, string> = {
  about: "about",
  experience: "experience",
  skills: "skills",
  projects: "projects",
  education: "education",
  certificates: "certificates",
};

export default async function SectionAdmin({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const cfg = SECTIONS[section];
  if (!cfg) notFound();

  const ctx = await getAdminCtx();
  const label = ctx.meta.profiles.find((p) => p.id === ctx.pid)?.label ?? ctx.pid;
  const key = cfg.global ? "global" : `${ctx.pid}:${section}`;
  const eyebrow = cfg.global ? "Site-wide" : `Editing - ${label}`;
  const data = (cfg.global
    ? ctx.global
    : ctx.content[section as keyof typeof ctx.content]) as unknown;
  const isCustom = cfg.global ? "global" in ctx.store : ctx.custom[section as SectionKey];

  const base = cfg.global ? "/" : `/?profile=${ctx.pid}`;
  const previewHref = ANCHOR[section] ? `${base}#${ANCHOR[section]}` : base;

  if (cfg.kind === "object") {
    return (
      <ObjectEditor
        key={key}
        sectionKey={key}
        eyebrow={eyebrow}
        title={cfg.title}
        description={cfg.description}
        fields={cfg.fields}
        initial={data as Record<string, unknown>}
        isCustom={isCustom}
        previewHref={previewHref}
      />
    );
  }

  return (
    <ListEditor
      key={key}
      sectionKey={key}
      eyebrow={eyebrow}
      title={cfg.title}
      description={cfg.description}
      noun={cfg.noun ?? "item"}
      fields={cfg.fields}
      initial={data as Record<string, unknown>[]}
      blank={cfg.blank ?? {}}
      titleKey={cfg.titleKey ?? "title"}
      subtitleKey={cfg.subtitleKey}
      thumbKey={cfg.thumbKey}
      isCustom={isCustom}
      previewHref={previewHref}
    />
  );
}
'@

# ================= LOGIN =================
W "app/admin/login/page.tsx" @'
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ImagePlus,
  Layers,
  LoaderCircle,
  Lock,
  Mail,
  MailCheck,
  Pencil,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const features = [
  { icon: Pencil, title: "Edit every section", text: "Hero, projects, skills and more, without touching code." },
  { icon: Layers, title: "Multiple profiles", text: "AI Powered, Frontend, or any role you need." },
  { icon: ImagePlus, title: "Image uploads", text: "Screenshots and photos go straight to storage." },
  { icon: MailCheck, title: "Email alerts", text: "Contact form messages land in your inbox." },
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Wrong email or password");
      setShake((n) => n + 1);
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-bg/60 py-3.5 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-muted/60 hover:border-white/20 focus:border-accent focus:ring-4 focus:ring-accent/10";

  return (
    <main className="grid min-h-screen bg-bg lg:grid-cols-[1.1fr_1fr]">
      {/* LEFT: brand */}
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 420px at 15% 8%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 65%), radial-gradient(600px 400px at 90% 95%, color-mix(in srgb, var(--accent-2) 16%, transparent), transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at 30% 30%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 30%, black, transparent 75%)",
          }}
        />

        <p className="relative font-mono text-2xl font-bold">
          <span className="text-accent">&lt;</span>Admin
          <span className="text-accent">/&gt;</span>
        </p>

        <div className="relative max-w-lg">
          <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
            Your portfolio,{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              fully in your control.
            </span>
          </h2>
          <p className="mt-4 text-base text-muted">
            Update content, switch profiles and read messages from one clean dashboard.
          </p>

          <ul className="mt-9 space-y-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-semibold">{f.title}</span>
                    <span className="block text-sm text-muted">{f.text}</span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* mock preview */}
        <div className="relative max-w-sm rounded-2xl border border-white/10 bg-surface/70 p-4 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-full animate-pulse rounded bg-white/5" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
          </div>
          <div className="mt-4 flex gap-2">
            <span className="rounded-lg bg-accent/20 px-3 py-1 font-mono text-[11px] text-accent">
              Saved
            </span>
            <span className="rounded-lg bg-white/5 px-3 py-1 font-mono text-[11px] text-muted">
              Live on site
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT: form */}
      <section className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xl font-bold lg:invisible">
            <span className="text-accent">&lt;</span>Admin
            <span className="text-accent">/&gt;</span>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <motion.form
            key={shake}
            onSubmit={submit}
            initial={{ opacity: 0, y: 14 }}
            animate={error ? { x: [0, -10, 10, -7, 7, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: error ? 0.4 : 0.5 }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-surface/80 shadow-2xl shadow-black/50"
          >
            <span className="block h-1 bg-gradient-to-r from-accent to-accent-2" />
            <div className="p-7 sm:p-9">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="mt-2 text-[15px] text-muted">
                Login to manage your portfolio.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    required
                    autoFocus
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    required
                    type={show ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`${input} pr-14`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg"
                  >
                    {show ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-fg transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading && <LoaderCircle size={18} className="animate-spin" />}
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
'@

Write-Host ""
Write-Host "DONE. Admin v4 written."git status