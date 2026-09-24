-- Lets signed-in admins delete an application record directly from the
-- dashboard (previously only possible via the Supabase Table Editor).
-- Run this in the Supabase SQL editor after 0001 and 0002.

drop policy if exists "Admins can delete applications" on public.applications;
create policy "Admins can delete applications"
  on public.applications
  for delete
  to authenticated
  using (true);
