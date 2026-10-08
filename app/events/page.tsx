import type { Metadata } from "next";
import { getEvents, isUpcoming, todayISO } from "@/lib/events";
import { computeStats } from "@/lib/stats";
import { EventsExplorer } from "@/components/events-explorer";
import { Spotlight } from "@/components/spotlight";
import { SplitHeading } from "@/components/split-heading";
import { Counter } from "@/components/counter";

export const revalidate = 60;
export const metadata: Metadata = { title: "Activities" };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [events, sp] = await Promise.all([getEvents(), searchParams]);
  const today = todayISO();
  const stats = computeStats(events, today);
  const spotlight = events.filter((e) => e.featured && !isUpcoming(e, today)).slice(0, 5);

  return (
    <main className="pt-[72px]">
      <section className="relative overflow-hidden border-b border-line bg-paper-2">
        <div className="bg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        <p aria-hidden className="text-outline-ink pointer-events-none absolute -right-8 bottom-0 select-none font-display text-[16vw] font-semibold leading-none">Archive</p>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-saffron-600">Activities &amp; events</p>
          <SplitHeading as="h1" text="Every activity, *in* *one* *place*" className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-navy-900 sm:text-7xl" />
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Conferences, partnerships, research, accreditation and student life at Malik Firoz Khan Noon Business School — searchable, filterable and always up to date.
          </p>
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { n: stats.total, l: "Activities" },
              { n: stats.themes, l: "Themes" },
              { n: stats.byYear.length, l: "Years on record" },
              { n: stats.thisYear, l: `In ${today.slice(0, 4)}` },
            ].map((x) => (
              <div key={x.l} className="border-l-2 border-saffron-500 pl-4">
                <dt className="font-display text-4xl font-semibold text-navy-900"><Counter to={x.n} /></dt>
                <dd className="text-sm font-semibold text-muted">{x.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {spotlight.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <Spotlight events={spotlight} />
        </section>
      )}

      <EventsExplorer events={events} initialCategory={sp.category ?? null} />
    </main>
  );
}
