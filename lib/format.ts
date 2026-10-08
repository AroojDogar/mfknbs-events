import type { SchoolEvent } from "./types";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT = MONTHS.map((m) => m.slice(0, 3));

const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
};

export function formatDate(e: Pick<SchoolEvent, "date" | "end_date" | "date_approx">) {
  const a = parts(e.date);
  if (e.date_approx) return `${MONTHS[a.m]} ${a.y}`;
  if (!e.end_date || e.end_date === e.date) return `${a.d} ${MONTHS[a.m]} ${a.y}`;
  const b = parts(e.end_date);
  if (a.m === b.m && a.y === b.y) return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
  return `${a.d} ${SHORT[a.m]} – ${b.d} ${SHORT[b.m]} ${b.y}`;
}

export function dateBadge(iso: string) {
  const p = parts(iso);
  return { day: String(p.d).padStart(2, "0"), month: SHORT[p.m].toUpperCase(), year: p.y };
}

export function monthKey(iso: string) {
  const p = parts(iso);
  return `${MONTHS[p.m]} ${p.y}`;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

/** Academic-year label, e.g. 2024-10-04 -> "2024–25" (session starts in September) */
export function sessionOf(iso: string) {
  const p = parts(iso);
  const start = p.m >= 8 ? p.y : p.y - 1;
  return `${start}–${String(start + 1).slice(2)}`;
}
