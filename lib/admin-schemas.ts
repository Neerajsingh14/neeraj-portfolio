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