import ProfilesManager from "@/components/admin/ProfilesManager";
import { getAdminCtx } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function ProfilesAdmin() {
  const ctx = await getAdminCtx();
  return (
    <ProfilesManager
      profiles={ctx.meta.profiles}
      active={ctx.meta.active}
      current={ctx.pid}
    />
  );
}