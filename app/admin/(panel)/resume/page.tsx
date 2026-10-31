import ResumeManager from "@/components/admin/ResumeManager";
import { githubConfig, lastCommit } from "@/lib/github";
import { resumeTarget } from "@/lib/resume";

export const dynamic = "force-dynamic";

export default async function ResumeAdmin() {
  const cfg = githubConfig();
  const t = await resumeTarget();
  const c = cfg ? await lastCommit(cfg, t.path) : null;

  const commit = c
    ? {
        sha: c.sha.slice(0, 7),
        message: c.message,
        url: c.url,
        when: c.date
          ? new Date(c.date).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }) + " IST"
          : "",
      }
    : null;

  return (
    <ResumeManager
      configured={!!cfg}
      repo={cfg?.repo ?? ""}
      branch={cfg?.branch ?? ""}
      href={t.href}
      path={t.path}
      setting={t.setting}
      mismatch={t.mismatch}
      commit={commit}
    />
  );
}