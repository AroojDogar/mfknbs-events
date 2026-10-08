"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" className="h-9 w-9 rounded-full ring-2 ring-saffron-500/60" />
            <span className="leading-tight">
              <span className="block font-display font-semibold text-navy-900">MFKNBS Admin</span>
              <span className="block text-[11px] text-muted">{email}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-navy-50 hover:text-navy-900 sm:inline-flex">
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <button
              onClick={async () => { await supabaseBrowser().auth.signOut(); router.replace("/admin/login"); router.refresh(); }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </>
  );
}
