import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/admin/setup-notice";
import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { NotAdmin } from "@/components/admin/not-admin";
import { EventForm } from "@/components/admin/event-form";
import type { SchoolEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured) return <SetupNotice />;
  const { sb, user, isAdmin } = await requireAdmin();
  if (!isAdmin) return <AdminShell email={user.email ?? ""}><NotAdmin email={user.email ?? ""} /></AdminShell>;
  const { data } = await sb.from("events").select("*").eq("id", (await params).id).maybeSingle();
  if (!data) notFound();
  return (
    <AdminShell email={user.email ?? ""}>
      <EventForm initial={data as SchoolEvent} />
    </AdminShell>
  );
}
