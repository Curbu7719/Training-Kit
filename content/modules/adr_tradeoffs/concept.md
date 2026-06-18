# Architecture Decisions & Trade-Offs — Concept

## The core idea

Every non-trivial system is built on a pile of decisions: which database, which queue, whether to cache, how to authenticate. Most of these decisions involve **trade-offs** — gaining one thing at the cost of another. There is rarely a "correct" option, only an option that is best *given your context*. An **Architecture Decision Record (ADR)** is a short document that captures one such decision and the reasoning behind it, so the choice survives longer than the memory of the person who made it.

A good ADR has four parts:

- **Context** — the situation and forces at play: requirements, constraints, what you already have.
- **Options** — the realistic alternatives you considered, described fairly.
- **Decision** — which option you chose, stated plainly.
- **Consequences** — what you gain, what you give up, and what becomes harder or easier as a result.

## A real-world analogy

Think of choosing where to live. You weigh rent, commute, space, and noise. A bigger flat further out is cheaper but adds an hour to your day; the central studio is pricey but convenient. There is no universally right answer — it depends on *your* situation. Six months later, when you wonder "why did we pick this place?", a note listing what you compared and why saves you from re-arguing the whole thing. An ADR is that note, for software.

## Why it matters

- **Honest comparison.** Writing options side by side forces you to admit the downsides of your favourite, not just sell its upsides.
- **Memory.** Teams forget *why* a choice was made. New members re-open settled debates, or fear changing something nobody understands. An ADR answers "why is it like this?".
- **Accountability without blame.** When circumstances change and a decision is revisited, the recorded context shows the choice was reasonable *then* — you are updating a decision, not assigning fault.

The discipline is simple: name the real options, state the trade-offs honestly, and write down why you chose what you chose.
