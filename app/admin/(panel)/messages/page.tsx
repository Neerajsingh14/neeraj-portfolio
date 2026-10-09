import MessagesManager, { type Msg } from "@/components/admin/MessagesManager";
import { supabaseServer } from "@/lib/supabase-server";
import { mailConfigured } from "@/lib/mail";

export const dynamic = "force-dynamic";

export default async function MessagesAdmin() {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <MessagesManager
      messages={(data ?? []) as Msg[]}
      mailOn={mailConfigured()}
      to={process.env.CONTACT_TO_EMAIL ?? ""}
    />
  );
}