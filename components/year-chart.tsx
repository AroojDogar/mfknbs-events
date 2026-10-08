"use client";
import { motion } from "framer-motion";
import { useState } from "react";

type Row = { year: string; total: number; byCategory: { c: string; n: number }[] };

export function YearChart({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.total));
  const [hover, setHover] = useState<string | null>(rows.at(-1)?.year ?? null);
  const active = rows.find((r) => r.year === hover);
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_220px]">
      <div className="flex h-64 items-end gap-4 border-b border-line">
        {rows.map((r, i) => (
          <button key={r.year} onMouseEnter={() => setHover(r.year)} onFocus={() => setHover(r.year)} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className={"font-display text-2xl font-semibold transition " + (hover === r.year ? "text-saffron-600" : "text-navy-900")}>{r.total}</span>
            <motion.span
              initial={{ height: 0 }}
              whileInView={{ height: `${(r.total / max) * 75}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={"w-full max-w-28 rounded-t-2xl transition-colors " + (hover === r.year ? "bg-saffron-500" : "bg-navy-900 group-hover:bg-navy-700")}
            />
          </button>
        ))}
      </div>
      <div className="flex flex-col justify-end">
        <p className="eyebrow text-muted">{active?.year} by theme</p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {active?.byCategory.sort((a, b) => b.n - a.n).slice(0, 6).map((x) => (
            <li key={x.c} className="flex justify-between border-b border-dotted border-line pb-1.5">
              <span className="text-ink/80">{x.c}</span><span className="font-bold text-navy-900">{x.n}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-full -mt-6 flex gap-4 md:col-span-1">
        {rows.map((r) => <span key={r.year} className="flex-1 text-center text-sm font-bold text-muted">{r.year}</span>)}
      </div>
    </div>
  );
}
