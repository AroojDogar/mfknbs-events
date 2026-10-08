import { CATEGORIES, type SchoolEvent } from "./types";

/**
 * Every figure on the site is computed here from the events list,
 * so a new event added in the admin panel updates all numbers automatically.
 */
const INTL = /\b(international|china|chinese|usa|united states|harvard|uk\b|united kingdom|bradford|malaysia|hong kong|qatar|abroad|global)\b/i;

export function computeStats(events: SchoolEvent[], today: string) {
  const past = events.filter((e) => (e.end_date ?? e.date) < today);
  const cat = (c: string) => past.filter((e) => e.category === c).length;

  const years = Array.from(new Set(past.map((e) => e.date.slice(0, 4)))).sort();
  const byYear = years.map((y) => {
    const list = past.filter((e) => e.date.startsWith(y));
    return {
      year: y,
      total: list.length,
      byCategory: CATEGORIES.map((c) => ({ c, n: list.filter((e) => e.category === c).length })).filter((x) => x.n > 0),
    };
  });

  const partners = past
    .filter((e) => e.category === "Partnership & MoU" && /^MoU with /i.test(e.title))
    .map((e) => ({ name: e.title.replace(/^MoU with /i, ""), slug: e.slug, date: e.date }));

  const people = new Set(past.flatMap((e) => (e.people ?? []).map((p) => p.split(",")[0].trim())));
  const international = past.filter((e) => INTL.test(`${e.title} ${e.description} ${e.venue ?? ""}`)).length;
  const photos = past.reduce((n, e) => n + (e.images?.length ?? 0), 0);

  return {
    total: past.length,
    research: cat("Research & Publication"),
    partnerships: cat("Partnership & MoU"),
    conferences: cat("Conference"),
    seminars: cat("Seminar & Talk") + cat("Training & Workshop"),
    achievements: cat("Faculty Achievement") + cat("Alumni") + cat("Student Life"),
    international,
    people: people.size,
    photos,
    themes: CATEGORIES.filter((c) => cat(c) > 0).length,
    byYear,
    partners,
    thisYear: past.filter((e) => e.date.startsWith(today.slice(0, 4))).length,
  };
}

export type SiteStats = ReturnType<typeof computeStats>;
