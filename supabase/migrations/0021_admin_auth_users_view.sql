-- ============================================================
-- TrainingKit — fast admin read of auth user email + activity
-- Migration: 0021_admin_auth_users_view.sql
--
-- list_users was slow (~5s) because it called the GoTrue Admin API
-- (auth.admin.listUsers) for email/last_sign_in. That, plus region latency,
-- made the admin-api invoke time out in the browser ("Failed to send a request
-- to the Edge Function"). A plain SELECT over auth.users is far faster, but the
-- `auth` schema isn't exposed to PostgREST — so expose just the columns we need
-- through a public view, readable ONLY by the service role (used by edge funcs).
-- The view runs with its owner's rights, so it can read auth.users. Run AFTER 0020.
-- ============================================================

create or replace view public.admin_auth_users as
  select id, email, last_sign_in_at, created_at from auth.users;

revoke all on public.admin_auth_users from anon, authenticated;
grant select on public.admin_auth_users to service_role;

notify pgrst, 'reload schema';
