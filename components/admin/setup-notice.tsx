import Link from "next/link";
import { Database } from "lucide-react";

export function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-line bg-white p-8 shadow-xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-100 text-saffron-600"><Database /></span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-navy-900">Connect the database</h1>
        <p className="mt-3 text-muted">The admin panel needs Supabase. The public site is currently showing events from <code className="rounded bg-navy-50 px-1.5">lib/events-data.ts</code>.</p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-ink/80">
          <li>Create a free project at supabase.com.</li>
          <li>Run <code>supabase/schema.sql</code> then <code>supabase/seed.sql</code> in the SQL Editor.</li>
          <li>Authentication → Users → Add user (focal person&apos;s email + password), then add that email to <code>admin_users</code>.</li>
          <li>Put the project URL and anon key in <code>.env.local</code> (and in Vercel → Settings → Environment Variables).</li>
        </ol>
        <Link href="/" className="mt-6 inline-block font-bold text-saffron-600">← Back to site</Link>
      </div>
    </main>
  );
}
