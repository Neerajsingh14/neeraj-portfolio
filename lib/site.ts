import { createClient } from "@supabase/supabase-js";
import type {
  Certificate,
  Experience,
  Profile,
  Project,
  RoleRow,
  SiteData,
  Skill,
} from "./types";

type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tech: string[] | null;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  role_label: string | null;
  duration: string | null;
  roles: string[] | null;
  visible: boolean;
};

type SkillRow = {
  id: string;
  name: string;
  roles: string[] | null;
  visible: boolean;
};

type ExperienceRow = {
  id: string;
  company: string;
  position: string | null;
  period: string | null;
  description: string | null;
  roles: string[] | null;
  visible: boolean;
};

type CertRow = {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  url: string | null;
  image_url: string | null;
  roles: string[] | null;
  visible: boolean;
};

const has = (roles: string[] | null, slug: string) =>
  (roles ?? []).includes(slug);

export async function getSiteData(): Promise<SiteData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase keys missing in .env.local (restart the server)");
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const [settingsRes, rolesRes, profileRes, projectsRes, skillsRes, expRes, certRes] =
    await Promise.all([
      supabase.from("settings").select("*").eq("id", 1).single(),
      supabase.from("roles").select("*").order("sort"),
      supabase.from("profile").select("*").eq("id", 1).single(),
      supabase.from("projects").select("*").order("sort"),
      supabase.from("skills").select("*").order("sort"),
      supabase.from("experience").select("*").order("sort"),
      supabase.from("certificates").select("*").order("sort"),
    ]);

  for (const r of [settingsRes, rolesRes, profileRes, projectsRes, skillsRes, expRes, certRes]) {
    if (r.error) throw new Error(`Supabase: ${r.error.message}`);
  }

  const roles = rolesRes.data as RoleRow[];
  const activeSlug = settingsRes.data?.active_role as string | null;
  const role = roles.find((r) => r.slug === activeSlug) ?? roles[0];

  const projects: Project[] = (projectsRes.data as ProjectRow[])
    .filter((p) => p.visible && has(p.roles, role.slug))
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      category: p.category ?? "Project",
      tech: p.tech ?? [],
      image: p.image_url ?? undefined,
      liveUrl: p.live_url ?? "#",
      githubUrl: p.github_url ?? undefined,
      roleLabel: p.role_label ?? role.title,
      duration: p.duration ?? "",
    }));

  const skills: Skill[] = (skillsRes.data as SkillRow[])
    .filter((s) => s.visible && has(s.roles, role.slug))
    .map((s) => ({ id: s.id, name: s.name }));

  const experience: Experience[] = (expRes.data as ExperienceRow[])
    .filter((e) => e.visible && has(e.roles, role.slug))
    .map((e) => ({
      id: e.id,
      company: e.company,
      position: e.position ?? "",
      period: e.period ?? "",
      description: e.description ?? "",
    }));

  const certificates: Certificate[] = (certRes.data as CertRow[])
    .filter((c) => c.visible && has(c.roles, role.slug))
    .map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer ?? "",
      year: c.year ?? "",
      url: c.url ?? undefined,
      image: c.image_url ?? undefined,
    }));

  return {
    role,
    profile: profileRes.data as Profile,
    projects,
    skills,
    experience,
    certificates,
    sections: settingsRes.data?.sections ?? {},
  };
}