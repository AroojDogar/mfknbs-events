"use client";
import { useEffect, useState } from "react";

export function Countdown({ date }: { date: string }) {
  const target = new Date(date + "T09:00:00+05:00").getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <div className="h-14" />;
  const diff = Math.max(0, target - now);
  const units = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hrs", Math.floor(diff / 36e5) % 24],
    ["Min", Math.floor(diff / 6e4) % 60],
    ["Sec", Math.floor(diff / 1e3) % 60],
  ] as const;
  if (diff === 0) return <p className="font-bold text-saffron-400">Happening now</p>;
  return (
    <div className="flex gap-2">
      {units.map(([l, v]) => (
        <div key={l} className="min-w-14 rounded-xl bg-white/10 px-2 py-2 text-center ring-1 ring-white/10">
          <div className="font-display text-xl font-semibold tabular-nums text-white">{String(v).padStart(2, "0")}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">{l}</div>
        </div>
      ))}
    </div>
  );
}
