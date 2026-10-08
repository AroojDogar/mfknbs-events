-- MFKNBS Activities website — run this once in Supabase: SQL Editor → New query → Run.

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  date        date not null,
  end_date    date,
  date_approx boolean not null default false,
  category    text not null,
  summary     text not null default '',
  description text not null default '',
  highlights  text[] not null default '{}',
  people      text[] not null default '{}',
  venue       text,
  images      text[] not null default '{}',
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (date desc);

-- Who may edit: add the focal person's login email here.
create table if not exists public.admin_users (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();

alter table public.events enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "events are public" on public.events;
create policy "events are public" on public.events for select using (true);
drop policy if exists "admins insert events" on public.events;
create policy "admins insert events" on public.events for insert to authenticated with check (public.is_admin());
drop policy if exists "admins update events" on public.events;
create policy "admins update events" on public.events for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete events" on public.events;
create policy "admins delete events" on public.events for delete to authenticated using (public.is_admin());

drop policy if exists "admins read admin list" on public.admin_users;
create policy "admins read admin list" on public.admin_users for select to authenticated using (public.is_admin());

-- Photo storage
insert into storage.buckets (id, name, public) values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "event images are public" on storage.objects;
create policy "event images are public" on storage.objects for select using (bucket_id = 'event-images');
drop policy if exists "admins upload event images" on storage.objects;
create policy "admins upload event images" on storage.objects for insert to authenticated with check (bucket_id = 'event-images' and public.is_admin());
drop policy if exists "admins update event images" on storage.objects;
create policy "admins update event images" on storage.objects for update to authenticated using (bucket_id = 'event-images' and public.is_admin());
drop policy if exists "admins delete event images" on storage.objects;
create policy "admins delete event images" on storage.objects for delete to authenticated using (bucket_id = 'event-images' and public.is_admin());

-- ▼ Replace with the focal person's email, then run:
-- insert into public.admin_users (email) values ('focal.person@uos.edu.pk');
