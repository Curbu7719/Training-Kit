# TrainingKit

A role-based e-learning platform that teaches the general principles of modern
application architecture in plain language — with worked examples, auto-graded
exercises, progress tracking and gamified scoring.

The training flow is **fully deterministic** (no LLM at runtime): lessons are
authored; quizzes and exercises are graded server-side against an answer key.

See [`DESIGN.md`](./DESIGN.md) for the full design.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind + Radix UI
- **Backend:** Supabase — Postgres + RLS + Auth + Edge Functions (Deno)
- **Auth:** email/password (MVP); LDAP/SSO is a deferred seam

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:5173
```

### Database

```bash
supabase start               # local stack
supabase db reset            # applies supabase/migrations/*
npm run seed                 # loads content/ into the DB
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright E2E |
| `npm run seed` | Seed curriculum content into Supabase |
