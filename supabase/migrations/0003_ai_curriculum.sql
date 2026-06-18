-- ============================================================
-- TrainingKit — Curriculum pivot to AI/LLM topics
-- Migration: 0003_ai_curriculum.sql
--
-- Replaces the generic software-architecture modules with a
-- generalized AI/LLM application-architecture curriculum
-- (vendor-neutral; modeled on an "AI architect" certification:
-- models, tokens, context, prompting, guardrails, agents, RAG,
-- evaluation, cost/latency, system architecture).
--
-- Tracks (4 roles) are unchanged. This wipes the old modules and
-- badges (cascading lessons/quiz/exercises/module_tracks/progress
-- and user_badges) and inserts the new curriculum. Run AFTER 0002.
-- ============================================================

-- ---- Clear old curriculum (cascades remove all dependent rows) ----
delete from public.badges;    -- cascades user_badges
delete from public.modules;   -- cascades module_tracks, lessons, quiz_questions, exercises, user_progress

-- ============================================================
-- MODULES (AI/LLM curriculum)
-- ============================================================
insert into public.modules (code, title, sort_order) values
  ('llm_foundations',  'LLM Foundations — What Models Are & How They Work', 1),
  ('tokens',           'Tokens & Tokenization',                             2),
  ('context_management','Context Windows & Context Management',             3),
  ('prompting',        'Prompting & Prompt Engineering',                    4),
  ('guardrails',       'Guardrails & Safety',                               5),
  ('tool_use_agents',  'Tool Use & Agents',                                 6),
  ('rag',              'Retrieval-Augmented Generation (RAG)',              7),
  ('evaluation',       'Evaluating AI Systems',                             8),
  ('cost_latency',     'Cost, Latency & Performance',                       9),
  ('ai_architecture',  'AI System Architecture & Deployment',              10);

-- ============================================================
-- MODULE_TRACKS — role × module × level matrix
-- Foundational topics are L1 for everyone; deeper/technical
-- topics (agents, RAG, evaluation, architecture) go L2 and are
-- weighted toward Developer and QA & Architect tracks.
-- ============================================================
insert into public.module_tracks (module_id, track_id, level, required)
select m.id, t.id, v.level::public.module_level, true
from (values
  -- (module_code, track_code, level)
  -- 1 LLM foundations — L1 for all
  ('llm_foundations',   'developer',        'L1'),
  ('llm_foundations',   'business_analyst', 'L1'),
  ('llm_foundations',   'pm_po',            'L1'),
  ('llm_foundations',   'qa_architect',     'L1'),
  -- 2 Tokens — L1 for all
  ('tokens',            'developer',        'L1'),
  ('tokens',            'business_analyst', 'L1'),
  ('tokens',            'pm_po',            'L1'),
  ('tokens',            'qa_architect',     'L1'),
  -- 3 Context management — deeper for BA/PM
  ('context_management','developer',        'L1'),
  ('context_management','business_analyst', 'L2'),
  ('context_management','pm_po',            'L2'),
  ('context_management','qa_architect',     'L1'),
  -- 4 Prompting — L1 for all
  ('prompting',         'developer',        'L1'),
  ('prompting',         'business_analyst', 'L1'),
  ('prompting',         'pm_po',            'L1'),
  ('prompting',         'qa_architect',     'L1'),
  -- 5 Guardrails — deeper for BA/PM
  ('guardrails',        'developer',        'L1'),
  ('guardrails',        'business_analyst', 'L2'),
  ('guardrails',        'pm_po',            'L2'),
  ('guardrails',        'qa_architect',     'L1'),
  -- 6 Tool use & agents — technical; BA dash
  ('tool_use_agents',   'developer',        'L2'),
  ('tool_use_agents',   'pm_po',            'L2'),
  ('tool_use_agents',   'qa_architect',     'L1'),
  -- 7 RAG — technical; BA dash
  ('rag',               'developer',        'L2'),
  ('rag',               'pm_po',            'L2'),
  ('rag',               'qa_architect',     'L1'),
  -- 8 Evaluation — L2 broadly (everyone cares about quality)
  ('evaluation',        'developer',        'L2'),
  ('evaluation',        'business_analyst', 'L2'),
  ('evaluation',        'pm_po',            'L2'),
  ('evaluation',        'qa_architect',     'L1'),
  -- 9 Cost, latency & performance — technical; BA dash
  ('cost_latency',      'developer',        'L2'),
  ('cost_latency',      'pm_po',            'L2'),
  ('cost_latency',      'qa_architect',     'L2'),
  -- 10 AI system architecture — technical; BA dash
  ('ai_architecture',   'developer',        'L2'),
  ('ai_architecture',   'pm_po',            'L2'),
  ('ai_architecture',   'qa_architect',     'L1')
) as v(module_code, track_code, level)
join public.modules m on m.code = v.module_code
join public.tracks  t on t.code = v.track_code;

-- ============================================================
-- BADGES — per-module + per-track-level + per-track certificate
-- ============================================================
insert into public.badges (code, title, criteria) values
  ('badge_llm_foundations',   'LLM Foundations Certified',      '{"type":"module_passed","module":"llm_foundations"}'),
  ('badge_tokens',            'Tokens Certified',               '{"type":"module_passed","module":"tokens"}'),
  ('badge_context_management','Context Management Certified',   '{"type":"module_passed","module":"context_management"}'),
  ('badge_prompting',         'Prompting Certified',            '{"type":"module_passed","module":"prompting"}'),
  ('badge_guardrails',        'Guardrails & Safety Certified',  '{"type":"module_passed","module":"guardrails"}'),
  ('badge_tool_use_agents',   'Tool Use & Agents Certified',    '{"type":"module_passed","module":"tool_use_agents"}'),
  ('badge_rag',               'RAG Certified',                  '{"type":"module_passed","module":"rag"}'),
  ('badge_evaluation',        'Evaluation Certified',           '{"type":"module_passed","module":"evaluation"}'),
  ('badge_cost_latency',      'Cost & Latency Certified',       '{"type":"module_passed","module":"cost_latency"}'),
  ('badge_ai_architecture',   'AI Architecture Certified',      '{"type":"module_passed","module":"ai_architecture"}');

insert into public.badges (code, title, criteria) values
  ('badge_all_l1_developer',        'Developer Track — All L1 Complete',        '{"type":"track_level_complete","track":"developer","level":"L1"}'),
  ('badge_all_l1_business_analyst', 'Business Analyst Track — All L1 Complete',  '{"type":"track_level_complete","track":"business_analyst","level":"L1"}'),
  ('badge_all_l1_pm_po',            'PM / PO Track — All L1 Complete',           '{"type":"track_level_complete","track":"pm_po","level":"L1"}'),
  ('badge_all_l1_qa_architect',     'QA & Architect Track — All L1 Complete',    '{"type":"track_level_complete","track":"qa_architect","level":"L1"}');

insert into public.badges (code, title, criteria) values
  ('badge_all_l2_developer',        'Developer Track — All L2 Complete',        '{"type":"track_level_complete","track":"developer","level":"L2"}'),
  ('badge_all_l2_business_analyst', 'Business Analyst Track — All L2 Complete',  '{"type":"track_level_complete","track":"business_analyst","level":"L2"}'),
  ('badge_all_l2_pm_po',            'PM / PO Track — All L2 Complete',           '{"type":"track_level_complete","track":"pm_po","level":"L2"}'),
  ('badge_all_l2_qa_architect',     'QA & Architect Track — All L2 Complete',    '{"type":"track_level_complete","track":"qa_architect","level":"L2"}');

insert into public.badges (code, title, criteria) values
  ('cert_developer',        'AI Architect — Developer / Engineer Certificate', '{"type":"track_complete","track":"developer"}'),
  ('cert_business_analyst', 'AI Architect — Business Analyst Certificate',      '{"type":"track_complete","track":"business_analyst"}'),
  ('cert_pm_po',            'AI Architect — PM / Product Owner Certificate',    '{"type":"track_complete","track":"pm_po"}'),
  ('cert_qa_architect',     'AI Architect — QA & Architect Certificate',       '{"type":"track_complete","track":"qa_architect"}');
