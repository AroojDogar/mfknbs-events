"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setErr(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-saffron-500/25 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="" className="h-12 w-12 rounded-full bg-white" />
          <span className="font-display text-xl">MFKNBS</span>
        </Link>
        <div className="relative">
          <p className="eyebrow text-saffron-400">Focal person portal</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">Keep the school&apos;s story <em className="text-saffron-400">up to date.</em></h1>
          <p className="mt-4 max-w-md text-white/60">Add new events, upload photos and announce what&apos;s coming next. Changes appear on the website within seconds.</p>
        </div>
        <p className="relative text-xs text-white/40">Malik Firoz Khan Noon Business School · University of Sargodha</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="" className="h-14 w-14 rounded-full bg-white ring-2 ring-saffron-500 lg:hidden" />
          <h2 className="mt-6 font-display text-3xl font-semibold text-navy-900">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Admin access for the MFKNBS events website.</p>
          <label className="mt-8 block text-sm font-semibold text-navy-900">Email
            <span className="relative mt-1.5 block">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3 font-normal outline-none focus:border-saffron-500 focus:ring-4 focus:ring-saffron-400/30" />
            </span>
          </label>
          <label className="mt-4 block text-sm font-semibold text-navy-900">Password
            <span className="relative mt-1.5 block">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3 font-normal outline-none focus:border-saffron-500 focus:ring-4 focus:ring-saffron-400/30" />
            </span>
          </label>
          {err && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{err}</p>}
          <button disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3.5 font-bold text-white transition hover:bg-navy-800 disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
          <Link href="/" className="mt-6 block text-center text-sm font-semibold text-muted hover:text-navy-900">← Back to website</Link>
        </motion.form>
      </div>
    </main>
  );
}
