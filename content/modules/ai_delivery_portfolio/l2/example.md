# Worked Example: Rebalancing an AI-Driven Engineering Portfolio

You manage the engineering portfolio. Every team now builds with AI coding assistants, budget
for next quarter is fixed, and six initiatives compete for it. Here's how you rebalance instead
of just renewing whatever was funded last quarter.

## The six bets on the table

| Initiative | Stage | Signal | Notes |
|---|---|---|---|
| Payments refactor | Shipping | Cycle time down 40%, defect-escape flat — real | Sustained, measured improvement |
| Mobile team's AI workflow | Active | Real: faster reviews | Built its own pattern + secure-scan setup |
| Web team's AI workflow | Active | Real: faster reviews | Independently built the same setup |
| "AI velocity" dashboard | Active | None — "2× lines generated" | Impressive number, no delivery improvement |
| Greenfield internal tool | Active | None defined | Started because the assistant made it easy |
| Compliance-gated service | Blocked | Promising | Generated code stuck behind a license/IP review |

## The decisions

**Kill the vanity bet.** The "AI velocity" dashboard reports lines generated and adoption % — pure
activity, with no movement in cycle time, defect rate, or value. You **stop it**. And the
greenfield tool was started only *because the assistant made starting cheap*, with no value case —
you stop that too. Cheap to build is not a reason to finish; resisting "but the AI already wrote
most of it" is the whole skill (the sunk-cost trap in AI-driven clothing).

**Invest the freed budget in shared capability.** The mobile and web teams are *both*
independently building the same plumbing: assistant config, golden patterns, secure scanning of
generated code, and review automation. Instead of funding that twice, you fund it **once** as a
shared platform both teams adopt. They ship faster *and* more consistently, and every future
team inherits it — lowering the cost and risk of the whole portfolio. Build-vs-buy at the
portfolio level.

**Park, don't abandon, the blocked one.** The compliance-gated service is promising but stuck
behind a license/IP review of its generated code. You don't fund delivery yet; you fund only the
work to clear the gate, and keep it parked. Prioritisation by *risk*, not just value.

**Fund the proven one.** The payments refactor has sustained, measured improvement in cycle time
with defect-escape held flat, so it gets resources to extend — the bet that earned its next
stage.

## Reporting upward

At the steering committee you do **not** present "our teams generated 2× the code with AI." You
present a portfolio view on **real delivery**: cycle time and lead time, change-failure and
defect-escape rates, and value delivered against each initiative's agreed outcome. Two
initiatives killed is reported as a **positive** — budget recovered from activity that wasn't
moving outcomes — alongside the proven payments win and the new shared platform that makes every
team faster and safer.

## The lesson

No new model was adopted and no clever prompt was written — yet the portfolio got materially
healthier. The value came from **portfolio discipline in an AI-driven org**: killing vanity bets
without sentiment, refusing to fund the same AI workflow twice, gating on risk as well as value,
and reporting real throughput instead of generated-code activity. That's managing a portfolio
when development is AI-driven.
