"use client";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export function BookletToolbar() {
  return (
    <div className="no-print fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <p className="hidden font-display text-white sm:block">MFKNBS Activities Booklet</p>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-bold text-navy-950 hover:bg-saffron-400">
          <Printer className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>
    </div>
  );
}
