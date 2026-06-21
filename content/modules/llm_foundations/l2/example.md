# Worked Example: Matching Models to a Dev Toolchain

Your team runs four AI call sites. Instead of pointing all of them at one model, you match each
to a model type and settings — then route the hard cases. Here's the reasoning.

## The four call sites

| Call site | Need | Model choice | Settings |
|---|---|---|---|
| Inline code completion | Instant, high-volume, routine | Small fast model | Small max-tokens, stop at block end |
| Automated PR reviewer | Solid quality, runs on every PR | Mid model + routing | Capped output; escalate large/complex diffs |
| Docs chat assistant | Grounded answers, interactive | Mid model + RAG | Streaming |
| "Reason about this design" | Rare, genuinely hard | Reasoning model | Higher token budget, no rush |

## Why these, not one model for all

**Completion** runs thousands of times a day; a reasoning model here would be slow and ruinously
expensive for no benefit — the task is routine. **PR review** is where routing pays: a small diff
goes to the mid model, but a sprawling refactor is escalated to a stronger one only when needed.
The **design helper** is the one place a reasoning model earns its cost — it's rare and the
problem is hard. Using *that* model everywhere would make completion unusable.

## Setting the output controls

For the reviewer you cap **max output tokens** so it returns the top issues, not an essay, and set
a **stop sequence** so completion ends cleanly at the code block. These keep output the right
length and shape without changing which model runs.

## The wrong way (and why)

A teammate proposes "just use the biggest, newest model everywhere — simplest." It looks simple
but: completion becomes slow and pricey, the PR bill climbs every sprint, and you still hit
hallucinations. Simplicity in config buys you cost and latency.

## The lesson

There is no "the AI" — there's a fleet. Matching **model type** (reasoning vs fast, small vs
large) and **output controls** (max-tokens, stop sequences) to each task, and **routing** only the
hard cases to a stronger model, is what keeps a toolchain fast, affordable, and consistent. That's
choosing and controlling models, not just calling one.
