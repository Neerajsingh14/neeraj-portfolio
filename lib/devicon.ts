export const devicon = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;

const MAP: Record<string, string> = {
  html: "html5", html5: "html5", css: "css3", css3: "css3",
  javascript: "javascript", js: "javascript", typescript: "typescript", ts: "typescript",
  react: "react", "react.js": "react", reactjs: "react",
  "next.js": "nextjs", nextjs: "nextjs",
  tailwind: "tailwindcss", "tailwind css": "tailwindcss", tailwindcss: "tailwindcss",
  bootstrap: "bootstrap", java: "java", python: "python", php: "php",
  "spring boot": "spring", spring: "spring", supabase: "supabase",
  postgresql: "postgresql", postgres: "postgresql", mysql: "mysql", mongodb: "mongodb",
  docker: "docker", git: "git", github: "github", "vs code": "vscode", vscode: "vscode",
  "node.js": "nodejs", nodejs: "nodejs", node: "nodejs", express: "express",
  "ci/cd pipeline": "githubactions", "ci/cd": "githubactions",
  figma: "figma", firebase: "firebase", vercel: "vercel", npm: "npm", sass: "sass",
  vue: "vuejs", "vue.js": "vuejs", kotlin: "kotlin", swift: "swift", go: "go", "c++": "cplusplus",
};

// dark logos jo dark background par invert karne padte hain
const INVERT = new Set(["nextjs", "github", "githubactions", "express", "vercel"]);

export function resolveIcon(name: string, icon?: string) {
  const slug = (icon && icon.trim()) || MAP[name.trim().toLowerCase()];
  return slug ? { slug, invert: INVERT.has(slug) } : null;
}