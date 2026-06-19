-- ============================================================
-- TrainingKit — AI Operations / SRE module (SDLC section)
-- Migration: 0010_ai_operations_sre_module.sql
--
-- Adds one module to the operational 'sdlc' section: operating an AI
-- feature in production (observability, reliability, cost governance /
-- FinOps, incident response, model & prompt lifecycle). Because it is in
-- the 'sdlc' category and has lessons, recompute automatically folds it
-- into the SDLC aggregate badges + AI Architect certificate — no badge
-- criteria change needed. Run AFTER 0009.
-- ============================================================

insert into public.modules (code, title, sort_order, category) values
  ('ai_operations_sre', 'AI in Production — SRE & Ops', 15, 'sdlc');

insert into public.badges (code, title, criteria) values
  ('badge_ai_operations',
   'AI Operations & SRE Certified',
   '{"type":"module_passed","module":"ai_operations_sre"}');
