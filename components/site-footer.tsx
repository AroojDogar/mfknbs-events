"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Lock } from "lucide-react";

export function SiteFooter() {
  const path = usePathname();
  if (path.startsWith("/admin") || path.startsWith("/booklet")) return null;
  return (
    <footer className="no-print relative overflow-hidden bg-navy-950 text-white">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="" className="h-16 w-16 rounded-full bg-white ring-2 ring-saffron-500" />
              <div>
                <p className="font-display text-xl font-semibold">Malik Firoz Khan Noon</p>
                <p className="font-display text-xl font-semibold text-saffron-400">Business School</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              A record of the conferences, partnerships, research and student milestones that shape MFKNBS at the University of Sargodha.
            </p>
          </div>
          <div>
            <p className="eyebrow text-saffron-400">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li><Link className="hover:text-white" href="/events">All events</Link></li>
              <li><Link className="hover:text-white" href="/#upcoming">Upcoming</Link></li>
              <li><Link className="hover:text-white" href="/booklet">Activities booklet</Link></li>
              <li><Link className="hover:text-white" href="/#about">About the school</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-saffron-400">Visit</p>
            <p className="mt-4 flex gap-2 text-sm text-white/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              Malik Firoz Khan Noon Business School, University of Sargodha, Sargodha, Punjab, Pakistan
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} MFKNBS, University of Sargodha. All rights reserved.</p>
          <Link href="/admin" className="inline-flex items-center gap-1.5 hover:text-white/80"><Lock className="h-3.5 w-3.5" /> Focal person login</Link>
        </div>
      </div>
    </footer>
  );
}
