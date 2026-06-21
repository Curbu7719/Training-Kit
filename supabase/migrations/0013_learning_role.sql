-- ============================================================
-- TrainingKit — learning_role column for role-based paths
-- Migration: 0013_learning_role.sql
--
-- Adds a nullable text column holding the learner's chosen SDLC role
-- (e.g. 'developer', 'portfolio_manager'). Distinct from profiles.role,
-- which is the auth role ('user' | 'admin'). No FK — role codes live in the
-- frontend ROLE_PATHS config. The existing profiles_own_update RLS policy
-- lets a user set their own learning_role from the client. Run AFTER 0012.
-- ============================================================

alter table public.profiles add column if not exists learning_role text;
