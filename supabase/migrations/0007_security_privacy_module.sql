-- ============================================================
-- TrainingKit — Security & Privacy module (SDLC section)
-- Migration: 0007_security_privacy_module.sql
--
-- Adds one module to the operational 'sdlc' section: security & privacy
-- of AI in the SDLC (PII, prompt/data leaks, shadow AI). Because it is in
-- the 'sdlc' category and has lessons, recompute automatically folds it
-- into the SDLC aggregate badges + AI Architect certificate — no badge
-- criteria change needed. Run AFTER 0006.
-- ============================================================

insert into public.modules (code, title, sort_order, category) values
  ('security_privacy', 'Security & Privacy', 14, 'sdlc');

insert into public.badges (code, title, criteria) values
  ('badge_security_privacy',
   'Security & Privacy Certified',
   '{"type":"module_passed","module":"security_privacy"}');
