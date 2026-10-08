import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

/** Returns the signed-in admin, or redirects. */
export async function requireAdmin() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok } = await sb.rpc("is_admin");
  return { sb, user, isAdmin: Boolean(ok) };
}
