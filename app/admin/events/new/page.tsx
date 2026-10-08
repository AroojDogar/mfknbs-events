import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/admin/setup-notice";
import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { NotAdmin } from "@/components/admin/not-admin";
import { EventForm } from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export default async function NewEvent() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  const { user, isAdmin } = await requireAdmin();
  return (
    <AdminShell email={user.email ?? ""}>
      {isAdmin ? <EventForm /> : <NotAdmin email={user.email ?? ""} />}
    </AdminShell>
  );
}
