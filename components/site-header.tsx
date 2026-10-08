"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Activities" },
  { href: "/#upcoming", label: "Upcoming" },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overDark = path === "/" || path.startsWith("/events/");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  if (path.startsWith("/admin") || path.startsWith("/booklet")) return null;

  const dark = overDark && !scrolled && !open;

  return (
    <header
      className={
        "no-print fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
        (dark ? "bg-transparent" : "border-b border-line/80 bg-paper/85 backdrop-blur-xl")
      }
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" style={{ height: 72 }}>
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="MFKNBS logo" className="h-11 w-11 shrink-0 rounded-full bg-white object-contain ring-2 ring-saffron-500/60" />
          <span className="min-w-0 leading-tight">
            <span className={"block font-display text-lg font-semibold tracking-tight " + (dark ? "text-white" : "text-navy-900")}>MFKNBS</span>
            <span className={"block truncate text-[11px] font-medium " + (dark ? "text-white/60" : "text-muted")}>
              Activities &amp; Events · University of Sargodha
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href) && !n.href.includes("#");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                  (dark ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-navy-800") +
                  (active ? (dark ? " text-white" : " text-navy-800") : "")
                }
              >
                {n.label}
                {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-saffron-500" />}
              </Link>
            );
          })}
          <Link
            href="/booklet"
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-saffron-500/25 transition hover:-translate-y-0.5 hover:bg-saffron-400"
          >
            <BookOpen className="h-4 w-4" /> Booklet
          </Link>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className={"rounded-full p-2 md:hidden " + (dark ? "text-white" : "text-navy-900")}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold text-navy-900 hover:bg-navy-50">
                  {n.label}
                </Link>
              ))}
              <Link href="/booklet" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-saffron-500 px-5 py-3 font-bold text-navy-950">
                <BookOpen className="h-4 w-4" /> View Booklet
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
