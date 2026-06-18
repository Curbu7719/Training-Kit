-- ============================================================
-- TrainingKit — Seed Data
-- Migration: 0002_seed.sql
--
-- Populates: tracks, modules, module_tracks, badges
-- Does NOT touch: profiles, lessons, quiz_questions, exercises,
--   user_progress, quiz_attempts, exercise_subs, user_badges
--   (those are runtime data or loaded via scripts/seed-content.mjs)
--
-- Track codes (canonical, used everywhere):
--   developer | business_analyst | pm_po | qa_architect
-- ============================================================

-- ============================================================
-- TRACKS
-- ============================================================
insert into public.tracks (code, title, description, sort_order) values
  ('developer',         'Developer / Engineer',    'Software engineers building production systems', 1),
  ('business_analyst',  'Business Analyst',         'BAs who collaborate with technical teams',       2),
  ('pm_po',             'PM / Product Owner',       'Product managers and product owners',             3),
  ('qa_architect',      'QA & Architect',           'QA engineers and solution architects',            4);

-- ============================================================
-- MODULES  (sort_order matches DESIGN.md §2 table order)
-- ============================================================
insert into public.modules (code, title, sort_order) values
  ('layered_architecture',     'Layered Architecture (Client + BaaS + Serverless)',  1),
  ('data_modeling',            'Data Modeling & Schema Design',                       2),
  ('authz_security',           'Authorization & Security (Row-Level Access Control)', 3),
  ('abstraction_swappability', 'Abstraction & Swappability (Provider Interface)',     4),
  ('streaming_realtime',       'Streaming & Real-Time Data (Server-Sent Events)',     5),
  ('context_state',            'Context & State Management (Checkpointing)',          6),
  ('config_composition',       'Configuration & Layered Composition',                7),
  ('adr_tradeoffs',            'Decision Records & Trade-Off Analysis (ADRs)',        8),
  ('migration_planning',       'Migration Planning (Swapping Core Dependencies)',     9),
  ('extensibility_seams',      'Extensibility & Seams (Designing for Future Change)', 10);

-- ============================================================
-- MODULE_TRACKS  — the role × module × level matrix
-- Source: DESIGN.md §2.1
-- Every non-dash cell is one row; required=true for all.
-- L1→L2 gating (DESIGN.md §3) is enforced in app logic;
-- prereq_module_id is left null here (no cross-module prereqs
-- in the initial matrix).
-- ============================================================

-- Helper: resolve codes to UUIDs inline via subquery.
-- This approach avoids variable declarations and is Supabase-
-- migration-safe (no DO block needed).

insert into public.module_tracks (module_id, track_id, level, required)
select m.id, t.id, v.level::public.module_level, true
from (values
  -- (module_code, track_code, level)
  -- Module 1: Layered architecture — L1 for all four tracks
  ('layered_architecture',     'developer',        'L1'),
  ('layered_architecture',     'business_analyst', 'L1'),
  ('layered_architecture',     'pm_po',            'L1'),
  ('layered_architecture',     'qa_architect',     'L1'),
  -- Module 2: Data modeling
  ('data_modeling',            'developer',        'L1'),
  ('data_modeling',            'business_analyst', 'L2'),
  -- pm_po: dash — no row
  ('data_modeling',            'qa_architect',     'L2'),
  -- Module 3: Authz & security
  ('authz_security',           'developer',        'L1'),
  ('authz_security',           'business_analyst', 'L2'),
  ('authz_security',           'pm_po',            'L2'),
  ('authz_security',           'qa_architect',     'L1'),
  -- Module 4: Abstraction/swappability
  ('abstraction_swappability', 'developer',        'L1'),
  -- business_analyst: dash — no row
  ('abstraction_swappability', 'pm_po',            'L2'),
  ('abstraction_swappability', 'qa_architect',     'L1'),
  -- Module 5: Streaming/real-time
  ('streaming_realtime',       'developer',        'L2'),
  -- business_analyst: dash
  -- pm_po: dash
  ('streaming_realtime',       'qa_architect',     'L2'),
  -- Module 6: Context/state mgmt
  ('context_state',            'developer',        'L2'),
  ('context_state',            'business_analyst', 'L2'),
  ('context_state',            'pm_po',            'L2'),
  ('context_state',            'qa_architect',     'L1'),
  -- Module 7: Configuration/composition — L1 for all four
  ('config_composition',       'developer',        'L1'),
  ('config_composition',       'business_analyst', 'L1'),
  ('config_composition',       'pm_po',            'L1'),
  ('config_composition',       'qa_architect',     'L1'),
  -- Module 8: ADR & trade-offs — L1 for all four
  ('adr_tradeoffs',            'developer',        'L1'),
  ('adr_tradeoffs',            'business_analyst', 'L1'),
  ('adr_tradeoffs',            'pm_po',            'L1'),
  ('adr_tradeoffs',            'qa_architect',     'L1'),
  -- Module 9: Migration planning
  ('migration_planning',       'developer',        'L2'),
  -- business_analyst: dash
  ('migration_planning',       'pm_po',            'L2'),
  ('migration_planning',       'qa_architect',     'L1'),
  -- Module 10: Extensibility/seams
  ('extensibility_seams',      'developer',        'L2'),
  ('extensibility_seams',      'business_analyst', 'L2'),
  ('extensibility_seams',      'pm_po',            'L2'),
  ('extensibility_seams',      'qa_architect',     'L1')
) as v(module_code, track_code, level)
join public.modules m on m.code = v.module_code
join public.tracks  t on t.code = v.track_code;

-- ============================================================
-- BADGES
--
-- Per-module completion (one per module):   badge_<module_code>
-- Per-track, per-level completion:          badge_all_l1_<track_code>
--                                           badge_all_l2_<track_code>
-- Per-track certificate:                    cert_<track_code>
--
-- criteria jsonb describes the unlock rule; the /progress edge
-- function evaluates these against user_progress to award badges.
-- ============================================================

-- Per-module completion badges
insert into public.badges (code, title, criteria) values
  ('badge_layered_architecture',
   'Layered Architecture Certified',
   '{"type":"module_passed","module":"layered_architecture"}'),
  ('badge_data_modeling',
   'Data Modeling Certified',
   '{"type":"module_passed","module":"data_modeling"}'),
  ('badge_authz_security',
   'Authorization & Security Certified',
   '{"type":"module_passed","module":"authz_security"}'),
  ('badge_abstraction_swappability',
   'Abstraction & Swappability Certified',
   '{"type":"module_passed","module":"abstraction_swappability"}'),
  ('badge_streaming_realtime',
   'Streaming & Real-Time Certified',
   '{"type":"module_passed","module":"streaming_realtime"}'),
  ('badge_context_state',
   'Context & State Management Certified',
   '{"type":"module_passed","module":"context_state"}'),
  ('badge_config_composition',
   'Configuration & Composition Certified',
   '{"type":"module_passed","module":"config_composition"}'),
  ('badge_adr_tradeoffs',
   'ADR & Trade-Offs Certified',
   '{"type":"module_passed","module":"adr_tradeoffs"}'),
  ('badge_migration_planning',
   'Migration Planning Certified',
   '{"type":"module_passed","module":"migration_planning"}'),
  ('badge_extensibility_seams',
   'Extensibility & Seams Certified',
   '{"type":"module_passed","module":"extensibility_seams"}');

-- Per-track L1 completion badges
insert into public.badges (code, title, criteria) values
  ('badge_all_l1_developer',
   'Developer Track — All L1 Complete',
   '{"type":"track_level_complete","track":"developer","level":"L1"}'),
  ('badge_all_l1_business_analyst',
   'Business Analyst Track — All L1 Complete',
   '{"type":"track_level_complete","track":"business_analyst","level":"L1"}'),
  ('badge_all_l1_pm_po',
   'PM / PO Track — All L1 Complete',
   '{"type":"track_level_complete","track":"pm_po","level":"L1"}'),
  ('badge_all_l1_qa_architect',
   'QA & Architect Track — All L1 Complete',
   '{"type":"track_level_complete","track":"qa_architect","level":"L1"}');

-- Per-track L2 completion badges
insert into public.badges (code, title, criteria) values
  ('badge_all_l2_developer',
   'Developer Track — All L2 Complete',
   '{"type":"track_level_complete","track":"developer","level":"L2"}'),
  ('badge_all_l2_business_analyst',
   'Business Analyst Track — All L2 Complete',
   '{"type":"track_level_complete","track":"business_analyst","level":"L2"}'),
  ('badge_all_l2_pm_po',
   'PM / PO Track — All L2 Complete',
   '{"type":"track_level_complete","track":"pm_po","level":"L2"}'),
  ('badge_all_l2_qa_architect',
   'QA & Architect Track — All L2 Complete',
   '{"type":"track_level_complete","track":"qa_architect","level":"L2"}');

-- Per-track certificate badges (full required path L1+L2 complete)
insert into public.badges (code, title, criteria) values
  ('cert_developer',
   'Developer / Engineer Certificate',
   '{"type":"track_complete","track":"developer"}'),
  ('cert_business_analyst',
   'Business Analyst Certificate',
   '{"type":"track_complete","track":"business_analyst"}'),
  ('cert_pm_po',
   'PM / Product Owner Certificate',
   '{"type":"track_complete","track":"pm_po"}'),
  ('cert_qa_architect',
   'QA & Architect Certificate',
   '{"type":"track_complete","track":"qa_architect"}');
