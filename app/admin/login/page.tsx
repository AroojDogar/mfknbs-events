import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/admin/setup-notice";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  return <LoginForm />;
}
