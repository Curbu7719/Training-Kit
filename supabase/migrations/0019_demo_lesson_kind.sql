-- ============================================================
-- TrainingKit — add a non-graded 'demo' lesson kind
-- Migration: 0019_demo_lesson_kind.sql
--
-- 'demo' lessons are interactive, read-only illustrations (e.g. "same prompt,
-- different models") that the learner explores but does not solve. They carry no
-- quiz_questions or exercises, so they never affect the level score — recompute
-- only sums quiz + exercise points. Run AFTER 0018.
-- ============================================================

alter type public.lesson_kind add value if not exists 'demo';
