"use client";
import Link from "next/link";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./category";
import { Magnetic } from "./magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

export type HeroItem = { slug: string; title: string; category: Category; date: string };

export function Hero({ highlights, latest }: { highlights: HeroItem[]; latest: HeroItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sealY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const sealRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bigX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  // Cursor-following spotlight
  const mx = useSpring(useMotionValue(70), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgba(232,147,47,0.18), transparent 60%)`;

  // Rotating "latest" ticker
  const [i, setI] = useState(0);
  useEffect(() => {
    if (latest.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % latest.length), 3800);
    return () => clearInterval(t);
  }, [latest.length]);

  const lines = [["Shaping", "leaders,"], ["advancing", "*ideas,*"], ["building", "*impact.*"]];

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden bg-navy-950 pb-28 pt-32 text-white sm:pt-40 lg:min-h-[100svh] lg:pb-36"
    >
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div style={{ background: glow }} className="absolute inset-0 -z-10" />
      <div className="absolute -bottom-60 -left-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-navy-600/50 blur-[120px]" />

      {/* Giant outlined wordmark drifting with scroll */}
      <motion.p style={{ x: bigX }} aria-hidden className="text-outline pointer-events-none absolute -bottom-6 left-0 -z-10 select-none whitespace-nowrap font-display text-[22vw] font-semibold leading-none">
        MFKNBS · MFKNBS
      </motion.p>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:px-8">
        <motion.div style={{ y: textY, opacity: fade }}>
          {/* Latest-activity ticker (always the newest events) */}
          {latest.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <Link href={`/events/${latest[i].slug}`} className="group inline-flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur transition hover:border-saffron-500/60">
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-saffron-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-950">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-950" /> Latest
                </span>
                <span className="relative h-5 w-[min(22rem,55vw)] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="block truncate font-medium text-white/80 group-hover:text-white">
                      {latest[i].title}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-saffron-400 transition group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}

          <h1 className="mt-8 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.2rem]">
            {lines.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, delay: 0.15 + li * 0.12, ease }}>
                  {line.map((w, wi) => (
                    <span key={wi} className={w.startsWith("*") ? "italic text-saffron-400" : ""}>
                      {w.replace(/\*/g, "")}{wi < line.length - 1 ? " " : ""}
                    </span>
                  ))}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
          >
            The living record of conferences, industry partnerships, research and student milestones at
            <span className="font-semibold text-white"> Malik Firoz Khan Noon Business School</span>, University of Sargodha.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.75, ease }} className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/events" className="group inline-flex items-center gap-2 rounded-full bg-saffron-500 px-7 py-4 font-bold text-navy-950 shadow-xl shadow-saffron-500/25 transition hover:bg-saffron-400">
                Explore activities <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/booklet" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/10">
                <BookOpen className="h-4 w-4" /> Open the booklet
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Seal */}
        <motion.div style={{ y: sealY, rotate: sealRotate }} className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[26rem]">
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.4, delay: 0.2, ease }} className="absolute inset-0">
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
              <defs>
                <path id="ring" d="M200,200 m-186,0 a186,186 0 1,1 372,0 a186,186 0 1,1 -372,0" />
              </defs>
              <circle cx="200" cy="200" r="198" fill="none" stroke="rgb(232 147 47 / 0.45)" strokeWidth="1" strokeDasharray="2 10" />
              <text fill="rgb(255 255 255 / 0.4)" fontSize="11" letterSpacing="5" fontWeight="700">
                <textPath href="#ring">KNOWLEDGE · LEADERSHIP · RESEARCH · INDUSTRY · COMMUNITY · KNOWLEDGE · LEADERSHIP · RESEARCH ·</textPath>
              </text>
              {Array.from({ length: 3 }).map((_, k) => {
                const a = (k / 3) * Math.PI * 2;
                // Rounded so server and browser render identical numbers (avoids hydration mismatch)
                return <circle key={k} cx={(200 + 198 * Math.cos(a)).toFixed(2)} cy={(200 + 198 * Math.sin(a)).toFixed(2)} r="5" fill="#e8932f" />;
              })}
            </svg>
            <div className="absolute inset-[15%] rounded-full bg-white p-3 shadow-[0_0_140px_rgba(232,147,47,0.35)] ring-4 ring-saffron-500/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Malik Firoz Khan Noon Business School seal" className="h-full w-full rounded-full object-contain" />
            </div>
          </motion.div>

          {highlights.slice(0, 3).map((h, k) => (
            <FloatCard key={h.slug} item={h} delay={1.1 + k * 0.2} className={["-left-4 -top-4 sm:-left-24", "-right-2 top-[55%] sm:-right-16", "-bottom-10 left-0 sm:-left-10"][k]} />
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 lg:flex">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span className="absolute inset-x-0 top-0 h-4 bg-saffron-400" animate={{ y: [-16, 40] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}

function FloatCard({ item, className, delay }: { item: HeroItem; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, y: { delay, duration: 5 + delay, repeat: Infinity, ease: "easeInOut" } }}
      className={"absolute w-[13rem] sm:w-[14.5rem] " + className}
    >
      <Link href={`/events/${item.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-navy-900/80 px-3.5 py-3 shadow-2xl backdrop-blur-xl transition hover:border-saffron-500/60">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saffron-500 text-navy-950">
          <CategoryIcon category={item.category} className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="line-clamp-2 text-[12.5px] font-bold leading-snug text-white">{item.title}</span>
          <span className="block text-[11px] text-white/55">{item.category}</span>
        </span>
      </Link>
    </motion.div>
  );
}
