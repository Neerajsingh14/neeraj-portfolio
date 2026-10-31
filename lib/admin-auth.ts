import { supabaseServer } from "./supabase-server";

// API routes par proxy.ts nahi chalta, isliye yahan khud admin check hota hai
export async function checkAdmin(): Promise<{ ok: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return { ok: false, error: "ADMIN_EMAIL set nahi hai (.env.local aur Vercel dono me daalo)" };
  }
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "Login karo" };
  if (user.email?.toLowerCase() !== adminEmail) {
    return { ok: false, error: "Not allowed" };
  }
  return { ok: true };
}