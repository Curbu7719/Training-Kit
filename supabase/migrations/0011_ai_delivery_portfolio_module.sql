-- ============================================================
-- TrainingKit — AI Delivery & Portfolio Management module (Strategy section)
-- Migration: 0011_ai_delivery_portfolio_module.sql
--
-- Adds one module to the 'strategy' section: delivering an AI project as a
-- gated experiment (L1) and managing an AI portfolio (L2) — prioritisation,
-- kill discipline, platform-vs-point investment, aggregate value reporting,
-- vendor concentration/exit, and the maturity roadmap. Because it is in the
-- 'strategy' category and has lessons, recompute automatically folds it into
-- the strategy aggregate badges + certificate — no badge criteria change
-- needed. Run AFTER 0010.
-- ============================================================

insert into public.modules (code, title, sort_order, category) values
  ('ai_delivery_portfolio', 'AI Delivery & Portfolio Management', 17, 'strategy');

insert into public.badges (code, title, criteria) values
  ('badge_ai_delivery_portfolio',
   'AI Delivery & Portfolio Certified',
   '{"type":"module_passed","module":"ai_delivery_portfolio"}');
