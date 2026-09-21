-- MSF Fellowship recruitment site: applicant photo/DOB/sex, Counseling & PR
-- auto-add, access codes, and the weekly follow-up report portal.
-- Run this in the Supabase SQL editor for your project (or via `supabase db push`).

-- =========================================================
-- New applicant fields
-- =========================================================
alter table public.applications
  add column if not exists date_of_birth date,
  add column if not exists sex text check (sex in ('Male', 'Female')),
  add column if not exists photo_path text,
  add column if not exists access_code text unique;

-- Tighten the public insert policy so anonymous applicants can only ever
-- create a fresh, unreviewed application — never self-accept or set a code.
drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications"
  on public.applications
  for insert
  to anon, authenticated
  with check (status = 'Pending' and access_code is null);

-- =========================================================
-- Applicant photo storage
-- =========================================================
insert into storage.buckets (id, name, public)
values ('applicant-photos', 'applicant-photos', false)
on conflict (id) do nothing;

drop policy if exists "Public can upload applicant photos" on storage.objects;
create policy "Public can upload applicant photos"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'applicant-photos');

drop policy if exists "Admins can view applicant photos" on storage.objects;
create policy "Admins can view applicant photos"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'applicant-photos');

-- =========================================================
-- Auto-generate a unique access code whenever someone becomes an
-- Accepted member of the Counseling and Public Relations Team — this is
-- their password into the follow-up report portal.
-- =========================================================
create or replace function public.generate_access_code()
returns text
language sql
as $$
  select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', ceil(random() * 32)::int, 1), '')
  from generate_series(1, 6);
$$;

create or replace function public.assign_access_code()
returns trigger
language plpgsql
as $$
declare
  candidate text;
  attempts int := 0;
begin
  if new.status = 'Accepted'
     and new.team = 'Counseling and Public Relations Team'
     and new.access_code is null then
    loop
      candidate := public.generate_access_code();
      attempts := attempts + 1;
      exit when not exists (select 1 from public.applications where access_code = candidate);
      exit when attempts > 10;
    end loop;
    new.access_code := candidate;
  end if;
  return new;
end;
$$;

drop trigger if exists applications_assign_access_code on public.applications;
create trigger applications_assign_access_code
  before insert or update on public.applications
  for each row execute function public.assign_access_code();

-- =========================================================
-- Auto-add: accepting someone onto ANY team also enrolls them (Accepted)
-- on the Counseling and Public Relations Team for follow-up, unless
-- they're already on it.
-- =========================================================
create or replace function public.auto_add_to_counseling()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'Accepted'
     and (old.status is distinct from 'Accepted')
     and new.team <> 'Counseling and Public Relations Team'
     and not exists (
       select 1 from public.applications
       where lower(email) = lower(new.email)
         and team = 'Counseling and Public Relations Team'
     ) then
    insert into public.applications (
      full_name, email, phone, age, date_of_birth, sex, photo_path, team, reason, status
    ) values (
      new.full_name, new.email, new.phone, new.age, new.date_of_birth, new.sex, new.photo_path,
      'Counseling and Public Relations Team',
      'Automatically added for follow-up after being accepted to ' || new.team || '.',
      'Accepted'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists applications_auto_add_counseling on public.applications;
create trigger applications_auto_add_counseling
  after update on public.applications
  for each row execute function public.auto_add_to_counseling();

-- =========================================================
-- follow_up_reports
-- =========================================================
create table if not exists public.follow_up_reports (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applications (id) on delete cascade,
  week_start date not null,
  week_end date not null,
  answer_1 text not null,
  answer_2 text not null,
  answer_3 text not null,
  answer_4 text not null,
  answer_5 text not null,
  answer_6 text not null,
  created_at timestamptz not null default now(),
  unique (applicant_id, week_start)
);

create index if not exists follow_up_reports_applicant_idx on public.follow_up_reports (applicant_id);

alter table public.follow_up_reports enable row level security;

-- No anon policies on purpose: the report portal only ever talks to this
-- table through the two SECURITY DEFINER functions below, which check the
-- access code themselves. Only admins can query the table directly.
create policy "Admins can view all reports"
  on public.follow_up_reports
  for select
  to authenticated
  using (true);

-- =========================================================
-- Report portal: access-code "login" + own report history
-- =========================================================
create or replace function public.report_portal_login(p_code text)
returns table (applicant_id uuid, full_name text, reports jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text;
begin
  select id, full_name into v_id, v_name
  from public.applications
  where access_code = upper(trim(p_code))
    and team = 'Counseling and Public Relations Team'
    and status = 'Accepted'
  limit 1;

  if v_id is null then
    return;
  end if;

  return query
  select
    v_id,
    v_name,
    coalesce(
      (select jsonb_agg(to_jsonb(r) - 'applicant_id' order by r.week_start desc)
       from public.follow_up_reports r
       where r.applicant_id = v_id),
      '[]'::jsonb
    );
end;
$$;

revoke all on function public.report_portal_login(text) from public;
grant execute on function public.report_portal_login(text) to anon, authenticated;

-- =========================================================
-- Report portal: submit this week's report (one per person per week,
-- rejected after 11:59pm Sunday, Africa/Lagos time)
-- =========================================================
create or replace function public.report_portal_submit(
  p_code text,
  p_week_start date,
  p_week_end date,
  p_answer_1 text,
  p_answer_2 text,
  p_answer_3 text,
  p_answer_4 text,
  p_answer_5 text,
  p_answer_6 text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_deadline timestamptz;
  v_new_id uuid;
begin
  select id into v_id
  from public.applications
  where access_code = upper(trim(p_code))
    and team = 'Counseling and Public Relations Team'
    and status = 'Accepted'
  limit 1;

  if v_id is null then
    raise exception 'Invalid access code.';
  end if;

  v_deadline := (p_week_end::timestamp + interval '1 day') at time zone 'Africa/Lagos';
  if now() >= v_deadline then
    raise exception 'The deadline for this week''s report has passed.';
  end if;

  if exists (
    select 1 from public.follow_up_reports
    where applicant_id = v_id and week_start = p_week_start
  ) then
    raise exception 'You have already submitted a report for this week.';
  end if;

  insert into public.follow_up_reports (
    applicant_id, week_start, week_end,
    answer_1, answer_2, answer_3, answer_4, answer_5, answer_6
  ) values (
    v_id, p_week_start, p_week_end,
    p_answer_1, p_answer_2, p_answer_3, p_answer_4, p_answer_5, p_answer_6
  )
  returning id into v_new_id;

  return jsonb_build_object('id', v_new_id);
end;
$$;

revoke all on function public.report_portal_submit(text, date, date, text, text, text, text, text, text) from public;
grant execute on function public.report_portal_submit(text, date, date, text, text, text, text, text, text)
  to anon, authenticated;
