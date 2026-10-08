"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { SchoolEvent } from "@/lib/types";
import { SINGLE_PHOTO_CATEGORIES } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { CategoryPill } from "./category";
import { PhotoSlot } from "./photo-slot";

/** Auto-rotating showcase of featured events. */
export function Spotlight({ events }: { events: SchoolEvent[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || events.length < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % events.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, events.length]);
  if (!events.length) return null;
  const e = events[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative overflow-hidden rounded-[2rem] bg-navy-950 text-white">
      <div className="grid min-h-[26rem] lg:grid-cols-[1.1fr_1fr]">
        <div className="relative order-2 flex flex-col justify-between p-8 sm:p-12 lg:order-1">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <AnimatePresence mode="wait">
            <motion.div key={e.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="relative">
              <p className="eyebrow text-saffron-400">Spotlight</p>
              <div className="mt-5"><CategoryPill category={e.category} tone="dark" /></div>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{e.title}</h2>
              <p className="mt-3 font-semibold text-saffron-400">{formatDate(e)}</p>
              <p className="mt-4 max-w-lg text-white/65">{e.summary}</p>
              <Link href={`/events/${e.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3 font-bold text-navy-950 transition hover:bg-saffron-400">
                Read the story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
          <div className="relative mt-10 flex gap-2">
            {events.map((x, k) => (
              <button key={x.slug} onClick={() => setI(k)} aria-label={`Show ${x.title}`} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                {k === i ? (
                  <motion.span key={`${i}-${paused}`} className="block h-full origin-left bg-saffron-500" initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 1 : 1 }} transition={{ duration: paused ? 0 : 6, ease: "linear" }} />
                ) : (
                  <span className={"block h-full " + (k < i ? "bg-white/40" : "")} />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="relative order-1 min-h-64 lg:order-2">
          <AnimatePresence mode="popLayout">
            <motion.div key={e.slug} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
              <PhotoSlot src={e.images?.[0]} alt={e.title} fit={SINGLE_PHOTO_CATEGORIES.includes(e.category) ? "contain" : "cover"} className="h-full w-full" sizes="(max-width:1024px) 100vw, 50vw" />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/10" />
        </div>
      </div>
    </div>
  );
}
