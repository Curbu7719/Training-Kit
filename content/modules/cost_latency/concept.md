# Cost, Latency & Performance

Running a large language model (LLM) is not free and not instant. Two practical
numbers shape almost every design decision: **how much a request costs** and **how
long it takes to answer**. Understanding what drives each lets you tune a feature
instead of guessing — and this matters most when the AI sits inside your own software
delivery lifecycle, where it runs on every commit.

**An SDLC example.** A team adds an **AI code reviewer** that runs in CI on every pull
request, leaving inline comments. It is invoked dozens of times a day across the team.
If each run sends the whole diff plus thousands of lines of surrounding files to a large
model and waits 30 seconds, two things break: the CI bill climbs every sprint, and
developers wait on a slow check before they can merge. The same levers that tune any LLM
feature decide whether this reviewer is a help or a tax.

**Cost.** LLM usage is billed per token, so a useful mental model is
**cost ≈ tokens × per-token price**. Providers charge **separately for input tokens**
(the diff, instructions, retrieved code) **and output tokens** (the review comments),
and output is usually more expensive per token.

**Latency.** This is the wait before and during the response. Main drivers: **model
size** (bigger reasons better but answers slower), **output length** (one token at a
time), **network round-trips**, and any **extra pipeline steps** — fetching files,
linter calls, multi-step chains.

**Optimization levers.**

- **Prompt caching** — reuse a stable prefix (the review rubric, coding standards) so
  you don't re-pay to process it on every PR.
- **Shorter outputs** — ask for only the top issues, not an essay; output dominates cost and time.
- **Model routing** — a tiny diff goes to a small cheap model; a sprawling refactor goes to a large one.
- **Trimming context** — send the changed hunks, not the whole repository.
- **Streaming** — surface comments as they arrive so the check *feels* fast.

**The trade-off triangle.** Quality, cost, and latency pull against each other. A bigger
model catches more bugs but costs more and is slower; aggressive trimming is cheap and
fast but can miss issues. Good engineering picks the balance per check, not one global
setting.

## How each role uses this

- **Developer/Engineer:** Instruments tokens and response time on each CI assistant call,
  then applies caching, output caps, and routing to keep the PR check fast and in budget.
- **Business Analyst:** Models the monthly AI-tooling spend from PR volume and input vs.
  output token mix, flagging when a slow check would stall the team's merge workflow.
- **PM/Product Owner:** Owns the AI-tooling budget and sets the quality/cost/latency
  balance — e.g. accepting a smaller model on routine PRs to fund a larger one on releases.
- **QA & Architect:** Sets latency SLOs for the pipeline check, tests it under peak commit
  load, and designs the caching/routing so the assistant stays within cost and time targets.
