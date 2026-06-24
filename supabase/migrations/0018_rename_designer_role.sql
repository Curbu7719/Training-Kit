-- ============================================================
-- TrainingKit — rename the "designer" learning role to "solution_designer"
-- Migration: 0018_rename_designer_role.sql
--
-- The role formerly known as 'designer' is now 'solution_designer'. The role
-- code lives as free text in role_paths.role and profiles.learning_role (see
-- 0013_learning_role.sql, 0016_role_paths.sql). Rewrite both so existing seed
-- rows and any learners who already picked the role keep their path. The
-- frontend ROLE_PATHS / i18n keys are updated to match. Run AFTER 0017.
-- ============================================================

update public.role_paths
  set role = 'solution_designer'
  where role = 'designer';

update public.profiles
  set learning_role = 'solution_designer'
  where learning_role = 'designer';
