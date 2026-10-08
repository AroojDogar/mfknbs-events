"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowLeftRight, ImagePlus, Loader2, Save, Star, X } from "lucide-react";
import { CATEGORIES, SINGLE_PHOTO_CATEGORIES, type Category, type SchoolEvent } from "@/lib/types";
import { slugify } from "@/lib/format";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { IMAGE_BUCKET } from "@/lib/supabase/config";
import { refreshSite } from "@/app/admin/actions";
import { EventCard } from "../event-card";

const empty: SchoolEvent = {
  slug: "", title: "", date: new Date().toISOString().slice(0, 10), end_date: null, date_approx: false,
  category: "Seminar & Talk", summary: "", description: "", highlights: [], people: [], venue: "", images: [], featured: false,
};

const input = "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] font-normal text-ink outline-none transition focus:border-saffron-500 focus:ring-4 focus:ring-saffron-400/25";
const label = "block text-sm font-semibold text-navy-900";

export function EventForm({ initial }: { initial?: SchoolEvent }) {
  const router = useRouter();
  const editing = Boolean(initial?.id);
  const [e, setE] = useState<SchoolEvent>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [highlights, setHighlights] = useState((initial?.highlights ?? []).join("\n"));
  const [people, setPeople] = useState((initial?.people ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SchoolEvent>(k: K, v: SchoolEvent[K]) => setE((p) => ({ ...p, [k]: v }));
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const sb = supabaseBrowser();
    const folder = e.slug || slugify(e.title) || "event";
    setUploading(files.length);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error } = await sb.storage.from(IMAGE_BUCKET).upload(path, f, { cacheControl: "31536000", contentType: f.type });
      if (error) { setErr(`Upload failed: ${error.message}`); continue; }
      urls.push(sb.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl);
      setUploading((n) => n - 1);
    }
    setUploading(0);
    setE((p) => ({ ...p, images: [...p.images, ...urls] }));
    if (fileRef.current) fileRef.current.value = "";
  }

  function moveToCover(i: number) {
    setE((p) => { const imgs = [...p.images]; const [x] = imgs.splice(i, 1); return { ...p, images: [x, ...imgs] }; });
  }

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    setErr("");
    if (e.end_date && e.end_date < e.date) return setErr("End date cannot be before the start date.");
    setSaving(true);
    const row = {
      slug: e.slug || slugify(e.title),
      title: e.title.trim(),
      date: e.date,
      end_date: e.end_date || null,
      date_approx: Boolean(e.date_approx),
      category: e.category,
      summary: e.summary.trim(),
      description: e.description.trim(),
      highlights: lines(highlights),
      people: lines(people),
      venue: e.venue?.trim() || null,
      images: e.images,
      featured: Boolean(e.featured),
    };
    const sb = supabaseBrowser();
    const { error } = editing
      ? await sb.from("events").update(row).eq("id", initial!.id!)
      : await sb.from("events").insert(row);
    setSaving(false);
    if (error) return setErr(error.code === "23505" ? "Another event already uses this web address (slug). Change the slug." : error.message);
    await refreshSite();
    router.push("/admin");
    router.refresh();
  }

  const preview: SchoolEvent = { ...e, slug: e.slug || "preview", title: e.title || "Event title", summary: e.summary || "One-line description appears here." };

  return (
    <form onSubmit={save}>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-navy-900"><ArrowLeft className="h-4 w-4" /> All events</Link>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-display text-4xl font-semibold text-navy-900">{editing ? "Edit event" : "Add new event"}</h1>
        <button disabled={saving || uploading > 0} className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-bold text-white transition hover:bg-navy-800 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {editing ? "Save changes" : "Publish event"}
        </button>
      </div>
      {err && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{err}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <fieldset className="space-y-5 rounded-2xl border border-line bg-white p-6">
            <legend className="eyebrow px-1 text-saffron-600">Basics</legend>
            <label className={label}>Title *
              <input required className={input} value={e.title} onChange={(x) => { set("title", x.target.value); if (!slugTouched) set("slug", slugify(x.target.value)); }} placeholder="e.g. Seminar on Digital Banking" />
            </label>
            <label className={label}>Web address (slug)
              <div className="mt-1.5 flex items-center rounded-xl border border-line bg-paper text-sm">
                <span className="pl-3.5 text-muted">/events/</span>
                <input className="w-full bg-transparent px-1 py-2.5 outline-none" value={e.slug} onChange={(x) => { setSlugTouched(true); set("slug", slugify(x.target.value)); }} />
              </div>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={label}>Category *
                <select className={input} value={e.category} onChange={(x) => set("category", x.target.value as Category)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className={label}>Venue
                <input className={input} value={e.venue ?? ""} onChange={(x) => set("venue", x.target.value)} placeholder="Default: MFKNBS, University of Sargodha" />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={label}>Date *
                <input required type="date" className={input} value={e.date} onChange={(x) => set("date", x.target.value)} />
              </label>
              <label className={label}>End date <span className="font-normal text-muted">(multi-day events)</span>
                <input type="date" className={input} value={e.end_date ?? ""} onChange={(x) => set("end_date", x.target.value || null)} />
              </label>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                <input type="checkbox" className="h-4 w-4 accent-saffron-500" checked={Boolean(e.date_approx)} onChange={(x) => set("date_approx", x.target.checked)} />
                Exact day unknown — show month only
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                <input type="checkbox" className="h-4 w-4 accent-saffron-500" checked={Boolean(e.featured)} onChange={(x) => set("featured", x.target.checked)} />
                <Star className="h-4 w-4 text-saffron-500" /> Feature on homepage
              </label>
            </div>
            <p className="rounded-xl bg-navy-50 px-4 py-3 text-xs text-navy-800">Tip: any event with a future date automatically appears under <b>Upcoming events</b> with a live countdown.</p>
          </fieldset>

          <fieldset className="space-y-5 rounded-2xl border border-line bg-white p-6">
            <legend className="eyebrow px-1 text-saffron-600">Story</legend>
            <label className={label}>One-line description * <span className="font-normal text-muted">({e.summary.length}/180)</span>
              <input required maxLength={180} className={input} value={e.summary} onChange={(x) => set("summary", x.target.value)} placeholder="Shown on cards and in the booklet" />
            </label>
            <label className={label}>Full description
              <textarea rows={8} className={input} value={e.description} onChange={(x) => set("description", x.target.value)} placeholder="Paste the full write-up. Leave a blank line between paragraphs." />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={label}>Highlights <span className="font-normal text-muted">(one per line)</span>
                <textarea rows={5} className={input} value={highlights} onChange={(x) => setHighlights(x.target.value)} placeholder={"Keynote by …\nPanel on …"} />
              </label>
              <label className={label}>People <span className="font-normal text-muted">(Name, Role — one per line)</span>
                <textarea rows={5} className={input} value={people} onChange={(x) => setPeople(x.target.value)} placeholder={"Dr. Ali Khan, Chief Guest"} />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-line bg-white p-6">
            <legend className="eyebrow px-1 text-saffron-600">Photos</legend>
            <p className="text-sm text-muted">
              {SINGLE_PHOTO_CATEGORIES.includes(e.category)
                ? "This theme shows one photo (e.g. the congratulations poster). It is displayed whole, never cropped."
                : "Add as many photos as you like (JPEG or PNG). The first photo is the cover; the rest form the gallery."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {e.images.map((src, i) => (
                <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-saffron-500 px-2 py-0.5 text-[10px] font-bold text-navy-950">Cover</span>}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 p-2 opacity-0 transition group-hover:opacity-100">
                    {i > 0 && <button type="button" onClick={() => moveToCover(i)} className="rounded-full bg-white/90 p-1.5 text-navy-900" title="Make cover"><ArrowLeftRight className="h-3.5 w-3.5" /></button>}
                    <button type="button" onClick={() => set("images", e.images.filter((x) => x !== src))} className="rounded-full bg-white/90 p-1.5 text-red-600" title="Remove"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(x) => x.preventDefault()}
                onDrop={(x) => { x.preventDefault(); upload(x.dataTransfer.files); }}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-muted transition hover:border-saffron-500 hover:text-saffron-600"
              >
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                <span className="text-xs font-semibold">{uploading ? `Uploading ${uploading}…` : "Add photos"}</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(x) => upload(x.target.files)} />
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow mb-3 text-muted">Live preview</p>
          <div className="pointer-events-none"><EventCard event={preview} /></div>
        </aside>
      </div>
    </form>
  );
}
