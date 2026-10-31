const API = "https://api.github.com";

export type GithubCfg = { token: string; repo: string; branch: string };
export type CommitInfo = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

export function githubConfig(): GithubCfg | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim();
  if (!token || !repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
  return { token, repo, branch: process.env.GITHUB_BRANCH?.trim() || "main" };
}

function hdrs(token: string, json = false): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-admin",
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

const encPath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

function explain(status: number, apiMsg?: string) {
  if (status === 401)
    return "GitHub token galat ya expire ho gaya hai. Naya token banao.";
  if (status === 403)
    return "Token ko is repo me 'Contents: Read and write' permission nahi hai (ya rate limit lag gayi).";
  if (status === 404)
    return "Repo ya branch nahi mila, ya token ko is repo ka access nahi hai. GITHUB_REPO aur token check karo.";
  if (status === 409 || status === 422)
    return "File usi waqt kisi aur commit se badal rahi thi. Dobara try karo.";
  return apiMsg || `GitHub error ${status}`;
}

// file ka sabse naya commit
export async function lastCommit(
  cfg: GithubCfg,
  path: string
): Promise<CommitInfo | null> {
  try {
    const url = `${API}/repos/${cfg.repo}/commits?path=${encodeURIComponent(
      path
    )}&sha=${encodeURIComponent(cfg.branch)}&per_page=1`;
    const res = await fetch(url, { headers: hdrs(cfg.token), cache: "no-store" });
    if (!res.ok) return null;
    const list = await res.json();
    const c = Array.isArray(list) ? list[0] : null;
    if (!c) return null;
    return {
      sha: String(c.sha ?? ""),
      message: String(c.commit?.message ?? "").split("\n")[0],
      date: String(c.commit?.author?.date ?? ""),
      url: String(c.html_url ?? ""),
    };
  } catch {
    return null;
  }
}

// file ko repo me commit karna (pehle se ho to overwrite)
export async function commitFile(
  cfg: GithubCfg,
  path: string,
  bytes: Buffer,
  message: string
): Promise<
  { ok: true; sha: string; commitUrl: string } | { ok: false; error: string }
> {
  const url = `${API}/repos/${cfg.repo}/contents/${encPath(path)}`;

  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      let sha: string | undefined;

      const get = await fetch(`${url}?ref=${encodeURIComponent(cfg.branch)}`, {
        headers: hdrs(cfg.token),
        cache: "no-store",
      });
      if (get.ok) {
        const j = await get.json();
        sha = typeof j?.sha === "string" ? j.sha : undefined;
      } else if (get.status !== 404) {
        return { ok: false, error: explain(get.status) };
      }

      const put = await fetch(url, {
        method: "PUT",
        headers: hdrs(cfg.token, true),
        cache: "no-store",
        body: JSON.stringify({
          message,
          content: bytes.toString("base64"),
          branch: cfg.branch,
          ...(sha ? { sha } : {}),
        }),
      });

      if (put.ok) {
        const j = await put.json();
        return {
          ok: true,
          sha: String(j?.commit?.sha ?? ""),
          commitUrl: String(j?.commit?.html_url ?? ""),
        };
      }

      if ((put.status === 409 || put.status === 422) && attempt === 0) continue;

      const j = (await put.json().catch(() => ({}))) as { message?: string };
      return { ok: false, error: explain(put.status, j.message) };
    }
    return { ok: false, error: explain(409) };
  } catch {
    return { ok: false, error: "Network error: GitHub tak nahi pahunch paya" };
  }
}