import { cache } from "react";
import { cookies } from "next/headers";
import { supabaseServer } from "./supabase-server";
import { globalFrom, loadStore, metaFrom, profileFrom } from "./content";

// cache sirf render ke liye (layout aur page ek hi fetch share karte hain).
// Server actions seedha loadStore use karte hain, isliye stale data nahi aata.
const getStore = cache(loadStore);

export const getAdminCtx = cache(async () => {
  const store = await getStore();
  const meta = metaFrom(store);
  const c = (await cookies()).get("admin_profile")?.value;
  const pid = meta.profiles.some((p) => p.id === c) ? (c as string) : meta.active;
  return { store, meta, pid, ...profileFrom(store, pid), global: globalFrom(store) };
});

export async function unreadCount() {
  try {
    const sb = await supabaseServer();
    const { count } = await sb
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export type RecentMsg = {
  id: string;
  name: string;
  email: string;
  reason: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export async function recentMessages(limit = 4): Promise<RecentMsg[]> {
  try {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("messages")
      .select("id,name,email,reason,message,read,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as RecentMsg[];
  } catch {
    return [];
  }
}