-- ============================================================
-- TrainingKit — Quiz explanations ("why" feedback)
-- Migration: 0009_quiz_explanations.sql
--
-- Adds an explanation to each quiz question, shown AFTER the learner answers
-- (so they learn why, not just see the green option). Like `correct`, the
-- explanation is hidden from the browser at rest and returned by quiz-submit
-- (service role) only after grading. Run AFTER 0008.
-- ============================================================

alter table public.quiz_questions
  add column explanation text;

-- New column is NOT added to the client column-grant (id, lesson_id, prompt,
-- choices, points, created_at), so anon/authenticated still cannot read it
-- directly — quiz-submit returns it post-answer via the service role.
