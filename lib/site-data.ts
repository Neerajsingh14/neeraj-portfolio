import { globalFrom, loadStore, metaFrom, profileFrom } from "./content";
import { resolveIcon } from "./devicon";
import type { SiteCtx, Skill } from "@/components/SiteProvider";

const initialsOf = (n: string) =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

export async function getSite(profileParam?: string) {
  const store = await loadStore();
  const meta = metaFrom(store);
  const pid =
    profileParam && meta.profiles.some((p) => p.id === profileParam)
      ? profileParam
      : meta.active;
  const { content: c } = profileFrom(store, pid);
  const g = globalFrom(store);

  const experience = c.experience
    .filter((e) => e.visible)
    .map((e) => ({ ...e, initials: initialsOf(e.company) }));

  const groups = new Map<string, Skill[]>();
  for (const s of c.skills.filter((x) => x.visible)) {
    const ic = resolveIcon(s.name, s.icon);
    const t = s.group.trim() || "Other";
    groups.set(t, [
      ...(groups.get(t) ?? []),
      { name: s.name, icon: ic?.slug, invert: ic?.invert },
    ]);
  }
  const skillGroups = [...groups].map(([title, items]) => ({ title, items }));
  const skillCount = skillGroups.reduce((n, x) => n + x.items.length, 0);

  const education = c.education
    .filter((e) => e.visible)
    .map((e) => ({
      short: e.short,
      degree: e.degree,
      school: e.school,
      start: e.start,
      end: e.end,
      label: e.label,
      score: parseFloat(e.score) || 0,
    }));

  const projects = c.projects.filter((p) => p.visible);
  const certificates = c.certificates.filter((x) => x.visible);

  const digits = g.whatsapp.replace(/\D/g, "");
  const whatsappUrl = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(
        "Hi, I saw your portfolio and would like to connect."
      )}`
    : "";

  const socials = (
    [
      { key: "github", name: "GitHub", href: g.github },
      { key: "linkedin", name: "LinkedIn", href: g.linkedin },
      { key: "instagram", name: "Instagram", href: g.instagram },
      { key: "whatsapp", name: "WhatsApp", href: whatsappUrl },
    ] as SiteCtx["socials"]
  ).filter((s) => s.href);

  const show = (k: string) => c.sections[`${k}_show`] !== false;
  const flags = {
    about: show("about"),
    experience: show("experience") && experience.length > 0,
    skills: show("skills") && skillCount > 0,
    projects: show("projects") && projects.length > 0,
    education: show("education") && education.length > 0,
    certificates: show("certificates") && certificates.length > 0,
    contact: show("contact"),
  };

  const order: [keyof typeof flags, string][] = [
    ["about", "About"],
    ["experience", "Experience"],
    ["skills", "Skills"],
    ["projects", "Projects"],
    ["education", "Education"],
    ["certificates", "Certificates"],
    ["contact", "Contact"],
  ];
  const navLinks = order
    .filter(([k]) => flags[k])
    .map(([k, label]) => ({ label, id: k }));

  const facts = c.about.facts
    .map((line) => {
      const i = line.indexOf(":");
      return i < 0
        ? { label: "", value: line.trim() }
        : { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    })
    .filter((f) => f.value);

  const ctx: SiteCtx = {
    profile: {
      name: g.name,
      shortName: g.brand,
      email: g.email,
      phone: g.phone,
      location: g.location,
      resume: g.resume,
    },
    socials,
    whatsappUrl,
    navLinks,
    sections: c.sections,
    about: { paragraphs: c.about.paragraphs, facts },
    experience,
    skillGroups,
    education,
  };

  const stats = [
    { value: `${projects.length}+`, label: "Projects" },
    { value: `${experience.length}`, label: "Experience" },
    {
      value: skillCount >= 5 ? `${Math.floor(skillCount / 5) * 5}+` : `${skillCount}`,
      label: "Skills",
    },
  ];

  return { ctx, hero: c.hero, projects, certificates, flags, stats };
}