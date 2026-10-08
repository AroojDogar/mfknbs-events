"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { LayoutGrid, Rows3, Search, X } from "lucide-react";
import type { SchoolEvent } from "@/lib/types";
import { CATEGORIES, SINGLE_PHOTO_CATEGORIES } from "@/lib/types";
import { dateBadge, formatDate, monthKey } from "@/lib/format";
import { CategoryIcon } from "./category";
import { EventCard } from "./event-card";
import { PhotoSlot } from "./photo-slot";

export function EventsExplorer({ events, initialCategory }: { events: SchoolEvent[]; initialCategory: string | null }) {
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("All");
  const [cat, setCat] = useState<string>(initialCategory && (CATEGORIES as readonly string[]).includes(initialCategory) ? initialCategory : "All");
  const [view, setView] = useState<"timeline" | "grid">("timeline");

  const years = useMemo(() => ["All", ...Array.from(new Set(events.map((e) => e.date.slice(0, 4)))).sort().reverse()], [events]);
  const cats = useMemo(() => CATEGORIES.filter((c) => events.some((e) => e.category === c)), [events]);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    events.forEach((e) => { if (year === "All" || e.date.startsWith(year)) m[e.category] = (m[e.category] ?? 0) + 1; });
    return m;
  }, [events, year]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 60%", "end 60%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return events.filter(
      (e) =>
        (year === "All" || e.date.startsWith(year)) &&
        (cat === "All" || e.category === cat) &&
        (!s || [e.title, e.summary, e.description, ...(e.people ?? [])].join(" ").toLowerCase().includes(s)),
    );
  }, [events, q, year, cat]);

  const groups = useMemo(() => {
    const m = new Map<string, SchoolEvent[]>();
    filtered.forEach((e) => {
      const k = monthKey(e.date);
      m.set(k, [...(m.get(k) ?? []), e]);
    });
    return Array.from(m.entries());
  }, [filtered]);

  const chip = (active: boolean) =>
    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition " +
    (active ? "bg-navy-900 text-white shadow-lg shadow-navy-900/20" : "bg-white text-ink/70 ring-1 ring-line hover:ring-navy-700");

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* Controls */}
      <div className="sticky top-[72px] z-30 -mx-4 border-b border-line/70 bg-paper/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search activities, people, topics…"
              className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-10 text-sm outline-none ring-saffron-400/50 transition focus:border-saffron-500 focus:ring-4"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-navy-50" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex shrink-0 rounded-full bg-white p-1 ring-1 ring-line">
              {years.map((y) => (
                <button key={y} onClick={() => setYear(y)} className={"relative rounded-full px-4 py-1.5 text-sm font-semibold transition " + (year === y ? "text-white" : "text-ink/70 hover:text-navy-900")}>
                  {year === y && <motion.span layoutId="yearPill" className="absolute inset-0 rounded-full bg-navy-900" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{y === "All" ? "All years" : y}</span>
                </button>
              ))}
            </div>
            <span className="mx-1 h-6 w-px shrink-0 bg-line" />
            <div className="flex shrink-0 rounded-full bg-white p-1 ring-1 ring-line">
              <button onClick={() => setView("timeline")} className={"rounded-full p-2 " + (view === "timeline" ? "bg-navy-900 text-white" : "text-muted")} aria-label="Timeline view"><Rows3 className="h-4 w-4" /></button>
              <button onClick={() => setView("grid")} className={"rounded-full p-2 " + (view === "grid" ? "bg-navy-900 text-white" : "text-muted")} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCat("All")} className={chip(cat === "All")}>All themes</button>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={chip(cat === c) + " inline-flex items-center gap-1.5"}>
              <CategoryIcon category={c} className="h-3.5 w-3.5" /> {c}
              <span className={"ml-0.5 rounded-full px-1.5 text-[11px] " + (cat === c ? "bg-white/20" : "bg-navy-50 text-navy-800")}>{counts[c] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm font-semibold text-muted">
        Showing <span className="text-navy-900">{filtered.length}</span> of {events.length} activities
      </p>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-2xl text-navy-900">No events match those filters.</p>
          <button onClick={() => { setQ(""); setYear("All"); setCat("All"); }} className="mt-4 font-bold text-saffron-600">Reset filters</button>
        </div>
      )}

      {view === "grid" ? (
        <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((e) => (
              <motion.div key={e.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                <EventCard event={e} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div ref={timelineRef} className="relative mt-6">
          <div className="absolute bottom-0 left-[220px] top-0 hidden w-px bg-line md:block">
            <motion.div style={{ scaleY: lineScale }} className="h-full w-full origin-top bg-gradient-to-b from-saffron-500 to-saffron-600" />
          </div>
          {groups.map(([month, list]) => (
            <div key={month} className="relative grid gap-4 border-t border-line py-10 md:grid-cols-[200px_1fr] md:gap-10">
              <span className="absolute left-[214px] top-12 hidden h-3 w-3 rounded-full border-2 border-paper bg-saffron-500 ring-4 ring-saffron-100 md:block" />
              <div className="md:sticky md:top-[200px] md:self-start">
                <p className="font-display text-3xl font-semibold text-navy-900">{month.split(" ")[0]}</p>
                <p className="font-display text-xl text-saffron-600">{month.split(" ")[1]}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">{list.length} {list.length === 1 ? "event" : "events"}</p>
              </div>
              <div className="space-y-4">
                {list.map((e, i) => {
                  const b = dateBadge(e.date);
                  return (
                    <motion.div key={e.slug} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                      <Link href={`/events/${e.slug}`} className="group grid overflow-hidden rounded-2xl border border-line bg-white transition duration-500 hover:-translate-y-0.5 hover:border-saffron-400/70 hover:shadow-2xl hover:shadow-navy-900/10 sm:grid-cols-[220px_1fr]">
                        <PhotoSlot src={e.images?.[0]} alt={e.title} fit={SINGLE_PHOTO_CATEGORIES.includes(e.category) ? "contain" : "cover"} className="aspect-[16/9] transition duration-700 group-hover:scale-105 sm:aspect-auto sm:h-full sm:min-h-40" sizes="220px" />
                        <div className="flex gap-5 p-5 sm:p-6">
                          <div className="hidden h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-line text-navy-900 sm:flex">
                            <span className="font-display text-xl font-semibold leading-none">{e.date_approx ? "—" : b.day}</span>
                            <span className="mt-0.5 text-[10px] font-bold tracking-widest text-saffron-600">{b.month}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-x-2 text-xs font-bold text-saffron-600">
                              <span className="inline-flex items-center gap-1"><CategoryIcon category={e.category} className="h-3.5 w-3.5" />{e.category}</span>
                              <span className="text-muted">· {formatDate(e)}</span>
                            </p>
                            <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-navy-900 group-hover:text-navy-700">{e.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.summary}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
