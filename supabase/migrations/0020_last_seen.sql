-- ============================================================
-- TrainingKit — presence heartbeat column
-- Migration: 0020_last_seen.sql
--
-- profiles.last_seen_at is bumped by the client roughly once a minute while the
-- app is open (own-row update is allowed by the profiles_own_update RLS policy).
-- The admin Users screen treats a user as "online" when last_seen_at is recent.
-- Run AFTER 0019.
-- ============================================================

alter table public.profiles add column if not exists last_seen_at timestamptz;

-- Reload PostgREST's schema cache so the new column is immediately writable via
-- the REST API (raw applies don't refresh it the way `supabase db push` does).
notify pgrst, 'reload schema';
