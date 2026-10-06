export type RoleRow = {
  slug: string;
  title: string;
  headline: string | null;
  bio: string | null;
};

export type Profile = {
  name: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  instagram: string | null;
  photo_url: string | null;
  cv_url: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  image?: string;
  liveUrl: string;
  githubUrl?: string;
  roleLabel: string;
  duration: string;
};

export type Skill = { id: string; name: string };

export type Experience = {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  url?: string;
  image?: string;
};

export type Sections = Record<string, boolean>;

export type NavLink = { label: string; href: string };

export type SiteData = {
  role: RoleRow;
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  certificates: Certificate[];
  sections: Sections;
};