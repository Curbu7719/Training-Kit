-- ============================================================
-- 0014  Completion reflection (mandatory end-of-training writeup)
-- ============================================================
-- When a learner finishes the training, they must write what they can now do
-- in their OWN day-to-day work with what they learned, and the value/gain it
-- will bring. One row per user (latest wins; they may revise it).
--
-- Privacy: each learner can read/write ONLY their own row (RLS own-row policy),
-- so learners never see each other's reflections. Admins read all of them via
-- the admin-api edge function, which uses the service role and bypasses RLS.
-- ============================================================

create table public.completion_reflections (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  work_application text not null,   -- what they can now do in their own work
  expected_value   text not null,   -- the gain/value it will bring
  lang             public.lang_code not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.completion_reflections enable row level security;

-- Own-row only: read, insert, and update are all scoped to the caller.
-- Admin cross-user reads happen via the service role (admin-api), not RLS.
create policy "completion_reflections_own" on public.completion_reflections
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
