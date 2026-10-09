"use client";
import { createContext, useContext } from "react";
import type { ExperienceItem, SocialKey } from "@/lib/content-types";

export type Skill = { name: string; icon?: string; invert?: boolean };

export type SiteCtx = {
  profile: {
    name: string;
    shortName: string;
    email: string;
    phone: string;
    location: string;
    resume: string;
  };
  socials: { key: SocialKey; name: string; href: string }[];
  whatsappUrl: string;
  navLinks: { label: string; id: string }[];
  sections: Record<string, string | boolean>;
  about: {
    paragraphs: string[];
    facts: { label: string; value: string }[];
  };
  experience: (ExperienceItem & { initials: string })[];
  skillGroups: { title: string; items: Skill[] }[];
  education: {
    short: string;
    degree: string;
    school: string;
    start: string;
    end: string;
    label: string;
    score: number;
  }[];
};

const Ctx = createContext<SiteCtx | null>(null);

export function useSite() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used inside SiteProvider");
  return v;
}

export default function SiteProvider({
  value,
  children,
}: {
  value: SiteCtx;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}