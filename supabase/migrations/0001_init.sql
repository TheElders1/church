-- MSF Fellowship recruitment site: initial schema
-- Run this in the Supabase SQL editor for your project (or via `supabase db push`).

create extension if not exists pgcrypto;

-- =========================================================
-- applications
-- =========================================================
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  age int not null check (age >= 12 and age <= 120),
  team text not null,
  reason text not null,
  status text not null default 'Pending'
    check (status in ('Pending', 'Reviewed', 'Accepted', 'Rejected')),
  created_at timestamptz not null default now()
);

create index if not exists applications_team_idx on public.applications (team);
create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_created_at_idx on public.applications (created_at desc);

alter table public.applications enable row level security;

-- Anyone (including anonymous visitors filling out the public form) can submit an application.
create policy "Public can submit applications"
  on public.applications
  for insert
  to anon, authenticated
  with check (true);

-- Only signed-in users (fellowship admins, created via Supabase Auth) can view applications.
create policy "Admins can view applications"
  on public.applications
  for select
  to authenticated
  using (true);

-- Only signed-in users can update application status.
create policy "Admins can update applications"
  on public.applications
  for update
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- contact_messages
-- =========================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "Public can send contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- =========================================================
-- Admin accounts
-- =========================================================
-- Admins are just Supabase Auth users — there is no public sign-up page.
-- Create the first admin account from the Supabase dashboard:
--   Authentication -> Users -> Add user (set email + password, and mark
--   "Auto Confirm User" so no confirmation email round-trip is needed).
-- Any authenticated user can read/update applications per the policies above,
-- so only create accounts for people who should have admin access.
