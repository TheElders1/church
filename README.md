# MSF Fellowship — Recruitment Website

A recruitment site for MSF Fellowship's serving teams. Members can browse the
ten serving teams and apply to join one; fellowship admins review and manage
applications from a protected dashboard.

**Stack:** React + Vite + TypeScript, Tailwind CSS, Supabase (Postgres + Auth),
Framer Motion, react-hook-form + zod. Deploy target: Vercel.

## Project structure

```
src/
  components/   layout, ui, teams, application, contact, and admin components
  pages/        one file per route (+ pages/admin for the dashboard)
  data/teams.ts the 10 team definitions (name, description, responsibilities, icon)
  lib/          supabase client + zod validation schemas
  context/      auth context (wraps Supabase Auth session)
  types/        shared TypeScript types
supabase/migrations/0001_init.sql   database schema + RLS policies
supabase/migrations/0002_reports_and_applicant_fields.sql
                                     photo/DOB/sex fields, Counseling & PR
                                     auto-add, access codes, report portal
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/migrations/0002_reports_and_applicant_fields.sql` (in that
   order — 0002 depends on 0001). Together these create the
   `applications`, `contact_messages`, and `follow_up_reports` tables with
   Row Level Security enabled, a private `applicant-photos` storage bucket,
   and the report-portal database functions described below.
3. Create an admin account: **Authentication → Users → Add user**. Set an
   email + password and check "Auto Confirm User". This is the login for
   `/admin`. There's no public admin sign-up — create every admin account
   this way.

   For a handoff account (e.g. a default login given to the church, who
   will set their own password once they take over): create it with a
   throwaway default password, then use the **Change Password** button in
   the `/admin` dashboard header (next to Sign out) to set the real one —
   no Supabase dashboard access needed for that step. `supabase.auth
   .updateUser({ password })` only requires the active signed-in session.
4. Grab your API credentials from **Project Settings → API**: the Project
   URL and the `anon` `public` key.

## 2. Local development

```bash
npm install
cp .env.example .env.local   # then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

The app runs at `http://localhost:5173`. `npm run build` type-checks and
produces a production build in `dist/`; `npm run preview` serves that build
locally.

## 3. Deploy to Vercel

1. Push this repository to GitHub (or your git host of choice).
2. In the [Vercel dashboard](https://vercel.com/new), import the repo. Vite
   projects are auto-detected — no build settings need to change.
3. Add the two environment variables from step 1.4 above
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) under **Project Settings →
   Environment Variables**, then deploy (or redeploy).
4. `vercel.json` already includes the SPA rewrite rule client-side routing
   needs, so deep links like `/teams` or `/admin` work correctly on refresh.

You'll get a default `*.vercel.app` URL. A custom domain can be attached
later from the same Vercel project settings — no code changes needed.

## Notes on the data model

- `applications.status` is constrained to `Pending | Reviewed | Accepted |
  Rejected` at the database level (see the `check` constraint in the
  migration) as well as in the TypeScript types (`src/types/index.ts`).
- `contact_messages` isn't in the original spec's table list but was added
  so the About page's contact form has somewhere to persist to, rather than
  being a non-functional placeholder. Admins can query it directly in the
  Supabase table editor.
- Contact details on the About/Contact page and in the footer
  (`info@msffellowship.org`, phone, `@msffellowship`) are placeholders —
  swap them for the fellowship's real details in `src/pages/AboutPage.tsx`
  and `src/components/layout/Footer.tsx`.

## Counseling & Follow-up report portal

- Applying now also requires a photo (stored in the private
  `applicant-photos` bucket), date of birth, and sex.
- Whenever an admin marks ANY application as **Accepted**, a database
  trigger automatically also enrolls that person (Accepted) on the
  **Counseling and Public Relations Team**, unless they're already on it.
- Being Accepted on that team auto-generates a unique 6-character
  **access code** — shown in the admin dashboard's application detail
  panel (with a Copy button) so it can be sent to the person directly
  (there's no email automation for this yet).
- That code is the password into `/reports`, a public page where they can
  submit their weekly follow-up report (the six questions the fellowship
  gave) and review — but not edit — their past reports. Submissions close
  at 11:59pm Sunday (Africa/Lagos time), enforced both in the UI and in the
  database function itself.
- Admins can see every submitted report at `/admin/reports` (linked from
  the main Applications dashboard).
- There's no real member login system — the access code is a shared
  secret, not a full account. All of the report-portal logic lives in
  `SECURITY DEFINER` Postgres functions (`report_portal_login`,
  `report_portal_submit`) so the report data itself is never exposed via
  an open table policy, only through those two functions.
