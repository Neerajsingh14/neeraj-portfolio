import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/mail";
import { contactEmail } from "@/lib/email-templates";

// thoda sa spam rok (serverless me best-effort)
const hits = new Map<string, number[]>();

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }
  hits.set(ip, [...recent, now]);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* bad json */
  }

  // honeypot: bots ye field bhar dete hain
  if (clean(body.website, 100)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const reason = clean(body.reason, 80) || "Other";
  const message = clean(body.message, 2000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Please fill all fields correctly." },
      { status: 400 }
    );
  }

  // 1) database me save
  let saved = false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    let { error } = await sb.from("messages").insert({ name, email, reason, message });
    if (error) {
      // reason column na bana ho to message ke saath jod do
      ({ error } = await sb
        .from("messages")
        .insert({ name, email, message: `[${reason}] ${message}` }));
    }
    saved = !error;
    if (error) console.error("[contact] save failed:", error.message);
  }

  // 2) designed email
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/+$/, "");
  const mailContent = contactEmail({ name, email, reason, message, siteUrl });
  const mail = await sendMail({ ...mailContent, replyTo: email });
  if (!mail.ok) console.error("[contact] mail failed:", mail.error);

  if (!saved && !mail.ok) {
    return NextResponse.json(
      { ok: false, error: "Could not send. Please try WhatsApp." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, saved, emailed: mail.ok });
}