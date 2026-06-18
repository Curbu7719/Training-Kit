# TrainingKit — Design Document

**Version:** 0.3
**Date:** 2026-06-18
**Status:** Active — in development

A two-level e-learning platform that teaches **modern AI application architecture**
to everyone on a product team: developers, analysts, PMs, QA engineers alike.

The platform is fully deterministic at runtime — no LLM in the grading path.
Lessons are authored; quizzes and exercises are auto-graded server-side.

---

## 1. Decisions locked

| # | Decision | Choice |
|---|---|---|
| 1 | Content format | Authored lessons + auto-graded quizzes/exercises; no LLM at runtime |
| 2 | Audience | Single track for everyone — no role splitting; one shared curriculum |
| 3 | Curriculum | AI application architecture, vendor-neutral, practical and job-relevant |
| 4 | Levels | **L1 → L2** two-tier progression per module; L2 unlocks after L1 passed |
| 5 | Scoring | Points + badges + level locks + completion certificate |
| 6 | Language | English (UI + content) |
| 7 | Auth | Email/password via Supabase Auth; LDAP/SSO is a deferred seam |
| 8 | Repo | `trainingkit/`, Vite + React 18 + TS + Tailwind + Radix + Supabase |

---

## 2. Curriculum

Ten modules covering what every professional actually needs to work effectively
with AI systems. Scope: architecture, integration, evaluation, safety, and costs.
LLM internals (weights, training, temperature) are deliberately **out of scope** —
this is a builder and operator curriculum, not a researcher curriculum.

### Module list

| # | Module (code) | What you will be able to do after this module |
|---|---|---|
| 1 | How LLMs work (`llm_foundations`) | Explain what an LLM is and does in plain language; choose between models for a task |
| 2 | Tokens & costs (`tokens`) | Estimate token usage and cost; design prompts that stay within budget and limits |
| 3 | Context window management (`context_management`) | Handle long conversations and documents without losing information or hitting limits |
| 4 | Prompting for real work (`prompting`) | Write system prompts and user turns that produce reliable, structured output |
| 5 | Guardrails & safety (`guardrails`) | Identify injection and jailbreak risks; design layered defenses |
| 6 | Tool use & agents (`tool_use_agents`) | Design function-calling integrations; reason about agentic loops and failure modes |
| 7 | RAG — retrieval-augmented generation (`rag`) | Build a retrieval pipeline; choose chunking and embedding strategies |
| 8 | Evaluation & testing (`evaluation`) | Define evals; measure quality; set up regression tests for prompts and pipelines |
| 9 | Cost, latency & reliability (`cost_latency`) | Profile a pipeline; apply caching, routing, and streaming; set SLOs |
| 10 | AI system architecture (`ai_architecture`) | Read and draw a full AI system architecture; identify security and privacy risks |

### Why these ten

Every module maps to a decision a team member faces when building or operating
an AI product. Excluded on purpose:

- **Temperature, top-p, and other sampling parameters** — operators rarely need
  to tune these; the defaults are fine for almost all production use cases. Setting
  them is a one-line config change, not a curriculum topic.
- **Pre-training / fine-tuning internals** — unless you are training a model,
  this is not your job.
- **Academic benchmarks** — MMLU, HellaSwag, etc. are model-selection data points,
  not operational knowledge.

### L1 vs L2

Every module has two levels. A learner must pass L1 before L2 unlocks.

| Level | What it covers | Format |
|---|---|---|
| L1 | The concept in plain language + one worked example + a short quiz | Concept → Example → Quiz (3–5 questions) |
| L2 | Trade-offs, edge cases, failure modes + a scenario exercise | Deep-dive → Scenario exercise (interactive) |

L1 is designed to be completable in ~20 minutes.
L2 adds another ~30 minutes of depth.

---

## 3. Module anatomy

Every L1 unit:

1. **Concept** — plain-language explanation, no jargon without a definition.
2. **Worked example** — one concrete, realistic illustration from a product context.
3. **Alternative explanations** — 2–3 phrasings of the same concept for different
   mental models (developer / business / PM framing). Replaces an AI tutor.
4. **Quiz** — 3–5 auto-graded multiple-choice questions, graded server-side.

Every L2 unit adds:

5. **Deep-dive** — trade-offs, edge cases, what breaks in production.
6. **Scenario exercise** — one of the five auto-gradable types below.

### Exercise types (all deterministic, no free text)

| Type | Description | Example use |
|---|---|---|
| Multiple choice | Single or multi-select | "Which of these is a prompt injection?" |
| Ordering | Drag steps into correct sequence | "Order the RAG pipeline steps" |
| Matching | Connect concept ↔ definition | "Match each caching strategy to its trade-off" |
| Fill-in-the-blank | Exact or keyword-set match | "The context window is measured in ___" |
| Best-trade-off scenario | Pick a decision + justify it (two linked MCQs) | "Given this latency requirement, which approach is best and why?" |

---

## 4. Gamification & progression

- **Points:** each correct quiz answer and exercise interaction earns points.
- **Pass threshold:** ≥ 70% on a module level to mark it passed.
- **Level lock:** L2 is hidden until L1 is passed.
- **Badges:** one badge per module (awarded on L1 pass); one "depth" badge per module (L2 pass).
- **Certificate:** issued on passing all 10 modules at L1; a second "expert" certificate on all L2.
- **Leaderboard:** optional, opt-in, global (off by default, toggled by admin).
- Progress is per-user and fully resumable.

---

## 5. Technical architecture

```
┌──────────────────────────────────────────────────────────┐
│                  BROWSER (React SPA)                      │
│  Auth · Module list · Lesson player · Quiz · Exercise     │
│  Progress dashboard · Leaderboard · Admin (content)       │
└───────┬──────────────────────┬───────────────────────────┘
        │ supabase-js          │ REST (submit/grade)
        ▼                      ▼
┌──────────────────────────────────────────────────────────┐
│                       SUPABASE                            │
│  Auth (email/pw → LDAP/SSO seam)   Postgres + RLS        │
│  Edge Functions (Deno):                                   │
│    /quiz-submit   /exercise-submit   /progress            │
│    /content-admin                                         │
└──────────────────────────────────────────────────────────┘
```

- **Frontend:** React 18 + Vite + TypeScript + Tailwind + Radix UI.
- **Backend:** Supabase — Postgres + RLS + Auth + Edge Functions (Deno).
- **Grading is server-side only.** Answer keys never reach the client.
- **Auth:** email/password for MVP. `profiles` row carries display name and
  progress metadata. LDAP/SSO is a future seam — no schema change required.

### Grading edge functions

| Endpoint | Input | Logic |
|---|---|---|
| `/quiz-submit` | question_id + chosen answer(s) | compare to `correct` key, return is_correct + points |
| `/exercise-submit` | exercise_id + answer payload | type-specific deterministic check |
| `/progress` | user_id + module_id + level | recompute status, points total, badge/cert eligibility |

---

## 6. Data model (Postgres)

```
profiles        (id→auth.users, display_name, role[user|admin], created_at)
modules         (id, code, title, sort_order)
lessons         (id, module_id, level[L1|L2], kind[concept|example|quiz|exercise],
                 title, body_md, sort_order)
quiz_questions  (id, lesson_id, prompt, choices jsonb, correct jsonb, points)
exercises       (id, lesson_id, type[mcq|order|match|fill|scenario],
                 prompt_md, spec jsonb, answer_key jsonb, max_score)
user_progress   (id, user_id, module_id, level[L1|L2],
                 status[locked|in_progress|passed], score, updated_at)
quiz_attempts   (id, user_id, quiz_question_id, chosen jsonb, is_correct, created_at)
exercise_subs   (id, user_id, exercise_id, answer jsonb, score, passed, created_at)
badges          (id, code, title, criteria jsonb)
user_badges     (user_id, badge_id, awarded_at)
```

Key RLS rules:
- Users read all content rows except `correct` and `answer_key` columns.
- Users read/write only their own progress, attempts, and submissions.
- Admins write content rows.

Note: the `tracks` and `module_tracks` tables from v0.2 are removed. There is
one shared module list; the `active_track` column is removed from `profiles`.

---

## 7. Repo structure

```
trainingkit/
├── DESIGN.md
├── content/
│   └── modules/<code>/
│       ├── l1-concept.md
│       ├── l1-example.md
│       ├── l1-hints.md
│       ├── l1-quiz.json
│       ├── l2-deepdive.md
│       └── l2-exercise.json
├── src/
│   ├── lib/supabase.ts
│   ├── hooks/{useAuth, useProgress, useQuiz, useExercise}
│   ├── components/{auth, dashboard, lesson, quiz, exercise, admin, shared, ui}
│   └── pages/{Login, Dashboard, LessonPlayer, Leaderboard, Admin}
├── supabase/
│   ├── migrations/0001_initial_schema.sql
│   └── functions/
│       ├── quiz-submit/  exercise-submit/  progress/  content-admin/
│       └── _shared/{supabase-client.ts, auth.ts, grading.ts}
└── scripts/seed-content.mjs
```

---

## 8. Build phases

| Phase | Owner | Deliverable |
|---|---|---|
| 0 | scaffold | Vite + React + TS + Tailwind + Radix + Supabase config |
| 1 | fullstack | Schema migration, auth (email/pw), login → dashboard flow |
| 2 | fullstack | Grading edge functions (`/quiz-submit`, `/exercise-submit`, `/progress`) |
| 3 | ui + fullstack | Lesson player, quiz widget, 5 exercise widgets, progress dashboard |
| 4 | content | Author all 10 modules × L1 + L2 content + seed script |
| 5 | fullstack | Badges, certificate, leaderboard, admin content UI |
| 6 | e2e | Playwright: login → module → quiz → exercise → badge. Deploy config. |

---

## 9. Open questions

1. Should a user be able to jump ahead and attempt L2 without passing L1?
   (Current default: no — hard lock.)
2. Leaderboard opt-in or opt-out at account creation?
3. Hosting target for the SPA (Supabase static / Vercel / internal)?
4. LDAP/SSO provider when implemented (Azure AD / Okta / direct)? — deferred.
