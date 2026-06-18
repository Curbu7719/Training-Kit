# TrainingKit — Deployment

The app is two parts: a **static React SPA** (frontend) and a **Supabase backend**
(Postgres + RLS + Auth + Edge Functions). The backend is already live; this doc
covers (re)deploying both.

---

## 1. Backend — Supabase (already provisioned)

- **Project:** "Training Kit", ref `ymliczohkmksptbxtpah`, region ap-northeast-1.
- Schema + seed + 3 edge functions (`quiz-submit`, `exercise-submit`, `progress`)
  are deployed; 10 modules of content are seeded. Email auto-confirm is ON.

Operational commands (need `SUPABASE_ACCESS_TOKEN` in env):

```bash
# Apply / re-apply a migration (no DB password needed — Management API query endpoint)
node scripts/apply-remote-sql.mjs ymliczohkmksptbxtpah supabase/migrations/0001_initial_schema.sql
node scripts/apply-remote-sql.mjs ymliczohkmksptbxtpah supabase/migrations/0002_seed.sql

# Deploy edge functions (v2 CLI bundles without Docker)
npx supabase functions deploy --project-ref ymliczohkmksptbxtpah

# Seed / refresh curriculum content (needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
node scripts/seed-content.mjs

# Validate content before seeding
node scripts/validate-content.mjs
```

Edge functions automatically receive `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
at runtime — no secrets to set for the current deterministic feature set.

---

## 2. Frontend — static SPA

Build output is plain static files in `dist/`. Any static host works; the only
requirement is an **SPA fallback** (serve `index.html` for unknown paths) so
client-side routes like `/dashboard` and `/learn/:code` survive refresh/direct links.

### Required environment variables (build-time, `VITE_`-prefixed)

| Var | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://ymliczohkmksptbxtpah.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the project anon key (public; safe in the bundle) |

Set these in the host's project settings (Vercel/Netlify env vars) — do NOT commit
`.env.local`.

### Vercel
`vercel.json` is included (build command, output dir, SPA rewrite). Import the repo,
add the two env vars, deploy. Zero extra config.

### Netlify
`netlify.toml` is included (build + SPA redirect). Connect the repo, add the two env
vars, deploy.

### GitHub Pages (project path)
Pages serves under `/<repo>/`, so set a base path before building:

```ts
// vite.config.ts
export default defineConfig({ base: '/trainingkit/', /* ...rest */ });
```

Then build and publish `dist/`, and add a `404.html` that is a copy of `index.html`
for SPA fallback. (Vercel/Netlify are simpler — prefer them unless Pages is required.)

### Manual / internal static host
```bash
npm run build      # -> dist/
# serve dist/ with index.html fallback for all routes
```

---

## 3. Smoke-check after deploy

1. Open the site → sign up with a new email → you should land on the track picker.
2. Pick a track → dashboard lists that track's modules.
3. Open a module → answer the quiz + exercise → "Complete lesson" → progress/badge
   updates. (This exercises the live edge functions end-to-end.)
