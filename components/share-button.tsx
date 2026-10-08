"use client";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) await navigator.share({ title, url });
          else { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 2000); }
        } catch { /* cancelled */ }
      }}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron-500 px-4 py-3 text-sm font-bold text-navy-950 transition hover:bg-saffron-400"
    >
      {done ? <><Check className="h-4 w-4" /> Link copied</> : <><Share2 className="h-4 w-4" /> Share this event</>}
    </button>
  );
}
