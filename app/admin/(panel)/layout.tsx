import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { getAdminCtx, unreadCount } from "@/lib/admin-data";
import AdminShell from "@/components/admin/AdminShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const [ctx, unread] = await Promise.all([getAdminCtx(), unreadCount()]);

  return (
    <AdminShell
      email={user.email ?? ""}
      unread={unread}
      profiles={ctx.meta.profiles}
      active={ctx.meta.active}
      current={ctx.pid}
    >
      {children}
    </AdminShell>
  );
}