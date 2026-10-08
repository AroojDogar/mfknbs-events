import type { Metadata } from "next";
import { getEvents, isUpcoming, todayISO } from "@/lib/events";
import { formatDate, monthKey, sessionOf } from "@/lib/format";
import { CATEGORIES, SINGLE_PHOTO_CATEGORIES, type SchoolEvent } from "@/lib/types";
import { CategoryIcon } from "@/components/category";
import { BookletToolbar } from "@/components/booklet-toolbar";

export const revalidate = 60;
export const metadata: Metadata = { title: "Activities Booklet" };

const Sheet = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={"print-page relative mx-auto w-full max-w-[210mm] overflow-hidden shadow-2xl shadow-black/20 sm:rounded-sm " + (className.includes("bg-") ? "" : "bg-white ") + className}>
    {children}
  </section>
);

export default async function Booklet() {
  const today = todayISO();
  const all = await getEvents();
  const past = all.filter((e) => !isUpcoming(e, today)).sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = all.filter((e) => isUpcoming(e, today)).sort((a, b) => a.date.localeCompare(b.date));

  const sessions = new Map<string, Map<string, SchoolEvent[]>>();
  past.forEach((e) => {
    const s = sessionOf(e.date);
    if (!sessions.has(s)) sessions.set(s, new Map());
    const m = sessions.get(s)!;
    const k = monthKey(e.date);
    m.set(k, [...(m.get(k) ?? []), e]);
  });
  const catCounts = CATEGORIES.map((c) => [c, past.filter((e) => e.category === c).length] as const).filter(([, n]) => n > 0);

  return (
    <main className="min-h-screen bg-[#2a2840] py-24 print:bg-white print:py-0">
      <BookletToolbar />
      <div className="space-y-10 px-3 print:space-y-0 print:px-0">
        {/* Cover */}
        <Sheet className="flex min-h-[297mm] flex-col bg-navy-950 text-white">
          <div className="bg-grid absolute inset-0 opacity-70" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-saffron-500/25 blur-3xl" />
          <div className="relative flex flex-1 flex-col p-[14mm]">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
              <span>University of Sargodha</span><span>Activities Booklet</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="rounded-full bg-white p-3 ring-4 ring-saffron-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="MFKNBS logo" className="h-48 w-48 rounded-full" />
              </div>
              <p className="eyebrow mt-12 text-saffron-400">Malik Firoz Khan Noon Business School</p>
              <h1 className="mt-5 font-display text-6xl font-semibold leading-[1.02]">Activities<br /><em className="text-saffron-400">&amp; Events</em></h1>
              <p className="mt-6 text-lg text-white/70">University of Sargodha</p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/15 pt-6 text-center">
              <div><p className="font-display text-4xl">{past.length}</p><p className="text-xs text-white/50">Activities</p></div>
              <div><p className="font-display text-4xl">{past.filter((e) => e.category === "Research & Publication").length}</p><p className="text-xs text-white/50">Research outputs</p></div>
              <div><p className="font-display text-4xl">{past.filter((e) => e.category === "Partnership & MoU").length}</p><p className="text-xs text-white/50">Partnerships</p></div>
            </div>
          </div>
        </Sheet>

        {/* Contents */}
        <Sheet className="min-h-[297mm] p-[16mm]">
          <p className="eyebrow text-saffron-600">Contents</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-navy-900">The year at a glance</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            This booklet records the activities of Malik Firoz Khan Noon Business School — conferences, partnerships, accreditation,
            research, faculty and student achievements — in the order they happened.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-2">
            {Array.from(sessions.entries()).map(([s, months]) => (
              <div key={s} className="avoid-break col-span-2 mb-6">
                <p className="border-b-2 border-navy-900 pb-1 font-display text-xl font-semibold text-navy-900">Session {s}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-10">
                  {Array.from(months.entries()).map(([m, list]) => (
                    <div key={m} className="flex items-baseline justify-between border-b border-dotted border-line py-1.5 text-sm">
                      <span className="font-semibold text-ink">{m}</span>
                      <span className="text-muted">{list.length} {list.length === 1 ? "event" : "events"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="eyebrow mt-6 text-saffron-600">By theme</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {catCounts.map(([c, n]) => (
              <div key={c} className="flex items-center gap-2 rounded-lg bg-paper px-3 py-2 text-xs">
                <CategoryIcon category={c} className="h-4 w-4 text-saffron-600" />
                <span className="flex-1 font-semibold text-navy-900">{c}</span>
                <span className="font-display text-base text-navy-900">{n}</span>
              </div>
            ))}
          </div>
        </Sheet>

        {/* Events */}
        <Sheet className="px-[16mm] py-[14mm]">
          {Array.from(sessions.entries()).map(([s, months]) => (
            <div key={s}>
              <div className="avoid-break mb-6 mt-2 flex items-end justify-between border-b-4 border-saffron-500 pb-2">
                <h2 className="font-display text-3xl font-semibold text-navy-900">Session {s}</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="" className="h-10 w-10 rounded-full" />
              </div>
              {Array.from(months.entries()).map(([m, list]) => (
                <div key={m} className="mb-8">
                  <p className="eyebrow avoid-break mb-3 text-saffron-600">{m}</p>
                  <div className="space-y-5">
                    {list.map((e) => (
                      <article key={e.slug} className="avoid-break grid grid-cols-[34mm_1fr] gap-5 border-l-2 border-navy-100 pl-4">
                        {e.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={e.images[0]} alt="" className={"h-[24mm] w-[34mm] rounded bg-navy-50 " + (SINGLE_PHOTO_CATEGORIES.includes(e.category) ? "object-contain" : "object-cover")} />
                        ) : (
                          <div className="placeholder-stripes flex h-[24mm] w-[34mm] items-center justify-center rounded">
                            <CategoryIcon category={e.category} className="h-6 w-6 text-navy-700/40" />
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-saffron-600">{formatDate(e)} · {e.category}</p>
                          <h3 className="mt-0.5 font-display text-lg font-semibold leading-snug text-navy-900">{e.title}</h3>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-ink/80">{e.description.split(/\n\s*\n/)[0]}</p>
                          {!!e.highlights?.length && (
                            <p className="mt-1 text-[11px] text-muted">{e.highlights.join(" · ")}</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {upcoming.length > 0 && (
            <div className="avoid-break mt-6 rounded-xl bg-navy-950 p-6 text-white">
              <p className="eyebrow text-saffron-400">Coming up</p>
              <ul className="mt-3 space-y-2">
                {upcoming.map((e) => (
                  <li key={e.slug} className="flex justify-between gap-4 border-b border-white/10 pb-2 text-sm">
                    <span className="font-semibold">{e.title}</span><span className="shrink-0 text-saffron-400">{formatDate(e)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Sheet>

        {/* Back cover */}
        <Sheet className="flex min-h-[297mm] flex-col items-center justify-center bg-navy-950 p-[16mm] text-center text-white">
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" className="mx-auto h-28 w-28 rounded-full bg-white ring-4 ring-saffron-500" />
            <p className="mt-8 font-display text-3xl">Malik Firoz Khan Noon<br /><span className="text-saffron-400">Business School</span></p>
            <p className="mt-4 text-white/60">University of Sargodha · Sargodha, Punjab, Pakistan</p>
            <p className="mx-auto mt-10 max-w-sm font-display text-xl italic text-white/80">&ldquo;Once an MFKNBS student, forever a part of our legacy.&rdquo;</p>
          </div>
        </Sheet>
      </div>
    </main>
  );
}
