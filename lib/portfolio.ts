export const profile = {
  name: "Neeraj Singh Rajpurohit",
  shortName: "Neeraj",
  role: "Full Stack Web Developer",
  headline: "I build web products people remember.",
  tagline:
    "MCA graduate crafting responsive, scalable and user-centric web applications with React, Tailwind CSS and Spring Boot.",
  location: "Bengaluru, India",
  email: "neerajpurohit520@gmail.com",
  phone: "+91 8769667289",
  whatsapp: "918769667289",
  github: "https://github.com/Neerajsingh14",
  linkedin: "https://www.linkedin.com/in/neeraj-singh-rajpurohit/",
  instagram: "https://www.instagram.com/neerajsingh.14/",
  resume: "/Neeraj_Singh_Rajpurohit_Resume.pdf",
  summary:
    "A passionate and results-driven Full Stack Web Developer with a Master's degree in Computer Applications (MCA) and hands-on experience in designing and developing responsive web applications. I build scalable, user-centric solutions through academic and personal projects, with a strong understanding of software development principles and modern web technologies.",
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
  profile.summary,
  "My journey began with a BCA at Lachoo Memorial College in Jodhpur, where I built Think Fit, a gym management and fitness tracker, as my graduation project. I then completed my MCA at Presidency University, Bangalore with a final CGPA of 8.9, building full stack systems like MR Reporting Software and EduPortal.",
  "Alongside development, my work as a Business Development Executive at Elytespark taught me to listen closely, communicate clearly and work towards targets. These skills help me understand what users and teams actually need before I write a single line of code.",
];

export const facts = [
  { icon: "pin", label: "Based in", value: "Bengaluru, India" },
  { icon: "grad", label: "Education", value: "MCA, Presidency University (CGPA 8.9)" },
  { icon: "briefcase", label: "Experience", value: "Frontend Intern, Business Development" },
  { icon: "target", label: "Open to", value: "Full-time roles, internships and freelance work" },
];

export const whatIDo = [
  {
    icon: "layers",
    title: "Full Stack Development",
    text: "End-to-end web apps with React on the front and Spring Boot with PostgreSQL behind it.",
  },
  {
    icon: "smartphone",
    title: "Responsive UI",
    text: "Mobile-first interfaces built with Tailwind CSS and clean, reusable components.",
  },
  {
    icon: "database",
    title: "Backend & Databases",
    text: "Backend services and data layers using Spring Boot, PostgreSQL, MySQL and MongoDB.",
  },
  {
    icon: "brain",
    title: "AI & Cloud Foundations",
    text: "Oracle Cloud certified in Generative AI and AI Foundations, exploring how AI fits into products.",
  },
];

export const principles = [
  "Clean, maintainable code",
  "Responsive by default",
  "Clear communication",
  "Delivered on deadlines",
];

/* ---------------- Skills ---------------- */
export type Skill = { name: string; icon?: string; invert?: boolean };

export const skillGroups: { title: string; items: Skill[] }[] = [
  {
    title: "Languages",
    items: [
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
      { name: "PHP", icon: "php" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css3" },
      { name: "JavaScript", icon: "javascript" },
      { name: "React", icon: "react" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Bootstrap", icon: "bootstrap" },
    ],
  },
  {
    title: "Backend",
    items: [{ name: "Spring Boot", icon: "spring" }],
  },
  {
    title: "Databases",
    items: [
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    title: "DevOps",
    items: [
      { name: "Docker", icon: "docker" },
      { name: "CI/CD Pipeline", icon: "githubactions", invert: true },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "GitHub", icon: "github", invert: true },
      { name: "VS Code", icon: "vscode" },
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
  category: string;
  period: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string;
  live?: string; // live demo ka link yahan daalo, khali rahe to button disabled dikhega
  image?: string; // jaise "/projects/mr-reporting.png" (public folder me rakho)
};

export const projects: Project[] = [
  {
    title: "MR Reporting Software",
    category: "Full Stack",
    period: "Feb 2026 - May 2026",
    description:
      "A role-based MR reporting system with Admin, MR and Manager modules to streamline daily field activity tracking, including doctor visits, medicines promoted and order details.",
    highlights: [
      "Real-time reporting with daily, weekly and monthly performance insights.",
      "Improved data accuracy and reduced manual errors for better decision-making.",
    ],
    tech: ["React.js", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
    github: "https://github.com/Neerajsingh14",
    live: "",
  },
  {
    title: "EduPortal",
    category: "Full Stack",
    period: "University ERP System",
    description:
      "A role-based university ERP system to manage students, faculty, parents and administrative workflows, with attendance tracking, academic monitoring and admission management.",
    highlights: [
      "Automated key university processes with centralized data handling.",
      "Real-time updates that cut manual work and improve overall usability.",
    ],
    tech: ["React.js", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
    github: "https://github.com/Neerajsingh14",
    live: "",
  },
  {
    title: "Weather App",
    category: "Frontend",
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
    category: "Full Stack",
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
    short: "MCA",
    degree: "Master of Computer Applications",
    school: "Presidency University, Bangalore",
    start: "2024",
    end: "2026",
    score: 8.9,
    label: "Final CGPA",
  },
  {
    short: "BCA",
    degree: "Bachelor of Computer Applications",
    school: "Lachoo Memorial College of Science and Technology, Jodhpur",
    start: "2021",
    end: "2024",
    score: 8.3,
    label: "Final CGPA",
  },
];

/* ---------------- Certificates ---------------- */
export type Certificate = {
  title: string;
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
    issuer: "Oracle",
    tag: "AI & Cloud",
    color: "#f87171",
    issued: "Oct 2025",
    expires: "Oct 2027",
    credentialId: "1029251810CI25GAIOCP",
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    tag: "AI & Cloud",
    color: "#f87171",
    issued: "Oct 2025",
    expires: "Oct 2027",
    credentialId: "102925181OCI25AICFA",
  },
  {
    title: "Java Programming for Beginners",
    issuer: "Crio.Do",
    tag: "Java",
    color: "#2dd4bf",
    issued: "May 2025",
  },
  {
    title: "CSS (Basic)",
    issuer: "HackerRank",
    tag: "Frontend",
    color: "#4ade80",
    issued: "Apr 2025",
    url: "https://www.hackerrank.com/certificates/iframe/80c0b693e1f3",
  },
  {
    title: "JavaScript Fundamentals",
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