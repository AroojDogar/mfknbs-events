export function NotAdmin({ email }: { email: string }) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
      <h1 className="font-display text-2xl font-semibold text-navy-900">Signed in, but not an editor yet</h1>
      <p className="mt-2 text-ink/80">
        <b>{email}</b> is not in the <code>admin_users</code> table. In Supabase → SQL Editor run:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-navy-950 p-4 text-sm text-white">insert into public.admin_users (email) values (&apos;{email}&apos;);</pre>
    </div>
  );
}
