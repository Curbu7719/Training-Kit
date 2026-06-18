-- ============================================================
-- TrainingKit — AI Strategy Literacy strand
-- Migration: 0006_strategy_strand.sql
--
-- Adds a second, separate section of the curriculum: "AI Strategy
-- Literacy" (the business/decision lens), distinct from the operational
-- "AI in the SDLC" modules. A `category` on modules drives the dashboard
-- grouping. Each section has its OWN completion certificate:
--   • category 'sdlc'     → existing AI Architect certificate
--   • category 'strategy' → new AI Strategy certificate
--
-- Run AFTER 0005.
-- ============================================================

-- 1. Category on modules (existing 10 become 'sdlc').
alter table public.modules
  add column category text not null default 'sdlc';

-- 2. Scope the existing aggregate/certificate badges to the SDLC section.
update public.badges set criteria = criteria || '{"category":"sdlc"}'::jsonb
  where code in ('badge_all_l1', 'badge_all_l2', 'cert_ai_architect');

-- 3. The three strategy modules.
insert into public.modules (code, title, sort_order, category) values
  ('ai_fit_buildbuy',    'AI Fit & Build vs Buy', 11, 'strategy'),
  ('ai_risk_governance', 'AI Risk & Governance',  12, 'strategy'),
  ('ai_value_scaling',   'AI Value & Scaling',    13, 'strategy');

-- 4. Per-module completion badges.
insert into public.badges (code, title, criteria) values
  ('badge_ai_fit_buildbuy',    'AI Fit & Build vs Buy Certified', '{"type":"module_passed","module":"ai_fit_buildbuy"}'),
  ('badge_ai_risk_governance', 'AI Risk & Governance Certified',  '{"type":"module_passed","module":"ai_risk_governance"}'),
  ('badge_ai_value_scaling',   'AI Value & Scaling Certified',     '{"type":"module_passed","module":"ai_value_scaling"}');

-- 5. Strategy-section aggregate badges + certificate (track-free, category-scoped).
insert into public.badges (code, title, criteria) values
  ('badge_all_strategy_l1',
   'AI Strategy — All Foundations Complete',
   '{"type":"all_modules_level","level":"L1","category":"strategy"}'),
  ('badge_all_strategy_l2',
   'AI Strategy — All Deep Dives Complete',
   '{"type":"all_modules_level","level":"L2","category":"strategy"}'),
  ('cert_ai_strategy',
   'AI Strategy Literacy — Certificate of Completion',
   '{"type":"all_modules_complete","category":"strategy"}');
