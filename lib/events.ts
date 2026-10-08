import { createClient } from "@supabase/supabase-js";
import { seedEvents } from "./events-data";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./supabase/config";
import type { SchoolEvent } from "./types";

const byDateDesc = (a: SchoolEvent, b: SchoolEvent) => b.date.localeCompare(a.date);

/** All events, newest first. Reads Supabase when configured, otherwise the local data file. */
export async function getEvents(): Promise<SchoolEvent[]> {
  if (!isSupabaseConfigured) return [...seedEvents].sort(byDateDesc);
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data, error } = await sb.from("events").select("*").order("date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as SchoolEvent[];
  } catch (e) {
    console.error("Supabase read failed, using local data:", e);
    return [...seedEvents].sort(byDateDesc);
  }
}

export async function getEvent(slug: string) {
  const all = await getEvents();
  const i = all.findIndex((e) => e.slug === slug);
  if (i === -1) return null;
  return { event: all[i], newer: all[i - 1] ?? null, older: all[i + 1] ?? null, all };
}

export function todayISO() {
  // Pakistan time, so an event "today" counts as upcoming all day
  return new Date(Date.now() + 5 * 3600_000).toISOString().slice(0, 10);
}

export function isUpcoming(e: SchoolEvent, today = todayISO()) {
  return (e.end_date ?? e.date) >= today;
}
