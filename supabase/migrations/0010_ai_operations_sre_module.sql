-- ============================================================
-- TrainingKit — Agent-Driven SRE & Ops module (SDLC section)
-- Migration: 0010_ai_operations_sre_module.sql
--
-- Adds one module to the operational 'sdlc' section: operating AI agents
-- that take actions across the SDLC and ops (bounding blast radius,
-- approval gates, action audit trails, human-in-the-loop accountability,
-- agentic FinOps, incidents with and about agents, and the agent policy
-- lifecycle). Because it is in the 'sdlc' category and has lessons,
-- recompute automatically folds it into the SDLC aggregate badges + AI
-- Architect certificate — no badge criteria change needed. Run AFTER 0009.
-- ============================================================

insert into public.modules (code, title, sort_order, category) values
  ('ai_operations_sre', 'AI in Operations — Agent-Driven SRE & Ops', 15, 'sdlc');

insert into public.badges (code, title, criteria) values
  ('badge_ai_operations',
   'AI Operations & SRE Certified',
   '{"type":"module_passed","module":"ai_operations_sre"}');
