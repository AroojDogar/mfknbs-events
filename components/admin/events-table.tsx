"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarClock, ImageIcon, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import type { SchoolEvent } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { CategoryIcon } from "../category";
import { refreshSite } from "@/app/admin/actions";

export function EventsTable({ events }: { events: SchoolEvent[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const today = new Date(Date.now() + 5 * 3600_000).toISOString().slice(0, 10);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return events.filter((e) => !s || (e.title + e.category + e.date).toLowerCase().includes(s));
  }, [events, q]);

  const upcoming = events.filter((e) => (e.end_date ?? e.date) >= today).length;
  const noPhotos = events.filter((e) => !e.images?.length).length;

  async function remove(e: SchoolEvent) {
    if (!confirm(`Delete "${e.title}"? This cannot be undone.`)) return;
    setBusy(e.id!);
    const { error } = await supabaseBrowser().from("events").delete().eq("id", e.id!);
    setBusy(null);
    if (error) return alert(error.message);
    await refreshSite();
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl font-semibold text-navy-900">Events</h1>
          <p className="mt-1 text-muted">Add, edit and remove the activities shown on the website.</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-3 font-bold text-navy-950 shadow-lg shadow-saffron-500/25 transition hover:bg-saffron-400">
          <Plus className="h-5 w-5" /> Add new event
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Total events", v: events.length, i: <CalendarClock className="h-5 w-5" /> },
          { l: "Upcoming", v: upcoming, i: <Star className="h-5 w-5" /> },
          { l: "Missing photos", v: noPhotos, i: <ImageIcon className="h-5 w-5" /> },
        ].map((s) => (
          <div key={s.l} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800">{s.i}</span>
            <span><span className="block font-display text-3xl font-semibold text-navy-900">{s.v}</span><span className="text-sm text-muted">{s.l}</span></span>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="border-b border-line p-4">
          <label className="relative block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, category or date…" className="w-full rounded-xl border border-line py-2.5 pl-10 pr-3 text-sm outline-none focus:border-saffron-500" />
          </label>
        </div>
        <ul className="divide-y divide-line">
          {list.map((e) => {
            const up = (e.end_date ?? e.date) >= today;
            return (
              <li key={e.id} className="flex items-center gap-4 p-4 hover:bg-navy-50/40">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                  {e.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="placeholder-stripes flex h-full w-full items-center justify-center"><CategoryIcon category={e.category} className="h-5 w-5 text-navy-700/40" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy-900">{e.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                    <span>{formatDate(e)}</span>·<span>{e.category}</span>
                    {up && <span className="rounded-full bg-saffron-100 px-2 py-0.5 font-bold text-saffron-600">Upcoming</span>}
                    {e.featured && <span className="rounded-full bg-navy-50 px-2 py-0.5 font-bold text-navy-800">Featured</span>}
                    {!e.images?.length && <span className="text-amber-600">No photos</span>}
                  </p>
                </div>
                <Link href={`/admin/events/${e.id}`} className="rounded-full p-2.5 text-navy-800 hover:bg-navy-100" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                <button disabled={busy === e.id} onClick={() => remove(e)} className="rounded-full p-2.5 text-red-600 hover:bg-red-50 disabled:opacity-40" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </li>
            );
          })}
          {list.length === 0 && <li className="p-10 text-center text-muted">No events found.</li>}
        </ul>
      </div>
    </>
  );
}
