# Delivering Software in an AI-Driven SDLC

When the software development lifecycle itself becomes **AI-driven**, developers work next to AI
coding assistants and agents. (The software development lifecycle, or SDLC, is the whole process of
planning, building, testing, and shipping software.) These tools generate a large share of the
code, draft tests, and do first-pass reviews. This is not a small speed boost — it changes the
*shape* of delivery. A manager who runs an AI-driven team the same way they ran a hand-coded one
gets surprised in predictable ways.

**A running example.** Your team is building and extending an internal **expense-management app**,
and everyone now works with an AI coding assistant. It scaffolds endpoints, writes components,
drafts tests, and suggests refactors. As the delivery lead, you can't just assume "AI writes the
code, so we're 3× faster — ship the date 3× sooner." You have to manage a workflow whose
**bottlenecks** have *moved*. (A bottleneck is the slowest step that holds up everything else.)

## The bottleneck moves from writing to specifying and verifying

When AI produces code in seconds, **typing code is no longer the slow part**. The new slow parts
are **clear intent** (saying exactly what you actually want), **review** (judging whether the
output is correct, secure, and fits the system), and **verification** (proving it works). How fast
you deliver now depends on how fast humans can specify and trust the output — not on how fast code
appears on screen.

## Estimation changes shape — beware the last 10%

AI makes new, from-scratch work and routine boilerplate much faster, so estimates for "get
something working" shrink. But the **last 10%** — edge cases, fitting into the existing system, and
debugging the looks-right-but-wrong code the model produced with confidence — does *not* shrink at
the same rate. (An edge case is a rare or extreme situation, like an empty list or a huge number.)
The classic trap is **"90% done in a day, the last 10% takes a week."** Estimate the review,
integration, and verification work on its own. Don't price the whole project as evenly faster just
because generation got faster.

## Quality gates get more important, not less

A fast stream of plausible code raises the stakes on review. AI output is often **subtly wrong** —
a hallucinated API, an insecure pattern, a missed edge case — while it looks completely confident.
(To hallucinate means the AI confidently makes something up; an API is the set of functions one
program uses to talk to another.) So the **definition of done shifts**: human review of generated
code, strong automated tests, type checks, and security scanning become the gates that make AI
speed *safe*. (A quality gate is a check that code must pass before it moves on.) The developer's
role moves from **author to reviewer / editor / verifier**, and a human stays accountable for
whatever merges.

## Risks specific to AI-driven delivery

- **Automation bias / over-trust** — accepting plausible code without real review because it looks
  right and arrived fast.
- **Security & correctness of generated code** — unsafe patterns, outdated or made-up dependencies,
  and quiet logic bugs the author never thought through.
- **IP & licensing** — generated code can copy licensed source; where it came from and whether it
  is allowed both matter. (IP means intellectual property — who legally owns the code.)
- **Architectural drift** — each suggestion makes sense on its own, but the codebase grows
  inconsistent without enforced patterns. (Drift means slowly moving away from a consistent design.)
- **Skill atrophy & ownership** — "who actually understands this code?" becomes a real
  maintainability risk. (Atrophy means a skill fading from lack of use.)

## Measure real throughput, not output

The most common mistake is celebrating **output** — lines of code, number of PRs, "AI adoption %."
These are vanity numbers: AI inflates them with no effort. What matters is **real delivery**: cycle
time, defect-escape rate, change-failure rate, and working value shipped. (Cycle time is how long
work takes from start to done; defect-escape rate is how many bugs reach users.) A team can 3× its
code volume and ship no faster if review and rework become the new bottleneck.

## How each role uses this

- **Project Manager:** Tracks the project, builds the plan, and finds and owns the risks —
  estimating the review/integration/verification work (not just the fast generation), planning for
  the last-10% trap, and tracking cycle time and defect escape instead of raw output.
- **Portfolio Manager:** Sizes incoming demands with the tech team, orders them across teams by
  company priority, and builds the roadmap — folding in the real economics of AI-driven delivery
  (often cheaper to start, but costlier to finish) when estimating.
- **Release Manager:** Owns the test environments and plans the release of work that depends on each
  other, so AI-generated changes clear review and test gates before they ship.
- **Developer:** Shifts from writing every line to specifying intent, reviewing and verifying AI
  output, and owning correctness, security, and tests for what merges.
- **Solution Designer:** Designs the feature and joins the high-level estimation/cost work, turning a request
  into clear intent the team — and its AI assistants — can build against.
- **Tester & Enterprise Architect:** Set the quality gates (review, tests, security/type checks) and
  the enforced patterns that keep AI-generated code correct, secure, and consistent across the system.
