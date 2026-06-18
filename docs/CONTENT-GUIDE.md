# TrainingKit — Content Authoring Guide

**Audience:** Content authors and the `scripts/seed-content.mjs` seeder.

---

## Folder Convention

Each module lives under `content/modules/<module_code>/` where `<module_code>` is the
exact value in the `modules.code` column (e.g. `layered_architecture`).

```
content/modules/<module_code>/
├── concept.md      — plain-language explanation (lesson kind: concept)
├── example.md      — one worked example (lesson kind: example)
├── hints.md        — alternative phrasings, hint stack, FAQ (lesson kind: concept, merged)
├── quiz.json       — array of quiz questions (lesson kind: quiz)
└── exercise.json   — one exercise object (lesson kind: exercise)
```

The seeder maps each file to one `lessons` row and populates `quiz_questions` /
`exercises` from the JSON files. Markdown files go into `lessons.body_md`.

---

## File Purposes

| File | DB target | Notes |
|---|---|---|
| `concept.md` | `lessons` row, `kind='concept'` | Short, plain-language. Aim for 200-400 words. |
| `example.md` | `lessons` row, `kind='example'` | One concrete, generic scenario. Keep it role-neutral. |
| `hints.md` | Appended to the concept lesson | 2-3 alternative phrasings + hint stack (H1/H2/H3) + FAQ. |
| `quiz.json` | `quiz_questions` rows (one per array element) | 3-5 questions per module. See schema below. |
| `exercise.json` | `exercises` row | One exercise per module at each level. See schemas below. |

---

## quiz.json Schema

An array of question objects. The `correct` field is loaded into `quiz_questions.correct`
and is **never exposed to the client** (column-level REVOKE — see migration 0001).

```json
[
  {
    "prompt": "Question text visible to the learner.",
    "choices": ["Option A", "Option B", "Option C", "Option D"],
    "correct": [1],
    "points": 1
  }
]
```

- `choices` — array of strings, displayed in order.
- `correct` — array of zero-based indexes into `choices`. Single-answer: one element.
  Multi-select: multiple elements.
- `points` — integer; contributes to module pass threshold (≥70% required).

---

## exercise.json Schema (all 5 types)

The top-level shape is always:

```json
{
  "type": "<exercise_type>",
  "prompt_md": "Markdown-formatted instruction visible to the learner.",
  "spec": { ... },
  "answer_key": { ... },
  "max_score": 10
}
```

`spec` and `answer_key` are type-specific. `answer_key` is stored in
`exercises.answer_key` and is **never exposed to the client**.

### mcq — Multiple Choice (single or multi-select)

```json
{
  "type": "mcq",
  "prompt_md": "Which two options describe a BaaS responsibility?",
  "spec": {
    "choices": ["Auth management", "UI rendering", "Row-level security", "CSS styling"],
    "multi": true
  },
  "answer_key": { "correct": [0, 2] },
  "max_score": 10
}
```

- `spec.multi` — `true` for multi-select, `false`/omitted for single-answer.
- `answer_key.correct` — zero-based indexes of correct choices.

### order — Ordering / Sequencing

```json
{
  "type": "order",
  "prompt_md": "Arrange the request lifecycle steps in the correct order.",
  "spec": {
    "items": ["Step A", "Step B", "Step C", "Step D"]
  },
  "answer_key": { "order": [2, 0, 3, 1] },
  "max_score": 10
}
```

- `spec.items` — the items shown to the learner in shuffled display order.
- `answer_key.order` — array of indexes representing the correct sequence
  (position 0 = first in correct order, etc.).

### match — Matching (concept ↔ definition)

```json
{
  "type": "match",
  "prompt_md": "Match each term to its correct definition.",
  "spec": {
    "left":  ["Client layer", "BaaS layer", "Serverless function"],
    "right": ["Runs in the browser", "Manages auth and DB", "Executes short-lived server logic"]
  },
  "answer_key": { "pairs": [[0, 0], [1, 1], [2, 2]] },
  "max_score": 10
}
```

- `spec.left` / `spec.right` — items on each side (right side is shuffled for display).
- `answer_key.pairs` — array of `[left_index, right_index]` correct pairs.

### fill — Fill-in-the-Blank

```json
{
  "type": "fill",
  "prompt_md": "Complete the sentence: Row-level security is enforced at the ___ layer.",
  "spec": {
    "blanks": 1,
    "keywords": [["database", "baas", "postgres"]]
  },
  "answer_key": { "accept": [["database", "baas", "postgres"]] },
  "max_score": 10
}
```

- `spec.blanks` — number of blanks (one `keywords` array per blank).
- `spec.keywords` — acceptable keyword sets per blank (any keyword in the set is correct).
- `answer_key.accept` — mirrors `spec.keywords`; grading checks lowercase match against
  any entry in each set.

### scenario — Best-Trade-Off Scenario (two linked MCQs)

```json
{
  "type": "scenario",
  "prompt_md": "A team needs to add a payment API key to their app. Given the layered architecture, where should the key live?",
  "spec": {
    "decision_choices": [
      "Hard-code in the React component",
      "Store in a serverless function environment variable",
      "Write to the browser's localStorage",
      "Embed in the CDN configuration"
    ],
    "reason_choices": [
      "Because the client layer never executes server code",
      "Because localStorage is encrypted by default",
      "Because CDNs cache secrets efficiently",
      "Because React components are minified"
    ]
  },
  "answer_key": {
    "decision": 1,
    "reason": 0
  },
  "max_score": 10
}
```

- The learner must pick both the correct decision AND the correct reason to earn full marks.
- Partial scoring (decision only): award `max_score / 2`.
- `answer_key.decision` / `answer_key.reason` — zero-based indexes.

---

## Levels & the `l2/` folder

Each lesson carries a `level` (`L1` | `L2`, column on `lessons`). The same module is
taught at different depths to different roles (see the matrix in DESIGN.md §2.1):

- A user enrolled in a module at **L1** sees only its **L1** lessons.
- A user enrolled at **L2** sees **L1 + L2** lessons (cumulative — L2 builds on L1).

Authoring convention:

- Files at the module root (`content/modules/<code>/*`) → **L1** lessons/quiz/exercise.
- Optional `content/modules/<code>/l2/` subfolder, mirroring the same file names
  (`concept.md`, `example.md`, `hints.md`, `quiz.json`, `exercise.json`) → **L2** content.
  Author an `l2/` folder only for modules that appear at L2 in the matrix.

The seeder sets `lessons.level='L1'` for root files and `'L2'` for files under `l2/`.
Quiz/exercise rows inherit their level from their parent lesson.

Grading for an L1 user is computed over L1 items only; for an L2 user, over L1 + L2 items.

## Grading Thresholds

- **Pass threshold:** ≥70% of combined quiz + exercise points for the module at that level.
- **Level lock:** L2 unlocks only after L1 is passed (enforced in app logic by
  `/progress` edge function — no schema change needed).

---

## scripts/seed-content.mjs — Mapping Contract

The seeder expects the following environment variables:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

For each directory under `content/modules/<code>/`:

1. Look up `modules.id` by `code`.
2. Upsert a `lessons` row for each markdown file (`concept.md` → `kind='concept'`,
   `example.md` → `kind='example'`; `hints.md` is appended to the concept lesson's
   `body_md` separated by `\n\n---\n\n`).
3. Parse `quiz.json` and upsert one `quiz_questions` row per element (including `correct`
   via service-role client).
4. Parse `exercise.json` and upsert one `exercises` row (including `answer_key` via
   service-role client).

Re-running the seeder is idempotent — it upserts by `(module_id, kind)` for lessons and
by `lesson_id` index for quiz/exercise rows.
