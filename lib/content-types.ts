export type SocialKey = "github" | "linkedin" | "instagram" | "whatsapp";

export const SECTION_KEYS = [
  "hero",
  "about",
  "experience",
  "skills",
  "projects",
  "education",
  "certificates",
  "sections",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

// har section ka khali template (type bhi yahin se bante hain)
export const blank = {
  global: {
    brand: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    github: "",
    linkedin: "",
    instagram: "",
    resume: "",
  },
  hero: {
    badge: "",
    greeting: "",
    name: "",
    role: "",
    location: "",
    phrases: [] as string[],
    stack: [] as string[],
    photo: "",
  },
  about: { paragraphs: [] as string[], facts: [] as string[] },
  experience: {
    id: "",
    company: "",
    position: "",
    type: "",
    mode: "",
    location: "",
    period: "",
    duration: "",
    description: "",
    points: [] as string[],
    tags: [] as string[],
    visible: true,
  },
  skills: { id: "", name: "", group: "", icon: "", visible: true },
  projects: {
    id: "",
    title: "",
    categories: [] as string[],
    period: "",
    description: "",
    highlights: [] as string[],
    tech: [] as string[],
    live: "",
    github: "",
    image: "",
    visible: true,
  },
  education: {
    id: "",
    short: "",
    degree: "",
    school: "",
    start: "",
    end: "",
    score: "",
    label: "Final CGPA",
    visible: true,
  },
  certificates: {
    id: "",
    title: "",
    issuer: "",
    tag: "",
    color: "#38bdf8",
    issued: "",
    expires: "",
    credentialId: "",
    url: "",
    visible: true,
  },
};

export type GlobalContent = typeof blank.global;
export type HeroContent = typeof blank.hero;
export type AboutContent = typeof blank.about;
export type ExperienceItem = typeof blank.experience;
export type SkillItem = typeof blank.skills;
export type ProjectItem = typeof blank.projects;
export type EducationItem = typeof blank.education;
export type CertificateItem = typeof blank.certificates;
export type SectionsContent = Record<string, string | boolean>;

export type ProfileContent = {
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  sections: SectionsContent;
};

export type ProfileMeta = { id: string; label: string };
export type SiteMeta = { active: string; profiles: ProfileMeta[] };