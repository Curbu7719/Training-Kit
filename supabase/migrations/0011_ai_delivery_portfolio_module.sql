-- ============================================================
-- TrainingKit — Delivery & Portfolio in an AI-Driven SDLC (Strategy section)
-- Migration: 0011_ai_delivery_portfolio_module.sql
--
-- Adds one module to the 'strategy' section: managing software delivery (L1)
-- and the engineering portfolio (L2) when development itself is AI-driven —
-- the bottleneck shifting from writing to specifying/reviewing/verifying,
-- estimating the last 10%, quality gates for generated code, real-throughput
-- vs vanity metrics, shared AI-workflow platforms, governance of generated
-- code, vendor concentration/exit, and the maturity roadmap. Because it is in
-- the 'strategy' category and has lessons, recompute automatically folds it
-- into the strategy aggregate badges + certificate — no badge criteria change
-- needed. Run AFTER 0010.
-- ============================================================

insert into public.modules (code, title, sort_order, category) values
  ('ai_delivery_portfolio', 'Delivery & Portfolio in an AI-Driven SDLC', 17, 'strategy');

insert into public.badges (code, title, criteria) values
  ('badge_ai_delivery_portfolio',
   'AI Delivery & Portfolio Certified',
   '{"type":"module_passed","module":"ai_delivery_portfolio"}');
