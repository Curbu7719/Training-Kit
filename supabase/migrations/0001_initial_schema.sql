-- ============================================================
-- TrainingKit — Initial Schema
-- Migration: 0001_initial_schema.sql
-- Postgres 15 / Supabase
--
-- Tables: profiles, tracks, modules, module_tracks, lessons,
--         quiz_questions, exercises, user_progress, quiz_attempts,
--         exercise_subs, badges, user_badges
--
-- Answer-key privacy (DESIGN.md §4 & §5):
--   quiz_questions.correct and exercises.answer_key are NEVER
--   selectable by anon or authenticated roles. Column-level
--   REVOKE + GRANT is applied after RLS so the service_role
--   (used by edge functions) retains full access. The browser
--   never sees answer keys regardless of RLS outcomes.
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type public.profile_role   as enum ('user', 'admin');
create type public.lesson_kind    as enum ('concept', 'example', 'quiz', 'exercise');
create type public.module_level   as enum ('L1', 'L2');
create type public.exercise_type  as enum ('mcq', 'order', 'match', 'fill', 'scenario');
create type public.progress_status as enum ('locked', 'in_progress', 'passed');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  role          public.profile_role not null default 'user',
  -- active_track stores the tracks.code string; FK added after tracks exists (see below).
  -- Code (not uuid) so the frontend can read/write it directly without an id lookup.
  active_track  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on Supabase Auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role, active_track)
  values (new.id, new.email, 'user', null);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRACKS  (developer | business_analyst | pm_po | qa_architect)
-- ============================================================
create table public.tracks (
  id          uuid primary key default uuid_generate_v4(),
  code        text not null unique,   -- developer | business_analyst | pm_po | qa_architect
  title       text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Back-fill the FK from profiles → tracks now that tracks exists.
-- References tracks(code) (unique) so active_track holds the readable code string.
alter table public.profiles
  add constraint fk_profiles_active_track
  foreign key (active_track) references public.tracks(code) on delete set null;

-- ============================================================
-- MODULES
-- ============================================================
create table public.modules (
  id          uuid primary key default uuid_generate_v4(),
  code        text not null unique,
  title       text not null,
  concept_md  text,          -- short overview blurb; full content lives in lessons
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- MODULE_TRACKS  (the role × module × level matrix — DESIGN.md §2.1)
-- Each non-dash cell in the matrix becomes one row.
-- prereq_module_id: L1→L2 gating is enforced in app logic
-- (see DESIGN.md §3 "L2 unlocks only after L1 passed") — the
-- prereq column is available for explicit cross-module prereqs.
-- ============================================================
create table public.module_tracks (
  id               uuid primary key default uuid_generate_v4(),
  module_id        uuid not null references public.modules(id) on delete cascade,
  track_id         uuid not null references public.tracks(id) on delete cascade,
  level            public.module_level not null,
  required         boolean not null default true,
  prereq_module_id uuid references public.modules(id) on delete set null,
  unique (module_id, track_id, level)
);

create index idx_module_tracks_track  on public.module_tracks(track_id);
create index idx_module_tracks_module on public.module_tracks(module_id);

-- ============================================================
-- LESSONS
-- ============================================================
-- level: which depth tier a lesson belongs to. A user enrolled in a module at
-- L1 sees only L1 lessons; an L2 user sees L1 + L2 lessons (cumulative depth).
-- See docs/CONTENT-GUIDE.md ("Levels & the l2/ folder").
create table public.lessons (
  id         uuid primary key default uuid_generate_v4(),
  module_id  uuid not null references public.modules(id) on delete cascade,
  kind       public.lesson_kind not null,
  level      public.module_level not null default 'L1',
  title      text not null,
  body_md    text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_lessons_module       on public.lessons(module_id);
create index idx_lessons_module_level on public.lessons(module_id, level);

-- ============================================================
-- QUIZ QUESTIONS
--
-- ANSWER-KEY PRIVACY: quiz_questions.correct is NEVER exposed
-- to anon or authenticated roles. Column-level privileges are
-- set at the bottom of this file. Edge functions grade via
-- service_role which retains full SELECT.
-- ============================================================
create table public.quiz_questions (
  id         uuid primary key default uuid_generate_v4(),
  lesson_id  uuid not null references public.lessons(id) on delete cascade,
  prompt     text not null,
  choices    jsonb not null,   -- array of strings, e.g. ["A", "B", "C", "D"]
  correct    jsonb not null,   -- answer key — NEVER sent to client
  points     integer not null default 1,
  created_at timestamptz not null default now()
);

create index idx_quiz_questions_lesson on public.quiz_questions(lesson_id);

-- ============================================================
-- EXERCISES
--
-- ANSWER-KEY PRIVACY: exercises.answer_key is NEVER exposed
-- to anon or authenticated roles. Same column-level pattern.
-- ============================================================
create table public.exercises (
  id          uuid primary key default uuid_generate_v4(),
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  type        public.exercise_type not null,
  prompt_md   text not null,
  spec        jsonb not null,        -- type-specific config (see CONTENT-GUIDE.md)
  answer_key  jsonb not null,        -- grading key — NEVER sent to client
  max_score   integer not null default 10,
  created_at  timestamptz not null default now()
);

create index idx_exercises_lesson on public.exercises(lesson_id);

-- ============================================================
-- USER PROGRESS  (per user, per module, per level)
-- ============================================================
create table public.user_progress (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  module_id  uuid not null references public.modules(id) on delete cascade,
  level      public.module_level not null,
  status     public.progress_status not null default 'locked',
  score      integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id, level)
);

create index idx_user_progress_user   on public.user_progress(user_id);
create index idx_user_progress_module on public.user_progress(module_id);

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================
create table public.quiz_attempts (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  quiz_question_id uuid not null references public.quiz_questions(id) on delete cascade,
  chosen           jsonb not null,   -- what the user submitted
  is_correct       boolean not null,
  created_at       timestamptz not null default now()
);

create index idx_quiz_attempts_user     on public.quiz_attempts(user_id);
create index idx_quiz_attempts_question on public.quiz_attempts(quiz_question_id);

-- ============================================================
-- EXERCISE SUBMISSIONS
-- ============================================================
create table public.exercise_subs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  answer      jsonb not null,
  score       integer not null default 0,
  passed      boolean not null default false,
  created_at  timestamptz not null default now()
);

create index idx_exercise_subs_user     on public.exercise_subs(user_id);
create index idx_exercise_subs_exercise on public.exercise_subs(exercise_id);

-- ============================================================
-- BADGES
-- ============================================================
create table public.badges (
  id       uuid primary key default uuid_generate_v4(),
  code     text not null unique,
  title    text not null,
  criteria jsonb not null   -- e.g. {"type":"module_passed","module":"layered_architecture"}
);

-- ============================================================
-- USER BADGES  (awarded_at records when unlocked)
-- ============================================================
create table public.user_badges (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  badge_id   uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create index idx_user_badges_user on public.user_badges(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles: user reads/writes only their own row
alter table public.profiles enable row level security;
create policy "profiles_own_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_own_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- tracks: any authenticated user reads; only admins write
alter table public.tracks enable row level security;
create policy "tracks_read_auth" on public.tracks
  for select using (auth.uid() is not null);
create policy "tracks_admin_write" on public.tracks
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- modules: same pattern as tracks
alter table public.modules enable row level security;
create policy "modules_read_auth" on public.modules
  for select using (auth.uid() is not null);
create policy "modules_admin_write" on public.modules
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- module_tracks: same pattern
alter table public.module_tracks enable row level security;
create policy "module_tracks_read_auth" on public.module_tracks
  for select using (auth.uid() is not null);
create policy "module_tracks_admin_write" on public.module_tracks
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- lessons: same pattern
alter table public.lessons enable row level security;
create policy "lessons_read_auth" on public.lessons
  for select using (auth.uid() is not null);
create policy "lessons_admin_write" on public.lessons
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- quiz_questions: RLS allows select; column-level REVOKE below hides `correct`
alter table public.quiz_questions enable row level security;
create policy "quiz_questions_read_auth" on public.quiz_questions
  for select using (auth.uid() is not null);
create policy "quiz_questions_admin_write" on public.quiz_questions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- exercises: RLS allows select; column-level REVOKE below hides `answer_key`
alter table public.exercises enable row level security;
create policy "exercises_read_auth" on public.exercises
  for select using (auth.uid() is not null);
create policy "exercises_admin_write" on public.exercises
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- badges: any authenticated user reads; only admins write
alter table public.badges enable row level security;
create policy "badges_read_auth" on public.badges
  for select using (auth.uid() is not null);
create policy "badges_admin_write" on public.badges
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- user_progress: user reads/writes only their own rows
alter table public.user_progress enable row level security;
create policy "user_progress_own" on public.user_progress
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- quiz_attempts: user reads/writes only their own rows
alter table public.quiz_attempts enable row level security;
create policy "quiz_attempts_own" on public.quiz_attempts
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- exercise_subs: user reads/writes only their own rows
alter table public.exercise_subs enable row level security;
create policy "exercise_subs_own" on public.exercise_subs
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- user_badges: user reads only their own rows (badges are awarded by edge functions via service_role)
alter table public.user_badges enable row level security;
create policy "user_badges_own_select" on public.user_badges
  for select using (user_id = auth.uid());

-- ============================================================
-- COLUMN-LEVEL PRIVILEGES — ANSWER KEY PRIVACY
--
-- Revoke SELECT on entire tables for anon + authenticated,
-- then grant back every column EXCEPT the answer-key columns.
-- service_role retains full access (it is not listed in REVOKE).
-- Edge functions (/quiz-submit, /exercise-submit) use the
-- service-role client and can read correct/answer_key.
--
-- Note: RLS SELECT policies above still apply (anon/authenticated
-- can only reach rows they're allowed to read), but even if a
-- policy were misconfigured the column-level REVOKE is a hard
-- backstop that prevents the secret columns from leaking.
-- ============================================================

-- quiz_questions: hide `correct`
revoke select on public.quiz_questions from anon, authenticated;
grant  select (id, lesson_id, prompt, choices, points, created_at)
  on public.quiz_questions to anon, authenticated;

-- exercises: hide `answer_key`
revoke select on public.exercises from anon, authenticated;
grant  select (id, lesson_id, type, prompt_md, spec, max_score, created_at)
  on public.exercises to anon, authenticated;
