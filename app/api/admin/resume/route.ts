import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { commitFile, githubConfig } from "@/lib/github";
import { resumeTarget } from "@/lib/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 4 * 1024 * 1024; // Vercel ki request limit 4.5MB hai

const fail = (error: string, status: number) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  // doosri site se aayi request rok
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return fail("Forbidden", 403);
    } catch {
      return fail("Forbidden", 403);
    }
  }

  const auth = await checkAdmin();
  if (!auth.ok) return fail(auth.error ?? "Not allowed", 401);

  const cfg = githubConfig();
  if (!cfg) {
    return fail(
      "GITHUB_TOKEN, GITHUB_REPO set nahi hain (.env.local aur Vercel dono me daalo).",
      400
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("File padh nahi paya", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return fail("PDF file chuno", 400);
  if (file.size === 0) return fail("File khali hai", 400);
  if (file.size > MAX) return fail("File 4 MB se choti honi chahiye", 400);

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return fail("Ye valid PDF file nahi hai", 400);
  }

  const { path } = await resumeTarget();
  const r = await commitFile(cfg, path, bytes, "chore: update resume via admin panel");
  if (!r.ok) return fail(r.error, 502);

  return NextResponse.json({ ok: true, commitUrl: r.commitUrl, sha: r.sha, path });
}