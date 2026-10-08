"use client";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./category";

export type JourneyMonth = { key: string; month: string; year: string; items: { slug: string; title: string; category: Category }[] };

/** Pinned section that scrolls sideways through every month on record (desktop); swipeable on mobile. */
export function Journey({ months }: { months: JourneyMonth[] }) {
  const target = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [months.length]);

  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);

  const Card = ({ m, i }: { m: JourneyMonth; i: number }) => {
    const newYear = i === 0 || months[i - 1].year !== m.year;
    return (
      <div className="flex shrink-0 snap-start items-stretch gap-6">
        {newYear && (
          <div className="flex shrink-0 flex-col justify-end pb-4 pr-2">
            <span className="text-outline font-display text-8xl font-semibold leading-none sm:text-9xl">{m.year}</span>
          </div>
        )}
        <div className="group relative flex w-[78vw] max-w-[22rem] shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-saffron-500/50 hover:bg-white/[0.07] sm:w-[22rem]">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl font-semibold text-white">{m.month}</p>
            <p className="text-sm font-bold text-saffron-400">{m.items.length} {m.items.length === 1 ? "activity" : "activities"}</p>
          </div>
          <div className="mt-2 h-px bg-gradient-to-r from-saffron-500/60 to-transparent" />
          <ul className="mt-4 space-y-3">
            {m.items.slice(0, 4).map((it) => (
              <li key={it.slug}>
                <Link href={`/events/${it.slug}`} className="flex gap-3 text-sm text-white/75 transition hover:text-white">
                  <CategoryIcon category={it.category} className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
                  <span className="line-clamp-2">{it.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          {m.items.length > 4 && <p className="mt-auto pt-4 text-xs font-bold text-white/40">+ {m.items.length - 4} more</p>}
        </div>
      </div>
    );
  };

  const Header = (
    <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
      <div>
        <p className="eyebrow text-saffron-400">The journey</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">Month by month, <em className="text-saffron-400">on the record</em></h2>
      </div>
      <p className="hidden max-w-xs text-sm text-white/50 lg:block">Keep scrolling to travel through every month of activity at the school.</p>
    </div>
  );

  return (
    <>
      {/* Desktop: pinned horizontal scroll */}
      <section ref={target} style={{ height: `calc(100vh + ${dist}px)` }} className="relative hidden bg-navy-950 lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="relative">
            {Header}
            <motion.div ref={track} style={{ x }} className="flex w-max gap-6 px-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-[20vw]">
              {months.map((m, i) => <Card key={m.key} m={m} i={i} />)}
            </motion.div>
            <div className="mx-auto mt-10 max-w-7xl px-8">
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div style={{ scaleX: smooth }} className="h-full origin-left rounded-full bg-saffron-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile/tablet: swipe */}
      <section className="relative bg-navy-950 py-20 lg:hidden">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="relative">
          {Header}
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6">
            {months.map((m, i) => <Card key={m.key} m={m} i={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
