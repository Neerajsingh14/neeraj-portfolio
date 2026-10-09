import { createClient } from "@supabase/supabase-js";
import * as seed from "./portfolio";
import {
  blank,
  type AboutContent,
  type CertificateItem,
  type EducationItem,
  type ExperienceItem,
  type GlobalContent,
  type HeroContent,
  type ProfileContent,
  type ProjectItem,
  type SectionKey,
  type SectionsContent,
  type SiteMeta,
  type SkillItem,
} from "./content-types";

export type Store = Record<string, unknown>;

// phase 1 me hero/projects/certificates bina profile ke save hue the
const LEGACY: SectionKey[] = ["hero", "projects", "certificates"];

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// raw data ko template ke hisaab se saaf karta hai (galat type ho to default)
function fit<T extends Record<string, unknown>>(raw: unknown, tpl: T): T {
  const r = isObj(raw) ? raw : {};
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(tpl)) {
    const t = tpl[k];
    const v = r[k];
    if (Array.isArray(t)) {
      out[k] = Array.isArray(v) ? v.filter((x) => typeof x === "string") : t;
    } else {
      out[k] = typeof v === typeof t ? v : t;
    }
  }
  return out as T;
}

function list<T extends Record<string, unknown> & { id: string }>(
  raw: unknown,
  tpl: T,
  prefix: string,
  def: T[]
): T[] {
  if (!Array.isArray(raw)) return def;
  return raw.map((r, i) => {
    const o = fit(r, tpl);
    return o.id ? o : { ...o, id: `${prefix}-${i}` };
  });
}

/* ---------- defaults (lib/portfolio.ts se) ---------- */
export const globalDefaults: GlobalContent = {
  brand: seed.profile.shortName,
  name: seed.profile.name,
  email: seed.profile.email,
  phone: seed.profile.phone,
  whatsapp: seed.profile.whatsapp,
  location: seed.profile.location,
  github: seed.profile.github,
  linkedin: seed.profile.linkedin,
  instagram: seed.profile.instagram,
  resume: seed.profile.resume,
};

export const metaDefaults: SiteMeta = {
  active: "main",
  profiles: [{ id: "main", label: "AI Powered Developer" }],
};

export const heroDefaults: HeroContent = {
  badge: "Available for freelance work",
  greeting: "Hi, I'm",
  name: seed.profile.name,
  role: seed.profile.role,
  location: seed.profile.location,
  phrases: [
    "fast React interfaces",
    "Next.js web apps",
    "AI powered products",
    "smooth user experiences",
  ],
  stack: ["React", "Next.js", "Tailwind CSS"],
  photo: seed.profile.photo,
};

export const aboutDefaults: AboutContent = {
  paragraphs: [...seed.aboutParagraphs],
  facts: seed.facts.map((f) => `${f.label}: ${f.value}`),
};

export const experienceDefaults: ExperienceItem[] = seed.experience.map(
  (e, i) => ({
    id: `exp-${i + 1}`,
    company: e.company,
    position: e.position,
    type: e.type,
    mode: e.mode,
    location: e.location,
    period: e.period,
    duration: e.duration,
    description: e.description,
    points: [...(e.points ?? [])],
    tags: [...e.tags],
    visible: true,
  })
);

let skillN = 0;
export const skillsDefaults: SkillItem[] = seed.skillGroups.flatMap((g) =>
  g.items.map((s) => ({
    id: `skill-${++skillN}`,
    name: s.name,
    group: g.title,
    icon: s.icon ?? "",
    visible: true,
  }))
);

export const projectsDefaults: ProjectItem[] = seed.projects.map((p, i) => ({
  id: `project-${i + 1}`,
  title: p.title,
  categories: [...p.categories],
  period: p.period,
  description: p.description,
  highlights: [...p.highlights],
  tech: [...p.tech],
  live: p.live ?? "",
  github: p.github ?? "",
  image: p.image ?? "",
  visible: true,
}));

export const educationDefaults: EducationItem[] = seed.education.map((e, i) => ({
  id: `edu-${i + 1}`,
  short: e.short,
  degree: e.degree,
  school: e.school,
  start: e.start,
  end: e.end,
  score: String(e.score),
  label: e.label,
  visible: true,
}));

export const certificatesDefaults: CertificateItem[] = seed.certificates.map(
  (c, i) => ({
    id: `cert-${i + 1}`,
    title: c.title,
    issuer: c.issuer,
    tag: c.tag,
    color: c.color,
    issued: c.issued,
    expires: c.expires ?? "",
    credentialId: c.credentialId ?? "",
    url: c.url ?? "",
    visible: true,
  })
);

export const sectionsDefaults: SectionsContent = {
  about_show: true,
  about_title: "About me",
  about_subtitle: "",
  experience_show: true,
  experience_title: "Where I've worked",
  experience_subtitle:
    "My professional journey so far, from building user interfaces to guiding students.",
  skills_show: true,
  skills_title: "My tech stack",
  skills_subtitle:
    "Technologies and tools I use to design, build and ship web applications.",
  projects_show: true,
  projects_title: "Things I've built",
  projects_subtitle:
    "Frontend and full stack applications built with React, Spring Boot, PHP and more.",
  education_show: true,
  education_title: "My academic journey",
  education_subtitle:
    "From BCA to MCA, building a strong foundation in computer applications.",
  certificates_show: true,
  certificates_title: "Learning & achievements",
  certificates_subtitle:
    "Industry certifications and courses that sharpen my skills.",
  contact_show: true,
  contact_title: "Let's build something",
  contact_subtitle:
    "I'm available for freelance projects, full-time roles and internships. Message me anywhere and I'll get back to you soon.",
};

/* ---------- store se data nikalna ---------- */
export function globalFrom(store: Store): GlobalContent {
  return fit(store.global, globalDefaults);
}

export function metaFrom(store: Store): SiteMeta {
  const m = isObj(store.site) ? store.site : {};
  const ps = (Array.isArray(m.profiles) ? m.profiles : [])
    .filter(isObj)
    .map((p) => ({
      id: typeof p.id === "string" ? p.id : "",
      label: typeof p.label === "string" && p.label ? p.label : "Profile",
    }))
    .filter((p) => p.id);
  const profiles = ps.length ? ps : metaDefaults.profiles;
  const active = profiles.some((p) => p.id === m.active)
    ? (m.active as string)
    : profiles[0].id;
  return { active, profiles };
}

export function profileFrom(store: Store, pid: string) {
  const custom = {} as Record<SectionKey, boolean>;

  const get = (key: SectionKey): unknown => {
    const k = `${pid}:${key}`;
    if (k in store) {
      custom[key] = true;
      return store[k];
    }
    if (pid === "main" && LEGACY.includes(key) && key in store) {
      custom[key] = true;
      return store[key];
    }
    custom[key] = false;
    return undefined;
  };

  const content: ProfileContent = {
    hero: fit(get("hero"), heroDefaults),
    about: fit(get("about"), aboutDefaults),
    experience: list(get("experience"), blank.experience, "exp", experienceDefaults),
    skills: list(get("skills"), blank.skills, "skill", skillsDefaults),
    projects: list(get("projects"), blank.projects, "project", projectsDefaults),
    education: list(get("education"), blank.education, "edu", educationDefaults),
    certificates: list(get("certificates"), blank.certificates, "cert", certificatesDefaults),
    sections: fit(get("sections"), sectionsDefaults) as SectionsContent,
  };

  return { content, custom };
}

/* ---------- database se padhna (fail ho to {} => defaults) ---------- */
export async function loadStore(): Promise<Store> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};

  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await sb.from("content").select("key,data");
    if (error || !data) return {};
    const out: Store = {};
    for (const row of data) out[row.key as string] = row.data;
    return out;
  } catch {
    return {};
  }
}