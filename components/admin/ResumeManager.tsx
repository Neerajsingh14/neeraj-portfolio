"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  GitBranch,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  TriangleAlert,
  Upload,
  X,
  CircleCheck,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { btnGhost, btnPrimary, PageHeader } from "./ui";

type Commit = { sha: string; message: string; when: string; url: string } | null;
type Phase = "idle" | "committing" | "deploying" | "live" | "local" | "timeout";

const MAX = 4 * 1024 * 1024;
const card = "rounded-2xl border border-white/10 bg-surface p-5 sm:p-7";

async function sha256(buf: ArrayBuffer) {
  const d = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(d))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const fmt = (n: number) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`;

export default function ResumeManager({
  configured,
  repo,
  branch,
  href,
  path,
  setting,
  mismatch,
  commit,
}: {
  configured: boolean;
  repo: string;
  branch: string;
  href: string;
  path: string;
  setting: string;
  mismatch: boolean;
  commit: Commit;
}) {
  const router = useRouter();
  const { toast } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [commitUrl, setCommitUrl] = useState("");

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };
  useEffect(() => stopPolling, []);

  const pick = (f: File | null | undefined) => {
    setError("");
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Sirf PDF file chuno");
      return;
    }
    if (f.size > MAX) {
      setError("File 4 MB se choti honi chahiye");
      return;
    }
    setFile(f);
    setPhase("idle");
  };

  // deploy poora hone tak live resume ko check karta hai (file ka hash match hone par live)
  const startPolling = (hash: string) => {
    setPhase("deploying");
    stopPolling();
    const started = Date.now();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${href}?v=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const h = await sha256(await res.arrayBuffer());
          if (h === hash) {
            stopPolling();
            setPhase("live");
            toast("ok", "Nayi resume live ho gayi");
            return;
          }
        }
      } catch {
        /* agle round me phir try */
      }
      if (Date.now() - started > 6 * 60 * 1000) {
        stopPolling();
        setPhase("timeout");
      }
    }, 8000);
  };

  const upload = async () => {
    if (!file) return;
    setError("");
    setPhase("committing");

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/resume", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        commitUrl?: string;
      };

      if (!res.ok || !json.ok) {
        const msg = json.error || "Upload nahi hua";
        setError(msg);
        setPhase("idle");
        toast("err", msg);
        return;
      }

      setCommitUrl(json.commitUrl ?? "");
      toast("ok", "GitHub par commit ho gaya");
      setTimeout(() => router.refresh(), 1500);

      const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      if (local) {
        setPhase("local");
      } else {
        startPolling(await sha256(await file.arrayBuffer()));
      }
    } catch {
      const msg = "Network problem. Internet check karke dobara try karo.";
      setError(msg);
      setPhase("idle");
      toast("err", msg);
    }
  };

  const busy = phase === "committing";

  return (
    <div>
      <PageHeader
        eyebrow="Site-wide"
        title="Resume"
        description="Nayi PDF upload karo. Wo seedha GitHub me commit hoti hai aur Vercel naya deploy chalata hai. 1 se 2 minute me site par nayi resume."
      />

      {!configured && (
        <div className="mt-8 rounded-2xl border border-amber-300/40 bg-amber-300/5 p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <KeyRound size={20} className="text-amber-300" />
            <p className="font-semibold">GitHub token abhi set nahi hai</p>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">.env.local</code>{" "}
            aur Vercel ke Environment Variables, dono me ye 3 daalo, phir server restart (aur Vercel par
            Redeploy) karo:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-bg/60 p-4 font-mono text-sm leading-relaxed">
{`GITHUB_TOKEN=github_pat_...
GITHUB_REPO=Neerajsingh14/neeraj-portfolio
GITHUB_BRANCH=main`}
          </pre>
          <p className="mt-3 text-sm text-muted">
            Token fine-grained hona chahiye, sirf is repo ke liye, aur Contents: Read and write permission ke saath.
          </p>
        </div>
      )}

      {/* current */}
      <div className={`${card} mt-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <FileText size={26} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-semibold">Current resume</p>
              <p className="truncate font-mono text-sm text-muted">{path}</p>
            </div>
          </div>
          <a
            href={`${href}?v=${commit?.sha ?? "x"}`}
            target="_blank"
            rel="noreferrer"
            className={btnGhost}
          >
            <ExternalLink size={16} />
            View resume
          </a>
        </div>

        {configured && (
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-white/[0.04] p-4 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <GitBranch size={15} className="text-accent" />
              {repo} <span className="text-white/30">/</span> {branch}
            </span>
            {commit ? (
              <span className="min-w-0 text-muted">
                Last update: <span className="text-fg">{commit.when}</span>
                {commit.message ? ` - ${commit.message}` : ""}{" "}
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-accent hover:underline"
                >
                  {commit.sha}
                </a>
              </span>
            ) : (
              <span className="text-muted">Is file ka koi commit abhi nahi mila</span>
            )}
          </div>
        )}

        {mismatch && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300/30 bg-amber-300/5 p-3.5 text-sm text-amber-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <span>
              Settings me resume link <b>{setting || "(khali)"}</b> hai. Site ko nayi file dikhane ke liye
              Settings me resume link <b>{href}</b> likho.
            </span>
          </p>
        )}
      </div>

      {/* upload */}
      <div className={`${card} mt-4`}>
        <p className="text-lg font-semibold">Upload new resume</p>
        <p className="mt-1 text-[15px] text-muted">PDF, 4 MB tak. Purani file isse badal jayegi.</p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          className={`mt-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center transition ${
            drag ? "border-accent bg-accent/10" : "border-white/15 bg-bg/40"
          }`}
        >
          {file ? (
            <>
              <FileText size={30} className="text-accent" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted">{fmt(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setError("");
                }}
                disabled={busy}
                className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-red-400 disabled:opacity-40"
              >
                <X size={14} />
                Hatao
              </button>
            </>
          ) : (
            <>
              <Upload size={30} className="text-muted/70" />
              <p className="font-medium">PDF yahan drag karke chhodo</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={btnGhost}
              >
                Browse files
              </button>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-3.5 text-sm text-red-300">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <button
          onClick={upload}
          disabled={!file || !configured || busy || phase === "deploying"}
          className={`${btnPrimary} mt-5`}
        >
          {busy ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Upload size={17} />
          )}
          {busy ? "Commit ho raha hai..." : "Update resume"}
        </button>

        {/* status */}
        {phase === "deploying" && (
          <p className="mt-5 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
            <LoaderCircle size={18} className="mt-0.5 shrink-0 animate-spin text-accent" />
            <span>
              Commit ho gaya. Vercel naya deploy bana raha hai (1 se 2 minute). Nayi resume live hote hi yahan
              batayenge.{" "}
              {commitUrl && (
                <a href={commitUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                  Commit dekho
                </a>
              )}
            </span>
          </p>
        )}
        {phase === "live" && (
          <p className="mt-5 flex items-start gap-3 rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-300">
            <CircleCheck size={18} className="mt-0.5 shrink-0" />
            Nayi resume live hai. Site ka Resume button ab nayi PDF dega.
          </p>
        )}
        {phase === "local" && (
          <p className="mt-5 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
            <RefreshCw size={18} className="mt-0.5 shrink-0 text-accent" />
            <span>
              Ye localhost hai, isliye yahan file nahi badlegi. GitHub par commit ho gaya hai, aur live site
              1 se 2 minute me update hogi. Apne computer par bhi chahiye to <b>git pull</b> chalao.{" "}
              {commitUrl && (
                <a href={commitUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                  Commit dekho
                </a>
              )}
            </span>
          </p>
        )}
        {phase === "timeout" && (
          <p className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300/30 bg-amber-300/5 p-4 text-sm text-amber-200">
            <TriangleAlert size={18} className="mt-0.5 shrink-0" />
            Abhi tak live nahi dikhi. Deploy me thoda zyada time lag sakta hai. Vercel, Deployments me check
            karo, phir site par Ctrl + Shift + R karke dekho.
          </p>
        )}
      </div>

      {/* how */}
      <div className={`${card} mt-4`}>
        <p className="font-semibold">Ye kaise chalta hai</p>
        <ol className="mt-4 space-y-3 text-[15px] text-muted">
          {[
            "PDF server par aati hai aur check hoti hai ki sach me PDF hai.",
            "Server GitHub API se usse public folder me commit karta hai (purani file replace).",
            "Commit hote hi Vercel apne aap naya deploy chalata hai.",
            "1 se 2 minute me site ka Resume button nayi PDF dene lagta hai.",
          ].map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-xs text-accent">
                {i + 1}
              </span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted/80">
          Dhyan rakho: admin ke commit se GitHub aage nikal jata hai, isliye apne computer par code push karne
          se pehle <b>git pull</b> chalao.
        </p>
      </div>
    </div>
  );
}