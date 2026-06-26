-- Sports Rivalry — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Handles: admin profiles, Fan Zone cards, polls + votes, match predictions,
-- newsletter subscribers, homepage module curation, media storage bucket.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admin profiles (links Supabase Auth users to an app role)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles where id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Fan Zone cards
-- ---------------------------------------------------------------------------
create table if not exists public.fan_zone_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'trophy',
  href text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Fan polls
-- ---------------------------------------------------------------------------
create table if not exists public.fan_polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.fan_poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.fan_polls (id) on delete cascade,
  label text not null,
  votes int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.fan_poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.fan_polls (id) on delete cascade,
  option_id uuid not null references public.fan_poll_options (id) on delete cascade,
  voter_hash text,
  created_at timestamptz not null default now()
);

create index if not exists fan_poll_options_poll_id_idx on public.fan_poll_options (poll_id);
create index if not exists fan_poll_votes_poll_id_idx on public.fan_poll_votes (poll_id);

-- Atomic vote increment used by the public server action.
create or replace function public.increment_poll_vote(p_option_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.fan_poll_options
  set votes = votes + 1
  where id = p_option_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Match predictions
-- ---------------------------------------------------------------------------
create table if not exists public.match_predictions (
  id uuid primary key default gen_random_uuid(),
  match_label text not null,
  home_team text not null,
  away_team text not null,
  kickoff_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Newsletter subscribers
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'homepage',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Homepage module curation (toggle / reorder Supabase-driven sections)
-- ---------------------------------------------------------------------------
create table if not exists public.home_modules (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.admin_profiles enable row level security;
alter table public.fan_zone_cards enable row level security;
alter table public.fan_polls enable row level security;
alter table public.fan_poll_options enable row level security;
alter table public.fan_poll_votes enable row level security;
alter table public.match_predictions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.home_modules enable row level security;

-- Public read for display tables
drop policy if exists "public read fan_zone_cards" on public.fan_zone_cards;
create policy "public read fan_zone_cards" on public.fan_zone_cards for select using (true);

drop policy if exists "public read fan_polls" on public.fan_polls;
create policy "public read fan_polls" on public.fan_polls for select using (true);

drop policy if exists "public read fan_poll_options" on public.fan_poll_options;
create policy "public read fan_poll_options" on public.fan_poll_options for select using (true);

drop policy if exists "public read match_predictions" on public.match_predictions;
create policy "public read match_predictions" on public.match_predictions for select using (true);

drop policy if exists "public read home_modules" on public.home_modules;
create policy "public read home_modules" on public.home_modules for select using (true);

-- Public can submit poll votes and newsletter signups (insert only)
drop policy if exists "public insert poll votes" on public.fan_poll_votes;
create policy "public insert poll votes" on public.fan_poll_votes for insert with check (true);

drop policy if exists "public insert subscribers" on public.newsletter_subscribers;
create policy "public insert subscribers" on public.newsletter_subscribers for insert with check (true);

-- Admins (authenticated, present in admin_profiles) can read their own profile
drop policy if exists "admins read own profile" on public.admin_profiles;
create policy "admins read own profile" on public.admin_profiles
  for select using (auth.uid() = id);

-- Admins can fully manage content tables (service role also bypasses RLS).
drop policy if exists "admins manage fan_zone_cards" on public.fan_zone_cards;
create policy "admins manage fan_zone_cards" on public.fan_zone_cards
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage fan_polls" on public.fan_polls;
create policy "admins manage fan_polls" on public.fan_polls
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage fan_poll_options" on public.fan_poll_options;
create policy "admins manage fan_poll_options" on public.fan_poll_options
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage match_predictions" on public.match_predictions;
create policy "admins manage match_predictions" on public.match_predictions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage home_modules" on public.home_modules;
create policy "admins manage home_modules" on public.home_modules
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers
  for select using (public.is_admin());

drop policy if exists "admins read poll votes" on public.fan_poll_votes;
create policy "admins read poll votes" on public.fan_poll_votes
  for select using (public.is_admin());

-- ===========================================================================
-- Storage bucket for media uploads
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ===========================================================================
-- Seed data (safe to re-run)
-- ===========================================================================
insert into public.fan_zone_cards (title, description, icon, sort_order)
select * from (values
  ('Community Challenges', 'Compete in rivalry challenges and win exclusive rewards.', 'trophy', 0),
  ('Fan Polls', 'Make your voice heard and see what fans think.', 'poll', 1),
  ('Match Predictions', 'Predict results and climb the leaderboard.', 'target', 2),
  ('Fantasy Sports', 'Build your team and battle for glory.', 'shield', 3)
) as seed(title, description, icon, sort_order)
where not exists (select 1 from public.fan_zone_cards);

insert into public.home_modules (key, title, is_enabled, sort_order)
select * from (values
  ('hero_feature', 'Hero Feature', true, 0),
  ('latest_news', 'Latest News', true, 1),
  ('top_headlines', 'Top Headlines', true, 2),
  ('hero_carousel', 'Hero Carousel', true, 3),
  ('sport_sections', 'Sport Sections', true, 4),
  ('fan_zone', 'Fan Zone', true, 5),
  ('trending_stories', 'Trending Stories', true, 6),
  ('recommended_reads', 'Recommended Reads', true, 7),
  ('newsletter', 'Newsletter', true, 8)
) as seed(key, title, is_enabled, sort_order)
where not exists (select 1 from public.home_modules);

-- NOTE: After creating your admin user in Supabase Auth, link it:
--   insert into public.admin_profiles (id, email, role)
--   values ('<auth-user-uuid>', '<email>', 'admin');
