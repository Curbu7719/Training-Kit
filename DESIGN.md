# TrainingKit — Design Document

**Version:** 0.2 (Draft for review)
**Date:** 2026-06-17
**Status:** Design — pre-implementation

A role-based e-learning platform that teaches the **general principles of modern
application architecture** in plain language, with worked examples, hands-on
exercises, progress tracking and gamified scoring.

The *topic list* (curriculum scope) is derived from the real architectural
decisions in the BRDWizard project, but the *content is taught generically* —
abstract principles with generic examples, not a BRDWizard case study.

**The training flow is fully deterministic — no LLM at runtime.** Lessons are
authored; quizzes and exercises are auto-graded server-side against an answer key.

---

## 1. Decisions locked (2026-06-17)

| # | Decision | Choice |
|---|---|---|
| 1 | Content format | **Hybrid authoring, deterministic runtime** — authored lessons; auto-graded quizzes/exercises; no LLM in the flow |
| 2 | AI / LLM | **None at runtime.** No AI tutor, no free-text AI grading. (Removes the Azure/GitHub-Models choice entirely.) |
| 3 | Curriculum framing | **Fully generic/abstract** — topics derived from BRDWizard, content taught abstractly |
| 4 | Roles (tracks) | Developer · Business Analyst · PM/PO · QA & Architect |
| 5 | Scoring | **Full gamification** — points + badges + level locks + per-track certificate + optional leaderboard |
| 6 | Language | **English** (UI + content) |
| 7 | Auth | **Email/password (MVP)** via Supabase Auth; **LDAP/SSO is a deferred seam** (BRDWizard ARCHITECTURE §6.2 — `signInWithSSO()`, no schema change) |
| 8 | Repo | Fresh scaffold in `trainingkit/`, reusing BRDWizard patterns |

---

## 2. Curriculum

Ten generic modules, each derived from a BRDWizard architectural decision but
taught as a transferable principle.

**Subject (v0.3): generalized AI/LLM application architecture** — vendor-neutral,
modeled on an "AI architect" certification. Each module also includes a
"How each role uses this" section connecting the concept to each role's day job.

| # | Module (code) | Covers |
|---|---|---|
| 1 | LLM Foundations (`llm_foundations`) | What models are, next-token prediction, capabilities & limits, model choice |
| 2 | Tokens & Tokenization (`tokens`) | What a token is, token↔cost/limit, input vs output tokens |
| 3 | Context Management (`context_management`) | Context window, stateless calls, summarization/chunking/checkpointing |
| 4 | Prompting (`prompting`) | System/user roles, structure, few-shot, output control |
| 5 | Guardrails & Safety (`guardrails`) | Input/output controls, injection/jailbreaks, defense-in-depth |
| 6 | Tool Use & Agents (`tool_use_agents`) | Function calling, the agent loop, when agents help, risks |
| 7 | RAG (`rag`) | Chunk→embed→retrieve→augment→generate, grounding, citations |
| 8 | Evaluation (`evaluation`) | Evals, metrics, LLM-as-judge, regression testing |
| 9 | Cost, Latency & Performance (`cost_latency`) | Token cost, latency drivers, caching/routing/streaming |
| 10 | AI System Architecture (`ai_architecture`) | Reference architecture, security/privacy, reliability, deployment |

### 2.1 Role × Module × Level matrix (draft)

Same module pool; per role, which modules are required at L1 (entry) vs L2 (deep).

| Module | Developer | Business Analyst | PM/PO | QA & Architect |
|---|---|---|---|---|
| 1 LLM Foundations | L1 | L1 | L1 | L1 |
| 2 Tokens | L1 | L1 | L1 | L1 |
| 3 Context Management | L1 | L2 | L2 | L1 |
| 4 Prompting | L1 | L1 | L1 | L1 |
| 5 Guardrails | L1 | L2 | L2 | L1 |
| 6 Tool Use & Agents | L2 | — | L2 | L1 |
| 7 RAG | L2 | — | L2 | L1 |
| 8 Evaluation | L2 | L2 | L2 | L1 |
| 9 Cost & Latency | L2 | — | L2 | L2 |
| 10 AI System Architecture | L2 | — | L2 | L1 |

- **L1** = role-appropriate entry level: the concept in plain language + one worked example.
- **L2** = deeper: trade-offs, edge cases, and a scenario exercise.
- A user picks a track; the matrix defines their required path. Modules not in
  their track are still browsable (optional, no badge weight).

### 2.2 Module anatomy

Every module is a sequence of **lesson units** — all deterministic:

1. **Concept** — short, plain-language explanation (authored markdown).
2. **Worked example** — one generic, concrete illustration (authored).
3. **Multiple explanations / hints** — replaces an AI tutor: each concept ships with
   2–3 alternative phrasings + a hint stack + a short FAQ (all authored).
4. **Quiz** — 3–5 auto-graded questions, checked server-side against the key.
5. **Scenario exercise** — an auto-gradable interaction (see §2.3), no free text.

### 2.3 Deterministic exercise types

All auto-gradable without an LLM; the curriculum maps cleanly onto these:

- **Multiple choice** (single / multi-select).
- **Ordering / sequencing** — e.g. order the layers of a request flow.
- **Matching** — concept ↔ definition, decision ↔ rationale.
- **Fill-in-the-blank** — exact or keyword-set match.
- **Best-trade-off scenario** — given a situation, pick the best decision *and* the
  reason (two linked MCQs). This is how ADR/trade-off modules are exercised.

---

## 3. Gamification & progression

- **Points:** quiz (per correct answer) + exercise (per correct interaction).
- **Pass threshold:** a module is *passed* at ≥70% combined.
- **Level locks:** L2 of a module unlocks only after L1 passed; later modules may
  list prerequisites (a small DAG, not strictly linear).
- **Badges:** per-module completion badge; per-level (all-L1 / all-L2 in track) badge.
- **Certificate:** issued on completing a track's full required path (L1+L2).
- **Leaderboard:** optional, opt-in, per-track and global (toggleable by admin).
- All progress is per-user and resumable.

---

## 4. Technical architecture

Reuses the BRDWizard stack (minus the LLM layer) — we "dogfood" the architecture we teach.

```
┌──────────────────────────────────────────────────────────┐
│                  BROWSER (React SPA)                      │
│  Auth · Track picker · Lesson player · Quiz · Exercise    │
│  Progress dashboard · Leaderboard · Admin (content)       │
└───────┬──────────────────────┬───────────────────────────┘
        │ supabase-js          │ REST (submit/grade)
        ▼                      ▼
┌──────────────────────────────────────────────────────────┐
│                       SUPABASE                            │
│  Auth (email/pw MVP → LDAP/SSO seam)   Postgres + RLS     │
│  Edge Functions (Deno):                                   │
│    /quiz-submit   /exercise-submit   /progress            │
│    /content-admin                                         │
└──────────────────────────────────────────────────────────┘
```

- **Frontend:** React 18 + Vite + TS + Tailwind + Radix UI (same component set).
- **Backend:** Supabase — Postgres + RLS + Auth + Edge Functions (Deno).
- **No external AI dependency.** Grading is deterministic; the answer key lives
  server-side and is never shipped to the client.
- **Auth:** Supabase Auth email/password for MVP. `profiles` table carries the
  chosen track + role + admin flag. LDAP/SSO is a future swap — no schema change.

### 4.1 Grading map

| Use | Function | Logic |
|---|---|---|
| Quiz answer | `/quiz-submit` | compare chosen index/set to `correct` key |
| Exercise answer | `/exercise-submit` | type-specific deterministic check (order, match, keywords, MCQ) |
| Progress/badges | `/progress` | recompute status, points, badge/cert eligibility |

Grading runs in edge functions (not the client) so answer keys stay private and
scores can't be forged. RLS still guards all reads/writes.

---

## 5. Data model (Postgres sketch)

```
profiles        (id→auth.users, display_name, role[user|admin], active_track, created_at)
tracks          (id, code, title, description, sort_order)
modules         (id, code, title, concept_md, sort_order)
module_tracks   (module_id, track_id, level[L1|L2], required, prereq_module_id?)   -- the matrix
lessons         (id, module_id, kind[concept|example|quiz|exercise], title, body_md, sort_order)
quiz_questions  (id, lesson_id, prompt, choices jsonb, correct jsonb, points)
exercises       (id, lesson_id, type[mcq|order|match|fill|scenario], prompt_md, spec jsonb, answer_key jsonb, max_score)
user_progress   (id, user_id, module_id, level, status[locked|in_progress|passed], score, updated_at)
quiz_attempts   (id, user_id, quiz_question_id, chosen jsonb, is_correct, created_at)
exercise_subs   (id, user_id, exercise_id, answer jsonb, score, passed, created_at)
badges          (id, code, title, criteria jsonb)
user_badges     (user_id, badge_id, awarded_at)
```

- **RLS:** users read shared content (tracks/modules/lessons/quiz/exercises *minus
  the answer key columns* — keys exposed only to edge functions via service role);
  users read/write only their own progress/attempts/submissions; admins write content.
  Same RLS patterns as BRDWizard §2.1.
- `quiz_questions.correct` and `exercises.answer_key` are **never selected by the
  client** — graded server-side only.
- Content tables are admin-editable at runtime (content-admin function + UI).

---

## 6. Repo structure (target)

```
trainingkit/
├── DESIGN.md                    ← this document
├── docs/
│   ├── ARCHITECTURE.md          ← derived, app-specific
│   └── CONTENT-GUIDE.md         ← how lessons/exercises are authored
├── content/                     ← authored curriculum (markdown + json seeds)
│   └── modules/<code>/{concept.md, example.md, hints.md, quiz.json, exercise.json}
├── src/                         ← React SPA
│   ├── lib/supabase.ts
│   ├── hooks/{useAuth, useProgress, useQuiz, useExercise}
│   ├── components/{auth, dashboard, lesson, quiz, exercise, admin, shared, ui}
│   └── pages/{Login, TrackPicker, Dashboard, LessonPlayer, Leaderboard, Admin}
├── supabase/
│   ├── migrations/0001_initial_schema.sql
│   └── functions/
│       ├── quiz-submit/   exercise-submit/   progress/   content-admin/
│       └── _shared/{supabase-client.ts, auth.ts, grading.ts}
└── scripts/seed-content.mjs     ← loads content/ into DB
```

---

## 7. Build plan — subagent team

Phased build; each phase a focused subagent (or small parallel set).

**Phase 0 — Foundation**
- Scaffold Vite+React+TS+Tailwind+Radix; Supabase config; env seams.

**Phase 1 — Data & auth**
- `design-architect` → `fullstack-dev-assistant`: migrations (schema §5 + RLS),
  email/password login, `profiles` + track selection. Leave LDAP/SSO seam stubbed.

**Phase 2 — Grading edge functions**
- `fullstack-dev-assistant`: `_shared/grading.ts` (per-type deterministic graders);
  `/quiz-submit`, `/exercise-submit`, `/progress`.

**Phase 3 — Learning UI**
- `ui-ux-designer` → `fullstack-dev-assistant`: lesson player, the 5 exercise-type
  widgets, quiz, multi-explanation/hint panel, progress dashboard, gamification surface.

**Phase 4 — Content**
- content-authoring agent: write generic lessons + hints + quizzes + exercises for
  the 10 modules (English), seed via `content/` + `scripts/seed-content.mjs`.

**Phase 5 — Admin + gamification logic**
- Badges/certificate/leaderboard logic; content-admin UI.

**Phase 6 — Tests & deploy**
- `e2e-test-engineer`: Playwright flows (login → track → lesson → quiz → exercise
  → progress → badge). Deploy config (Supabase + static host).

---

## 8. Open questions

1. Track enrollment: single active track per user, or multiple concurrent tracks?
2. Leaderboard on by default at launch, or admin-gated off?
3. Hosting target for the SPA (Supabase static / Vercel / internal)?
4. LDAP/SSO: which provider when we get there (Azure AD / Okta / direct)? — deferred.
```
