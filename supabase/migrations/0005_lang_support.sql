-- ============================================================
-- TrainingKit — Bilingual (EN/TR) support
-- Migration: 0005_lang_support.sql
--
-- Content is stored per language: each lesson (and its quiz_questions /
-- exercises, which inherit via lesson_id) carries a `lang`. A user's
-- preferred language lives on profiles.lang. Progress (user_progress)
-- stays language-agnostic — passing a module in EITHER language counts.
--
-- Default language is English; existing rows become 'en'. Run AFTER 0004,
-- then re-seed (the seeder loads en from the module root and tr from tr/).
-- ============================================================

create type public.lang_code as enum ('en', 'tr');

alter table public.lessons
  add column lang public.lang_code not null default 'en';

alter table public.profiles
  add column lang public.lang_code not null default 'en';

-- The lesson player and recompute filter by (module_id, level, lang).
create index idx_lessons_module_level_lang
  on public.lessons(module_id, level, lang);
