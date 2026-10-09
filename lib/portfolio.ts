export const profile = {
  name: "Neeraj Singh Rajpurohit",
  shortName: "Neeraj",
  role: "AI Powered Web Developer",
  tagline:
    "MCA graduate building fast, responsive web experiences with React, Next.js and Tailwind CSS, powered by AI.",
  location: "Bengaluru, India",
  email: "neerajpurohit520@gmail.com",
  phone: "+91 8769667289",
  whatsapp: "918769667289",
  github: "https://github.com/Neerajsingh14",
  linkedin: "https://www.linkedin.com/in/neeraj-singh-rajpurohit/",
  instagram: "https://www.instagram.com/neerajsingh.14/",
  resume: "/Neeraj_Singh_Rajpurohit_Resume.pdf",
  // apni photo public folder me rakho (jaise public/profile.jpg) aur yahan "/profile.jpg" likho
  // khali rahe to "NR" monogram dikhega
  photo: "",
};

export const whatsappUrl = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
  "Hi Neeraj, I saw your portfolio and would like to connect."
)}`;

export type SocialKey = "github" | "linkedin" | "instagram" | "whatsapp";

const allSocials: { key: SocialKey; name: string; href: string }[] = [
  { key: "github", name: "GitHub", href: profile.github },
  { key: "linkedin", name: "LinkedIn", href: profile.linkedin },
  { key: "instagram", name: "Instagram", href: profile.instagram },
  { key: "whatsapp", name: "WhatsApp", href: whatsappUrl },
];

export const socials = allSocials.filter((s) => s.href);

export const navLinks = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Certificates", id: "certificates" },
  { label: "Contact", id: "contact" },
];

/* ---------------- About ---------------- */
export const aboutParagraphs = [
  "I'm an AI-powered web developer based in Bengaluru with a Master's in Computer Applications (MCA). I build fast, responsive interfaces with React, Next.js and Tailwind CSS, and use AI tools to design, build and ship faster.",
  "Backed by Oracle certifications in Generative AI and AI Foundations, I enjoy building smarter products. I have also delivered full stack projects like MR Reporting Software and EduPortal with Spring Boot and PostgreSQL, and I'm available for freelance projects and open to frontend or full stack roles.",
];

export const facts = [
  { label: "Role", value: "AI Powered Web Developer" },
  { label: "Based in", value: "Bengaluru, India" },
  { label: "Education", value: "MCA, Presidency University" },
  { label: "Open to", value: "Freelance, full-time, internships" },
];

/* ---------------- Skills ---------------- */
export type Skill = { name: string; icon?: string; invert?: boolean };
export type SkillGroup = { title: string; note: string; items: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    note: "What I use to build interfaces",
    items: [
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css3" },
      { name: "JavaScript", icon: "javascript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs", invert: true },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Bootstrap", icon: "bootstrap" },
    ],
  },
  {
    title: "Backend & Database",
    note: "Data and APIs",
    items: [
      { name: "Spring Boot", icon: "spring" },
      { name: "Supabase", icon: "supabase" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    title: "Languages",
    note: "Programming languages",
    items: [
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
      { name: "PHP", icon: "php" },
    ],
  },
  {
    title: "Tools & DevOps",
    note: "Workflow and delivery",
    items: [
      { name: "GitHub", icon: "github", invert: true },
      { name: "VS Code", icon: "vscode" },
      { name: "Docker", icon: "docker" },
      { name: "CI/CD Pipeline", icon: "githubactions", invert: true },
    ],
  },
];

export const skillCount = skillGroups.reduce((n, g) => n + g.items.length, 0);

/* ---------------- Experience ---------------- */
export type ExperienceItem = {
  company: string;
  initials: string;
  position: string;
  type: string;
  mode: string;
  location: string;
  period: string;
  duration: string;
  description: string;
  points?: string[];
  tags: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Elytespark",
    initials: "ES",
    position: "Business Development Executive (BDE)",
    type: "Full-time",
    mode: "On-site",
    location: "Bengaluru, Karnataka, India",
    period: "Jul 2026 - Sep 2026",
    duration: "3 mos",
    description:
      "As a Business Development Executive, I connected with prospective students, understood their career goals, and guided them in choosing the right courses. I explained program features, counselled students, followed up with leads, built strong relationships, and worked towards enrollment and sales targets while ensuring a positive customer experience.",
    tags: ["Counselling", "Lead follow-up", "Relationship building", "Sales targets"],
  },
  {
    company: "E-Tech Services Private Limited",
    initials: "ET",
    position: "Frontend Developer Intern",
    type: "Internship",
    mode: "Remote",
    location: "Gurugram, Haryana, India",
    period: "Feb 2026 - May 2026",
    duration: "4 mos",
    description:
      "Worked as a Frontend Developer Intern, gaining hands-on experience in a professional remote environment. Collaborated with team members to understand real-world project workflows and contributed to the development and improvement of user-facing features.",
    points: [
      "Developed responsive and user-friendly UI components for a smooth user experience.",
      "Implemented new features, resolved UI issues and helped optimize application performance.",
    ],
    tags: ["React.js", "Tailwind CSS"],
  },
];

/* ---------------- Projects ---------------- */
export type Project = {
  title: string;
  categories: string[]; // pehli category card pe chip me dikhti hai, baaki filter ke liye
  period: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string;
  live?: string; // live demo link, khali rahe to button disabled dikhega
  image?: string; // jaise "/projects/mr-reporting.png" (public folder me rakho)
};

export const projects: Project[] = [
  {
    title: "MR Reporting Software",
    categories: ["Full Stack", "Dashboards & ERP"],
    period: "Feb 2026 - May 2026",
    description:
      "A role-based MR reporting system with Admin, MR and Manager modules to streamline daily field activity tracking, including doctor visits, medicines promoted and order details.",
    highlights: [
      "Real-time reporting with daily, weekly and monthly performance insights.",
      "Improved data accuracy and reduced manual errors for better decision-making.",
    ],
    tech: ["React.js", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
    github: "https://github.com/Neerajsingh14",
    live: "https://mrreporting.netlify.app/",
  },
  {
    title: "EduPortal",
    categories: ["Full Stack", "Dashboards & ERP", "Academic"],
    period: "University ERP System",
    description:
      "A role-based university ERP system to manage students, faculty, parents and administrative workflows, with attendance tracking, academic monitoring and admission management.",
    highlights: [
      "Automated key university processes with centralized data handling.",
      "Real-time updates that cut manual work and improve overall usability.",
    ],
    tech: ["React.js", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
    github: "https://github.com/Neerajsingh14",
    live: "https://lnkd.in/p/g-Bwi9m5",
  },
  {
    title: "Weather App",
    categories: ["Frontend", "API Integration"],
    period: "Apr 2025 - May 2025",
    description:
      "A responsive real-time weather forecast application that shows temperature, humidity, wind speed and weather conditions based on the user's location or search input.",
    highlights: [
      "Fetches live weather data using the OpenWeatherMap API.",
      "User-friendly interface designed for both desktop and mobile.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
    github: "https://github.com/Neerajsingh14",
    live: "",
  },
  {
    title: "Think Fit",
    categories: ["Full Stack", "Academic"],
    period: "Jan 2023 - May 2023",
    description:
      "A gym management and fitness tracker app built as a graduation project. Users log daily workouts, track progress and receive personalized diet recommendations.",
    highlights: [
      "Exercise scheduling and diet plans based on body metrics.",
      "Progress analytics to track fitness goals over time.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    github: "https://github.com/Neerajsingh14",
    live: "",
  },
];

// filter tabs ka order (jis category me project nahi hoga wo tab apne aap hide)
export const projectFilterOrder = [
  "Full Stack",
  "Frontend",
  "Dashboards & ERP",
  "API Integration",
  "Academic",
];

/* ---------------- Education ---------------- */
export type EducationItem = {
  short: string;
  degree: string;
  school: string;
  start: string;
  end: string;
  score: number;
  label: string;
};

export const education: EducationItem[] = [
  {
    short: "BCA",
    degree: "Bachelor of Computer Applications",
    school: "Lachoo Memorial College of Science and Technology, Jodhpur",
    start: "2021",
    end: "2024",
    score: 8.3,
    label: "Final CGPA",
  },
  {
    short: "MCA",
    degree: "Master of Computer Applications",
    school: "Presidency University, Bangalore",
    start: "2024",
    end: "2026",
    score: 8.9,
    label: "Final CGPA",
  },
];

/* ---------------- Certificates ---------------- */
export type Certificate = {
  title: string;
  short: string;
  issuer: string;
  tag: string;
  color: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  url?: string;
};

export const certificates: Certificate[] = [
  {
    title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    short: "Generative AI Professional",
    issuer: "Oracle",
    tag: "AI & Cloud",
    color: "#f87171",
    issued: "Oct 2025",
    expires: "Oct 2027",
    credentialId: "1029251810CI25GAIOCP",
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    short: "AI Foundations Associate",
    issuer: "Oracle",
    tag: "AI & Cloud",
    color: "#f87171",
    issued: "Oct 2025",
    expires: "Oct 2027",
    credentialId: "102925181OCI25AICFA",
  },
  {
    title: "Java Programming for Beginners",
    short: "Java Programming",
    issuer: "Crio.Do",
    tag: "Java",
    color: "#2dd4bf",
    issued: "May 2025",
  },
  {
    title: "CSS (Basic)",
    short: "CSS (Basic)",
    issuer: "HackerRank",
    tag: "Frontend",
    color: "#4ade80",
    issued: "Apr 2025",
    url: "https://www.hackerrank.com/certificates/iframe/80c0b693e1f3",
  },
  {
    title: "JavaScript Fundamentals",
    short: "JavaScript Fundamentals",
    issuer: "GreatStack",
    tag: "JavaScript",
    color: "#38bdf8",
    issued: "Apr 2025",
    credentialId: "jsbs2yDD3hFXB1Y4hcLnlA5AQTIYtYU2",
  },
];

/* ---------------- Hero stats (data se apne aap) ---------------- */
export const stats = [
  { value: `${projects.length}+`, label: "Projects" },
  { value: `${experience.length}`, label: "Experience" },
  { value: `${Math.floor(skillCount / 5) * 5}+`, label: "Skills" },
];