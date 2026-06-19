# Worked Example: Rebalancing a Six-Pilot AI Portfolio

You manage your organisation's AI portfolio. Budget for next quarter is fixed, and six
initiatives are competing for it. Here's how you rebalance instead of just renewing whatever
was funded last quarter.

## The six bets on the table

| Initiative | Stage | Value metric | Notes |
|---|---|---|---|
| Ticket-triage | Scaling | 91% routing, $0.008/ticket — proven | Real, sustained value |
| Sales-email drafter | Pilot | Real: 20% faster first drafts | Rebuilding its own eval + guardrails |
| Doc extractor | Pilot | Real: 30% less manual entry | Also rebuilding its own eval + guardrails |
| "AI insights" dashboard | Pilot | None — "10,000 prompts run" | Impressive demo, no business metric |
| Meeting summariser | Pilot | None defined | Built because a competitor has one |
| Claims assistant | Blocked | Promising | Stuck behind a compliance/PII gate |

## The decisions

**Kill the two vanity pilots.** The "AI insights" dashboard and the meeting summariser have no
value metric tied to money, time, risk, or quality — one reports prompt volume, the other was
started out of FOMO. You **stop both**. That isn't a failure; it frees the quarter's largest
chunk of budget. (Resisting "but we already built half of it" is the whole skill — that's the
sunk-cost trap.)

**Invest the freed budget in shared capability.** The sales-email drafter and the doc extractor
are *both* independently rebuilding the same plumbing: an eval harness, a PII/guardrail check,
and cost observability. Instead of funding that twice, you fund it **once** as a shared
platform. Both pilots adopt it, they ship faster, *and* every future initiative inherits it —
lowering the cost and risk of the whole portfolio. This is build-vs-buy at the portfolio level.

**Park, don't abandon, the blocked one.** The claims assistant is promising but stuck behind a
compliance gate. You don't fund delivery work yet; you fund only the work to clear the gate, and
keep it parked behind it. Prioritisation by *risk*, not just value.

**Fund the proven scaler.** Ticket-triage has sustained, measured value, so it gets the
resources to extend to more categories — the bet that earned its next stage.

## Reporting upward

At the steering committee you do **not** present "we ran 8 AI pilots." You present a portfolio
view: value delivered against each initiative's agreed metric, total spend and trend, adoption,
and the stage/risk mix. Two pilots killed is reported as a **positive** — budget recovered from
learning what wouldn't work — alongside the proven value of the scaler and the new shared
platform that makes the next pilots cheaper.

## The lesson

No new model was trained and no clever prompt was written — yet the portfolio got materially
healthier. The value came from **portfolio discipline**: killing vanity bets without sentiment,
refusing to fund the same capability twice, gating on risk as well as value, and reporting real
outcomes instead of activity. That's managing an AI portfolio.
