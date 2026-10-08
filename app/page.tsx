import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarClock, Quote } from "lucide-react";
import { getEvents, isUpcoming, todayISO } from "@/lib/events";
import { computeStats } from "@/lib/stats";
import { formatDate, monthKey } from "@/lib/format";
import { CATEGORIES, SINGLE_PHOTO_CATEGORIES } from "@/lib/types";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { EventCard } from "@/components/event-card";
import { CategoryIcon, CategoryPill } from "@/components/category";
import { PhotoSlot } from "@/components/photo-slot";
import { Countdown } from "@/components/countdown";
import { SplitHeading } from "@/components/split-heading";
import { Journey, type JourneyMonth } from "@/components/journey";
import { PartnersWall } from "@/components/partners-wall";
import { YearChart } from "@/components/year-chart";

export const revalidate = 60;

export default async function Home() {
  const events = await getEvents();
  const today = todayISO();
  const stats = computeStats(events, today);
  const upcoming = events.filter((e) => isUpcoming(e, today)).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => !isUpcoming(e, today));
  const featuredAll = past.filter((e) => e.featured);
  const featured = [...featuredAll]
    .sort((a, b) => Number(b.category === "Conference") - Number(a.category === "Conference") || b.date.localeCompare(a.date))
    .slice(0, 5);
  const latest = past.slice(0, 3);
  const pick = (e: (typeof events)[number]) => ({ slug: e.slug, title: e.title, category: e.category, date: e.date });

  // Months, oldest first, for the journey
  const monthMap = new Map<string, JourneyMonth>();
  [...past].reverse().forEach((e) => {
    const k = e.date.slice(0, 7);
    const [month, year] = monthKey(e.date).split(" ");
    if (!monthMap.has(k)) monthMap.set(k, { key: k, month, year, items: [] });
    monthMap.get(k)!.items.push(pick(e));
  });

  const statTiles = [
    { n: stats.total, label: "Activities on record" },
    { n: stats.research, label: "Research outputs & grants" },
    { n: stats.partnerships, label: "Industry & academic MoUs" },
    { n: stats.international, label: "International engagements" },
  ];

  const marquee = featuredAll.length ? featuredAll.map((e) => e.title) : past.slice(0, 8).map((e) => e.title);
  const count = (c: string) => past.filter((e) => e.category === c).length;

  return (
    <main>
      <Hero highlights={featured.slice(0, 3).map(pick)} latest={past.slice(0, 6).map(pick)} />

      {/* Stats */}
      <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-navy-900/10 lg:grid-cols-4">
          {statTiles.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className={"group relative p-6 sm:p-8 " + (i % 2 ? "" : "border-r border-line ") + (i < 2 ? "border-b border-line lg:border-b-0 " : "") + (i === 1 ? "lg:border-r " : "")}>
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-saffron-500 transition-transform duration-500 group-hover:scale-x-100" />
              <p className="font-display text-4xl font-semibold text-navy-900 sm:text-6xl"><Counter to={s.n} /></p>
              <p className="mt-2 text-sm font-medium text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Marquee (auto from featured events) */}
      <section className="mt-20 overflow-hidden border-y border-navy-900 bg-navy-900 py-5 text-white" aria-label="Highlights">
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl italic">
              {m} <span className="not-italic text-saffron-500">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-saffron-600">Defining moments</p>
            <SplitHeading text="Milestones that put MFKNBS *on* *the* *map*" className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl" />
          </div>
          <Link href="/events" className="group inline-flex items-center gap-2 font-bold text-navy-800">
            All activities <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-6 md:grid-rows-2">
          {featured.map((e, i) => {
            const big = i === 0;
            return (
              <Reveal key={e.slug} delay={i * 0.07} className={big ? "md:col-span-3 md:row-span-2" : "md:col-span-3"}>
                <Link href={`/events/${e.slug}`} className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-3xl bg-navy-900">
                  <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
                    <PhotoSlot src={e.images?.[0]} alt={e.title} label="" fit={SINGLE_PHOTO_CATEGORIES.includes(e.category) ? "contain" : "cover"} className="h-full w-full" sizes="(max-width:768px) 100vw, 50vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/10" />
                  <div className={"relative p-7 " + (big ? "sm:p-10" : "")}>
                    <CategoryPill category={e.category} tone="dark" />
                    <h3 className={"mt-3 font-display font-semibold leading-tight text-white " + (big ? "text-3xl sm:text-4xl" : "text-2xl")}>{e.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-saffron-400">{formatDate(e)}</p>
                    {big && <p className="mt-3 max-w-md text-white/70">{e.summary}</p>}
                  </div>
                  <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition group-hover:rotate-45 group-hover:bg-saffron-500 group-hover:text-navy-950">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Journey — horizontal scroll through months */}
      <Journey months={Array.from(monthMap.values())} />

      {/* Latest */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-saffron-600">Latest from the school</p>
            <SplitHeading text="What's *new* at MFKNBS" className="mt-3 font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl" />
          </div>
          <Link href="/events" className="group inline-flex items-center gap-2 font-bold text-navy-800">
            Browse the full archive <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {latest.map((e, i) => <Reveal key={e.slug} delay={i * 0.08}><EventCard event={e} /></Reveal>)}
        </div>
      </section>

      {/* By the numbers */}
      <section className="relative overflow-hidden bg-paper-2 py-24">
        <div className="bg-grid-ink absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="eyebrow text-saffron-600">By the numbers</p>
              <SplitHeading text="A school that *keeps* *moving*" className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl" />
              <p className="mt-5 max-w-md leading-relaxed text-muted">Every figure here updates itself the moment a new activity is published.</p>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
                {[
                  { n: stats.conferences, l: "International conferences & forums" },
                  { n: stats.seminars, l: "Seminars, talks & workshops" },
                  { n: stats.achievements, l: "Faculty, student & alumni honours" },
                  { n: stats.people, l: "Speakers, scholars & guests featured" },
                ].map((x) => (
                  <div key={x.l} className="border-t-2 border-navy-900 pt-4">
                    <dt className="font-display text-4xl font-semibold text-navy-900"><Counter to={x.n} /></dt>
                    <dd className="mt-1 text-sm text-muted">{x.l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Reveal className="rounded-3xl border border-line bg-white p-6 sm:p-10">
              <p className="font-display text-2xl font-semibold text-navy-900">Activities per year</p>
              <p className="mb-8 mt-1 text-sm text-muted">Hover a year to see its themes.</p>
              <YearChart rows={stats.byYear} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Partners */}
      {stats.partners.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-saffron-600">Partnerships</p>
              <SplitHeading text="Building bridges with *industry* and *academia*" className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl" />
            </div>
            <p className="max-w-xs text-sm text-muted">{stats.partners.length} memoranda of understanding signed for internships, research, training and placements.</p>
          </div>
          <PartnersWall partners={[...stats.partners].reverse()} />
        </section>
      )}

      {/* Themes */}
      <section className="bg-navy-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="eyebrow text-saffron-400">Browse by theme</p>
            <SplitHeading text="Many ways the school *shows* *up*" className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl" />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.filter((c) => count(c) > 0).map((c, i) => (
              <Reveal key={c} delay={i * 0.04}>
                <Link href={`/events?category=${encodeURIComponent(c)}`} className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-saffron-500/60">
                  <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-saffron-500/0 blur-2xl transition group-hover:bg-saffron-500/30" />
                  <span className="relative flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-saffron-400 transition group-hover:bg-saffron-500 group-hover:text-navy-950">
                      <CategoryIcon category={c} className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/30 transition group-hover:text-saffron-400" />
                  </span>
                  <span className="relative">
                    <span className="block font-display text-4xl font-semibold"><Counter to={count(c)} /></span>
                    <span className="block text-sm font-semibold text-white/60">{c}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section id="upcoming" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
        <p className="eyebrow text-saffron-600">On the calendar</p>
        <SplitHeading text="Upcoming *events*" className="mt-3 font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl" />
        {upcoming.length === 0 ? (
          <Reveal className="mt-10 flex flex-col items-start gap-6 rounded-3xl border border-dashed border-navy-100 bg-white p-8 sm:flex-row sm:items-center sm:p-10">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-saffron-500 text-navy-950"><CalendarClock className="h-8 w-8" /></span>
            <div>
              <p className="font-display text-2xl font-semibold text-navy-900">New events will be announced soon.</p>
              <p className="mt-2 max-w-xl text-muted">Conferences, seminars and forums for the coming semester are being planned. Check back here for dates and details.</p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.08}>
                <Link href={`/events/${e.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-navy-950 p-7 text-white transition hover:-translate-y-1">
                  <div className="bg-grid absolute inset-0 opacity-50" />
                  <div className="relative"><CategoryPill category={e.category} tone="dark" /></div>
                  <h3 className="relative mt-4 font-display text-2xl font-semibold leading-tight">{e.title}</h3>
                  <p className="relative mt-2 font-semibold text-saffron-400">{formatDate(e)}{e.venue ? ` · ${e.venue}` : ""}</p>
                  <p className="relative mt-3 text-sm text-white/60">{e.summary}</p>
                  <div className="relative mt-auto pt-6"><Countdown date={e.date} /></div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-saffron-600">About the school</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl">Malik Firoz Khan Noon Business School</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              The business school of the University of Sargodha, offering BBA, B.Com, MS and PhD programs, with business programs accredited by the
              National Business Education Accreditation Council (NBEAC).
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              The school links classrooms to industry through partnerships with companies, trade bodies and universities, an active alumni
              association, an international advisory board, and faculty who publish and present research around the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["BBA (2 & 4 years)", "B.Com", "MS", "PhD", "NBEAC Accredited"].map((t) => (
                <span key={t} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-800">{t}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <figure className="relative overflow-hidden rounded-3xl bg-navy-900 p-10 text-white sm:p-12">
              <div className="bg-grid absolute inset-0 opacity-50" />
              <Quote className="relative h-10 w-10 text-saffron-500" />
              <blockquote className="relative mt-6 font-display text-2xl leading-snug sm:text-3xl">
                Innovation, impact and academic rigour are at the heart of everything we do.
              </blockquote>
              <figcaption className="relative mt-8 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="" className="h-12 w-12 rounded-full bg-white" />
                <span>
                  <span className="block font-bold">Malik Firoz Khan Noon Business School</span>
                  <span className="block text-sm text-white/60">University of Sargodha</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Booklet CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-saffron-500 px-8 py-14 sm:px-14">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full border-[40px] border-white/15" />
          <div className="absolute -bottom-24 right-40 h-48 w-48 rounded-full border-[30px] border-navy-900/10" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="eyebrow text-navy-900/70">For visitors & guests</p>
              <h2 className="mt-2 max-w-xl font-display text-4xl font-semibold leading-tight text-navy-950">The complete activities booklet, ready to print.</h2>
              <p className="mt-3 max-w-lg text-navy-950/70">Every activity, in order, with dates and details. It grows automatically as new events are added.</p>
            </div>
            <Link href="/booklet" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-950 px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-900">
              <BookOpen className="h-5 w-5" /> Open booklet
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
