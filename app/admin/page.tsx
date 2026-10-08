import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/admin/setup-notice";
import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { NotAdmin } from "@/components/admin/not-admin";
import { EventsTable } from "@/components/admin/events-table";
import type { SchoolEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  const { sb, user, isAdmin } = await requireAdmin();
  if (!isAdmin) return <AdminShell email={user.email ?? ""}><NotAdmin email={user.email ?? ""} /></AdminShell>;
  const { data } = await sb.from("events").select("*").order("date", { ascending: false });
  return (
    <AdminShell email={user.email ?? ""}>
      <EventsTable events={(data ?? []) as SchoolEvent[]} />
    </AdminShell>
  );
}
