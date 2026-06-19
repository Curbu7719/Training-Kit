# Delivering Software in an AI-Driven SDLC

When the software development lifecycle itself becomes **AI-driven**, developers work alongside
AI coding assistants and agents that generate a large share of the code, draft tests, and do
first-pass reviews. This is not a small productivity tweak — it changes the *shape* of delivery,
and a manager who runs an AI-driven team the same way they ran a hand-coded one gets surprised
in predictable ways.

**A running example.** Your team is building and extending an internal **expense-management
app**, and everyone now works with an AI coding assistant. It scaffolds endpoints, writes
components, drafts tests, and proposes refactors. As the delivery lead you can't just assume
"AI writes the code, so we're 3× faster — ship the date 3× sooner." You have to manage a
workflow whose bottlenecks have *moved*.

## The bottleneck moves from writing to specifying and verifying

When AI produces code in seconds, **typing code is no longer the constraint**. The new
constraints are **clear intent** (specifying precisely what you actually want), **review**
(judging whether the output is correct, secure, and fits the system), and **verification**
(proving it works). Throughput is now gated by how fast humans can specify and trust the
output — not by how fast code appears on screen.

## Estimation changes shape — beware the last 10%

AI makes greenfield and boilerplate work dramatically faster, so estimates for "get something
working" shrink. But the **last 10%** — edge cases, integration with the existing system, and
debugging the plausible-but-wrong code the model produced confidently — does *not* shrink at the
same rate. The classic trap is **"90% done in a day, the last 10% takes a week."** Estimate the
review, integration, and verification work explicitly; don't price the whole project as
uniformly faster just because generation got faster.

## Quality gates get more important, not less

A fast stream of plausible code raises the stakes on review. AI output is often **subtly wrong**
— a hallucinated API, an insecure pattern, a missed edge case — while looking completely
confident. So the **definition of done shifts**: human review of generated code, strong
automated tests, type checks, and security scanning become the gates that make AI speed *safe*.
The developer's role moves from **author to reviewer / editor / verifier**, and a human stays
accountable for whatever merges.

## Risks specific to AI-driven delivery

- **Automation bias / over-trust** — accepting plausible code without genuine review because it
  looks right and arrived fast.
- **Security & correctness of generated code** — vulnerable patterns, outdated or hallucinated
  dependencies, subtle logic bugs the author never reasoned through.
- **IP & licensing** — generated code can echo licensed source; provenance and compliance matter.
- **Architectural drift** — each suggestion is locally reasonable, but the codebase grows
  inconsistent without enforced patterns.
- **Skill atrophy & ownership** — "who actually understands this code?" becomes a real
  maintainability risk.

## Measure real throughput, not output

The most common mistake is celebrating **output** — lines of code, number of PRs, "AI
adoption %." These are vanity: AI inflates them effortlessly. What matters is **real delivery**:
cycle time, defect-escape rate, change-failure rate, and working value shipped. A team can 3×
its code volume and ship no faster if review and rework become the new bottleneck.

## How each role uses this

- **Developer/Engineer:** Shifts from writing every line to specifying intent, reviewing and
  verifying AI output, and owning correctness, security, and tests for what merges.
- **Business Analyst:** Writes intent and acceptance clearly enough that AI-assisted work targets
  the right outcome, and helps separate real delivery from output vanity.
- **PM/Product Owner:** Estimates the review/integration/verification work (not just generation),
  plans for the last-10% trap, and tracks cycle time and defect escape rather than raw output.
- **QA & Architect:** Designs the quality gates (review, tests, security/type checks) and the
  enforced patterns that keep AI-generated code correct, secure, and architecturally consistent.
