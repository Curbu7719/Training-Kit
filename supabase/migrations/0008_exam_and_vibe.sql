-- ============================================================
-- TrainingKit — SDLC Exam + Vibe Coding module
-- Migration: 0008_exam_and_vibe.sql
--
-- 1) A standalone scored exam (separate from module quizzes): 15 MCQs,
--    graded out of 100 by the exam-submit edge function. `correct` and
--    `explanation` are hidden from the client (revealed only after grading).
-- 2) A "Vibe Coding Done Right" module in its own 'practice' section.
--
-- Run AFTER 0007.
-- ============================================================

-- ----------------------------------------------------------------
-- EXAM QUESTIONS (bilingual; single correct index)
-- ----------------------------------------------------------------
create table public.exam_questions (
  id          uuid primary key default uuid_generate_v4(),
  lang        public.lang_code not null default 'en',
  prompt      text not null,
  choices     jsonb not null,        -- array of 4 strings
  correct     integer not null,      -- correct index — NEVER sent to client
  explanation text,                  -- motivating + why; revealed only after grading
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_exam_questions_lang on public.exam_questions(lang, sort_order);

alter table public.exam_questions enable row level security;
create policy "exam_read_auth" on public.exam_questions
  for select using (auth.uid() is not null);
create policy "exam_admin_write" on public.exam_questions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Hide the answer key AND explanation from the browser (column-level).
-- exam-submit grades via the service role and returns them after the attempt.
revoke select on public.exam_questions from anon, authenticated;
grant  select (id, lang, prompt, choices, sort_order, created_at)
  on public.exam_questions to anon, authenticated;

-- ----------------------------------------------------------------
-- EXAM RESULTS (attempt history; powers "best score" + the pass badge)
-- ----------------------------------------------------------------
create table public.exam_results (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  lang       public.lang_code not null,
  score      integer not null,   -- 0-100
  passed     boolean not null,
  created_at timestamptz not null default now()
);

create index idx_exam_results_user on public.exam_results(user_id);

alter table public.exam_results enable row level security;
create policy "exam_results_own" on public.exam_results
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Exam pass badge (awarded by exam-submit at score >= 75).
insert into public.badges (code, title, criteria) values
  ('cert_sdlc_exam', 'SDLC Exam Passed', '{"type":"exam_passed"}');

-- ----------------------------------------------------------------
-- VIBE CODING module — its own 'practice' section
-- ----------------------------------------------------------------
insert into public.modules (code, title, sort_order, category) values
  ('vibe_coding', 'Vibe Coding Done Right', 16, 'practice');

insert into public.badges (code, title, criteria) values
  ('badge_vibe_coding', 'Vibe Coding Certified', '{"type":"module_passed","module":"vibe_coding"}');
