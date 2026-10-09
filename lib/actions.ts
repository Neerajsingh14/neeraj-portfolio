"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase-server";
import { loadStore, metaFrom, profileFrom } from "./content";
import { SECTION_KEYS } from "./content-types";
import { sendMail } from "./mail";

type Result = { ok: boolean; error?: string; id?: string };

const fail = (e: unknown, d: string): Result => ({
  ok: false,
  error: e instanceof Error ? e.message : d,
});
const refresh = () => {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
};
const validKey = (k: string) =>
  k === "global" ||
  /^[a-z0-9-]+:(hero|about|experience|skills|projects|education|certificates|sections)$/.test(k);

async function requireAdmin() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!user || (adminEmail && user.email?.toLowerCase() !== adminEmail)) {
    throw new Error("Not allowed");
  }
  return sb;
}

const now = () => new Date().toISOString();

type SB = Awaited<ReturnType<typeof requireAdmin>>;
async function writeSite(
  sb: SB,
  active: string,
  profiles: { id: string; label: string }[]
) {
  return sb
    .from("content")
    .upsert({ key: "site", data: { active, profiles }, updated_at: now() });
}

/* ---------- content ---------- */
export async function saveContent(key: string, data: unknown): Promise<Result> {
  try {
    if (!validKey(key)) return { ok: false, error: "Unknown section" };
    const section = key === "global" ? "global" : key.split(":")[1];
    const wantsObject = ["global", "hero", "about", "sections"].includes(section);
    const isArr = Array.isArray(data);
    const isObject = typeof data === "object" && data !== null && !isArr;
    if (wantsObject ? !isObject : !isArr) return { ok: false, error: "Invalid data" };

    const sb = await requireAdmin();
    const { error } = await sb
      .from("content")
      .upsert({ key, data, updated_at: now() });
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e, "Save failed");
  }
}

export async function resetContent(key: string): Promise<Result> {
  try {
    if (!validKey(key)) return { ok: false, error: "Unknown section" };
    const sb = await requireAdmin();
    const { error } = await sb.from("content").delete().eq("key", key);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e, "Reset failed");
  }
}

/* ---------- profiles ---------- */
export async function selectProfile(id: string): Promise<Result> {
  try {
    await requireAdmin();
    (await cookies()).set("admin_profile", id, {
      path: "/admin",
      httpOnly: true,
      sameSite: "lax",
    });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e, "Failed");
  }
}

export async function createProfile(label: string, from: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const name = label.trim().slice(0, 60);
    if (!name) return { ok: false, error: "Profile ka naam likho" };

    const store = await loadStore();
    const meta = metaFrom(store);

    const base =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      "profile";
    let id = base;
    let n = 2;
    while (meta.profiles.some((p) => p.id === id)) id = `${base}-${n++}`;

    const src = meta.profiles.some((p) => p.id === from) ? from : meta.active;
    const { content } = profileFrom(store, src);
    const copy = { ...content, hero: { ...content.hero, role: name } };

    const rows = SECTION_KEYS.map((k) => ({
      key: `${id}:${k}`,
      data: copy[k],
      updated_at: now(),
    }));
    const r1 = await sb.from("content").upsert(rows);
    if (r1.error) return { ok: false, error: r1.error.message };

    const r2 = await writeSite(sb, meta.active, [...meta.profiles, { id, label: name }]);
    if (r2.error) return { ok: false, error: r2.error.message };

    refresh();
    return { ok: true, id };
  } catch (e) {
    return fail(e, "Create failed");
  }
}

export async function setActiveProfile(id: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const meta = metaFrom(await loadStore());
    if (!meta.profiles.some((p) => p.id === id)) return { ok: false, error: "Profile nahi mila" };
    const { error } = await writeSite(sb, id, meta.profiles);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e, "Failed");
  }
}

export async function renameProfile(id: string, label: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const name = label.trim().slice(0, 60);
    if (!name) return { ok: false, error: "Naam khali hai" };
    const meta = metaFrom(await loadStore());
    const profiles = meta.profiles.map((p) => (p.id === id ? { ...p, label: name } : p));
    const { error } = await writeSite(sb, meta.active, profiles);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e, "Failed");
  }
}

export async function deleteProfile(id: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const meta = metaFrom(await loadStore());
    if (meta.profiles.length < 2) {
      return { ok: false, error: "Kam se kam ek profile rakhna zaroori hai" };
    }
    const profiles = meta.profiles.filter((p) => p.id !== id);
    const active = meta.active === id ? profiles[0].id : meta.active;

    const r1 = await writeSite(sb, active, profiles);
    if (r1.error) return { ok: false, error: r1.error.message };
    await sb.from("content").delete().like("key", `${id}:%`);
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e, "Delete failed");
  }
}

/* ---------- messages / mail ---------- */
export async function markMessage(id: string, read: boolean): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb.from("messages").update({ read }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e, "Failed");
  }
}

export async function deleteMessage(id: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb.from("messages").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e, "Failed");
  }
}

export async function sendTestEmail(): Promise<Result> {
  try {
    await requireAdmin();
    return await sendMail({
      subject: "Portfolio test email",
      text: "Ye test mail hai. Agar tumhe ye mil gayi, to contact form ka email sahi chal raha hai.",
    });
  } catch (e) {
    return fail(e, "Failed");
  }
}

export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/admin/login");
}