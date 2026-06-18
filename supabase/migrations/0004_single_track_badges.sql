-- ============================================================
-- TrainingKit — Single-track badges
-- Migration: 0004_single_track_badges.sql
--
-- The platform is now single-track (one shared curriculum, no roles).
-- The old aggregate badges were track-based (track_level_complete /
-- track_complete) and can never fire without an active_track. Replace
-- them with track-free equivalents evaluated by recompute.ts:
--   • all_modules_level   — every module with lessons at the level is passed
--   • all_modules_complete — all L1 AND all L2 content passed (certificate)
--
-- The 10 per-module badges (module_passed) are unchanged. Run AFTER 0003.
-- ============================================================

-- Remove the track-based aggregate badges (cascades user_badges).
delete from public.badges
where criteria->>'type' in ('track_level_complete', 'track_complete');

-- Track-free aggregate badges + certificate.
insert into public.badges (code, title, criteria) values
  ('badge_all_l1',
   'All Foundations Complete',
   '{"type":"all_modules_level","level":"L1"}'),
  ('badge_all_l2',
   'All Deep Dives Complete',
   '{"type":"all_modules_level","level":"L2"}'),
  ('cert_ai_architect',
   'AI Architect — Certificate of Completion',
   '{"type":"all_modules_complete"}');
