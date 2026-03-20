-- ============================================
-- Clement WellbeingAtWork — Supabase Schema
-- ============================================
-- Run this in the Supabase SQL Editor to set up
-- all tables needed for the app backend.
-- ============================================

-- ── Exercises (Øvelser) ──
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  titel_en text,
  tid text not null,
  sted text not null,
  sted_en text,
  cirkel text not null,
  temaer text[] not null default '{}',
  intro text not null,
  intro_en text,
  steps text[] not null default '{}',
  steps_en text[] default '{}',
  refleksion text,
  refleksion_en text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Reflections (Refleksioner) ──
create table if not exists reflections (
  id text primary key,
  titel text not null,
  titel_en text,
  ikon text not null default '◎',
  farve text not null default 'sage',
  spoergsmaal text not null,
  spoergsmaal_en text,
  uddybning text not null,
  uddybning_en text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Circles (Cirkler) — stored as JSONB for flexibility ──
create table if not exists circles (
  id text primary key,
  titel text not null,
  titel_en text,
  ikon text not null,
  data_da jsonb not null default '{}',
  data_en jsonb not null default '{}',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Themes (Temaer) ──
create table if not exists themes (
  id text primary key,
  titel text not null,
  titel_en text,
  ikon text not null,
  spoergsmaal text,
  spoergsmaal_en text,
  data_da jsonb not null default '{}',
  data_en jsonb not null default '{}',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Ladder content (Trappen) ──
create table if not exists ladder_states (
  id text primary key,
  navn text not null,
  navn_en text,
  undertitel text,
  undertitel_en text,
  farve text not null,
  data_da jsonb not null default '{}',
  data_en jsonb not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Email subscribers ──
create table if not exists email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  rolle text not null default 'medarbejder',
  lang text not null default 'da',
  subscribed boolean not null default true,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ── Content versions (for audit trail) ──
create table if not exists content_versions (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null,
  data jsonb not null,
  changed_by text,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ──

-- Public read access for content tables
alter table exercises enable row level security;
alter table reflections enable row level security;
alter table circles enable row level security;
alter table themes enable row level security;
alter table ladder_states enable row level security;
alter table email_subscribers enable row level security;
alter table content_versions enable row level security;

-- Anyone can read active content
create policy "Public read exercises" on exercises for select using (active = true);
create policy "Public read reflections" on reflections for select using (active = true);
create policy "Public read circles" on circles for select using (active = true);
create policy "Public read themes" on themes for select using (active = true);
create policy "Public read ladder" on ladder_states for select using (true);

-- Only authenticated users (admin) can insert/update/delete
create policy "Admin write exercises" on exercises for all using (auth.role() = 'authenticated');
create policy "Admin write reflections" on reflections for all using (auth.role() = 'authenticated');
create policy "Admin write circles" on circles for all using (auth.role() = 'authenticated');
create policy "Admin write themes" on themes for all using (auth.role() = 'authenticated');
create policy "Admin write ladder" on ladder_states for all using (auth.role() = 'authenticated');
create policy "Admin write versions" on content_versions for all using (auth.role() = 'authenticated');

-- Email subscribers: anyone can insert (signup), only admin can read/manage
create policy "Public insert subscribers" on email_subscribers for insert with check (true);
create policy "Admin manage subscribers" on email_subscribers for all using (auth.role() = 'authenticated');

-- ── Updated_at trigger ──
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger exercises_updated_at before update on exercises
  for each row execute function update_updated_at();
create trigger reflections_updated_at before update on reflections
  for each row execute function update_updated_at();
create trigger circles_updated_at before update on circles
  for each row execute function update_updated_at();
create trigger themes_updated_at before update on themes
  for each row execute function update_updated_at();
create trigger ladder_states_updated_at before update on ladder_states
  for each row execute function update_updated_at();

-- ── Indexes ──
create index if not exists idx_exercises_cirkel on exercises(cirkel);
create index if not exists idx_exercises_active on exercises(active);
create index if not exists idx_email_subscribers_email on email_subscribers(email);
create index if not exists idx_content_versions_record on content_versions(table_name, record_id);
