-- ============================================================
-- 0015  Using AI Safely — for Everyone (core module)
-- ============================================================
-- A universal, non-builder safety core: how to USE the company's AI tools and
-- agents safely (verify confident-but-wrong output, keep sensitive data out of
-- prompts, watch for prompt injection in fetched content, escalate high-stakes
-- decisions). Aimed at every role, especially those who use AI rather than build
-- it.
--
-- Placed in a NEW category 'core' (not 'sdlc'/'strategy'/'practice') so it does
-- not change the thresholds of the existing section/aggregate certificates,
-- which are scoped per category. sort_order 0 keeps it first.
-- ============================================================

insert into public.modules (code, title, sort_order, category) values
  ('using_ai_safely', 'Using AI Safely — for Everyone', 0, 'core')
on conflict (code) do nothing;

insert into public.badges (code, title, criteria) values
  ('badge_using_ai_safely',
   'AI Safety Essentials',
   '{"type":"module_passed","module":"using_ai_safely"}')
on conflict (code) do nothing;
