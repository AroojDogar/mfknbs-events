# MFKNBS Activities & Events

Website for Malik Firoz Khan Noon Business School, University of Sargodha. It covers every activity from October 2024 onward, has a printable booklet, and includes an admin panel the focal person uses to add events.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · Framer Motion · Supabase (database, login, photo storage) · Vercel

## Pages

| Page | What it shows |
|---|---|
| `/` | Animated hero, live stats, milestone highlights, latest activity timeline, themes, upcoming events with countdown, about |
| `/events` | Full archive grouped by month, with search, year and theme filters, and timeline/grid views |
| `/events/[slug]` | Event story, photo gallery with lightbox, highlights, people, share button, previous/next |
| `/booklet` | A4 booklet (cover, contents, all events, back cover). **Print / Save PDF** turns it into a PDF to hand to visitors |
| `/admin` | Focal person login. Add, edit and delete events and upload photos |

Any event with a future date automatically shows under **Upcoming events** with a live countdown.

**Nothing is hard-coded.** Every number on the site is calculated from the events themselves: totals, research outputs, MoUs, international engagements, people featured, per-year chart, theme counts, the partners wall, the month-by-month journey, the hero's "Latest" ticker and highlight cards, and the booklet. When the focal person publishes an event, all of it updates within a minute (see `lib/stats.ts`).

## 1. Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Without Supabase, the site runs on the events in `lib/events-data.ts`. The admin panel will show setup steps until a database is connected.

## 2. Connect Supabase (needed for the admin panel)

1. Create a free project at https://supabase.com.
2. **SQL Editor** → run `supabase/schema.sql`, then `supabase/seed.sql` (this loads all 53 events).
3. **Authentication → Users → Add user**: enter the focal person's email and password.
4. In the SQL Editor, give that person editing access:
   ```sql
   insert into public.admin_users (email) values ('focal.person@example.com');
   ```
5. Copy `.env.example` to `.env.local` and fill in the values from **Project Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
6. Restart `npm run dev`. The site now reads from the database, and `/admin` works.

Only emails listed in `admin_users` can make changes. Everyone else can only read, and this is enforced by the database itself (Row Level Security).

## 3. Deploy to Vercel

Push to GitHub → import the repo in Vercel → add the two environment variables → Deploy.
The footer has a small **Focal person login** link that opens `/admin`.

## Adding photos

- **Admin panel (recommended):** open an event → *Add photos* (you can drag and drop several JPEGs). The first photo becomes the cover.
- **Without the database:** put JPEGs in `public/events/<event-slug>/` and list them in `lib/events-data.ts`, e.g. `images: ["/events/alumni-meetup-2024/1.jpg"]`.

**Faculty Achievement, Seminar & Talk and Research & Publication** events reserve space for **one** photo. It is shown whole, never cropped, so a congratulations poster stays readable. Every other theme gets a full gallery (5-photo layout that adapts to 2, 3, 4 or more photos, plus a lightbox with thumbnails). There is no limit on photos.

## Editing the starting data

`lib/events-data.ts` is the source list. After editing it, run `npm run seed:sql` to regenerate `supabase/seed.sql`.
