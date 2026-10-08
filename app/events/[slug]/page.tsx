import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin, Users } from "lucide-react";
import { getEvent, getEvents, isUpcoming } from "@/lib/events";
import { formatDate } from "@/lib/format";
import { SINGLE_PHOTO_CATEGORIES } from "@/lib/types";
import { CategoryPill } from "@/components/category";
import { EventCard } from "@/components/event-card";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";
import { ShareButton } from "@/components/share-button";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = await getEvent((await params).slug);
  if (!r) return {};
  return { title: r.event.title, description: r.event.summary, openGraph: { images: r.event.images?.[0] ? [r.event.images[0]] : ["/logo.jpg"] } };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = await getEvent((await params).slug);
  if (!r) notFound();
  const { event: e, newer, older, all } = r;
  const related = all.filter((x) => x.category === e.category && x.slug !== e.slug).slice(0, 3);
  const upcoming = isUpcoming(e);
  const single = SINGLE_PHOTO_CATEGORIES.includes(e.category);
  const cover = !single ? e.images?.[0] : undefined;

  return (
    <main>
      <section className="relative overflow-hidden bg-navy-950 pb-16 pt-32 text-white">
        {cover && (
          <div className="absolute inset-0">
            <Image src={cover} alt="" fill priority sizes="100vw" className="scale-105 object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
          </div>
        )}
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <p aria-hidden className="text-outline pointer-events-none absolute -bottom-4 right-0 select-none font-display text-[13vw] font-semibold leading-none">{e.date.slice(0, 4)}</p>
        <div className="absolute -right-40 -top-20 h-96 w-96 rounded-full bg-saffron-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryPill category={e.category} tone="dark" />
              {upcoming && <span className="rounded-full bg-saffron-500 px-2.5 py-1 text-[11px] font-bold text-navy-950">Upcoming</span>}
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{e.title}</h1>
            <p className="mt-5 max-w-3xl text-lg text-white/70">{e.summary}</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-saffron-400" />{formatDate(e)}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-saffron-400" />{e.venue || "MFKNBS, University of Sargodha"}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="-mt-2 pt-10">
          <Gallery images={e.images ?? []} title={e.title} single={single} />
        </Reveal>

        <div className="grid gap-12 py-16 lg:grid-cols-[1fr_280px]">
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-ink/85 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-saffron-600">
              {e.description.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {!!e.highlights?.length && (
              <div className="mt-10 rounded-3xl border border-line bg-white p-7">
                <p className="eyebrow text-saffron-600">Highlights</p>
                <ul className="mt-4 space-y-3">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-ink/85"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-saffron-500" />{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-navy-900 p-6 text-white">
              <p className="eyebrow text-saffron-400">At a glance</p>
              <dl className="mt-4 space-y-4 text-sm">
                <div><dt className="text-white/50">Date</dt><dd className="font-semibold">{formatDate(e)}</dd></div>
                <div><dt className="text-white/50">Theme</dt><dd className="font-semibold">{e.category}</dd></div>
                <div><dt className="text-white/50">Venue</dt><dd className="font-semibold">{e.venue || "MFKNBS, University of Sargodha"}</dd></div>
              </dl>
              <ShareButton title={e.title} />
            </div>
            {!!e.people?.length && (
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="eyebrow flex items-center gap-2 text-saffron-600"><Users className="h-3.5 w-3.5" /> People</p>
                <ul className="mt-4 space-y-3">
                  {e.people.map((p) => {
                    const [name, ...role] = p.split(", ");
                    return (
                      <li key={p} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-xs font-bold text-saffron-600">
                          {name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Miss|Mrs\.)\s*/g, "").replace(/^(Dr\.)\s*/, "").charAt(0)}
                        </span>
                        <span className="text-sm leading-snug"><span className="block font-semibold text-navy-900">{name}</span>{role.length > 0 && <span className="text-muted">{role.join(", ")}</span>}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>

        <nav className="grid gap-4 border-t border-line py-10 sm:grid-cols-2">
          {older ? (
            <Link href={`/events/${older.slug}`} className="group rounded-2xl border border-line bg-white p-5 transition hover:border-navy-700">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted"><ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" /> Previous</span>
              <span className="mt-2 block font-display text-lg font-semibold text-navy-900">{older.title}</span>
            </Link>
          ) : <span />}
          {newer && (
            <Link href={`/events/${newer.slug}`} className="group rounded-2xl border border-line bg-white p-5 text-right transition hover:border-navy-700">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">Next <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              <span className="mt-2 block font-display text-lg font-semibold text-navy-900">{newer.title}</span>
            </Link>
          )}
        </nav>
      </div>

      {related.length > 0 && (
        <section className="bg-paper-2 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-semibold text-navy-900">More in {e.category}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((x, i) => <Reveal key={x.slug} delay={i * 0.06}><EventCard event={x} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
