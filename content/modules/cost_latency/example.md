# Worked Example: Tuning an AI PR-Reviewer in CI

A platform team ships an **AI code reviewer** that runs on every pull request and posts
inline comments. The first version sends each changed file *plus its whole parent module*
and the team's full style guide to a large model, then asks for a detailed prose review.

**Baseline per PR.**

| Part | Approx. tokens | Notes |
|---|---|---|
| Input (full files + style guide + diff) | 9,000 | Most files are unchanged context |
| Output (long prose review) | 1,500 | Restates code before each point |

With the large model at **$5 per million input tokens** and **$15 per million output
tokens**, one review costs roughly:

`(9,000 × $5 + 1,500 × $15) ÷ 1,000,000 = $0.045 + $0.0225 = $0.0675`

Across ~600 PRs/month that's about **$40**, and each review takes ~11 seconds — long
enough that developers tab away and lose flow waiting for the merge gate.

**Applying levers.** The team makes three changes:

1. **Trim context** — send only the changed hunks plus a few lines around them, not whole
   files, cutting input from 9,000 to **3,000 tokens**.
2. **Cache the prefix** — the style guide and review rubric are identical on every PR, so
   they prefix-cache it instead of re-sending it raw each time.
3. **Shorter output** — instruct for "top 5 issues as terse bullets," dropping output to
   **400 tokens**, and **stream** so comments appear as they're written.

**After tuning.**

`(3,000 × $5 + 400 × $15) ÷ 1,000,000 = $0.015 + $0.006 ≈ $0.021`

Cost per review drops from **$0.0675 to ~$0.021** (about 70% cheaper, before counting the
extra prefix-cache saving), and latency falls to roughly **4 seconds**, with the first
comment streaming in under a second.

**The trade-off check.** Terse bullets on changed hunks catch slightly fewer cross-file
issues than the full-context review. The team confirms that for routine PRs this is the
right balance, and keeps a heavier full-context pass — large model, whole module — for
release branches only. A deliberate, per-check point on the quality/cost/latency triangle.
