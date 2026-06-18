# Worked Example: Hardening and Rolling Out a Model Upgrade

An established support assistant runs on "Model A" through an orchestration layer. The
team wants to upgrade to a newer, cheaper "Model B" without risking a quality regression
or an outage. The L1 architecture is in place; now they harden it.

**Step 1 — Make the provider truly swappable.** The orchestrator already calls an
internal `answer()` interface, but Model A's SDK details have leaked into a few spots.
They clean this up so the interface returns a uniform result (text, token usage,
normalized error type). Now selecting A or B is a single config value.

**Step 2 — Add reliability around the call.** They wrap `answer()` with:

- a **timeout** (fail fast instead of hanging the user),
- **retry with backoff** on transient errors, capped at 2 attempts to bound cost/latency,
- a **circuit breaker** that, after repeated failures, stops calling the provider for a
  short window and serves a **degraded** "please retry shortly" message.

**Step 3 — Evaluate offline before any user sees Model B.** They run a fixed **eval set**
of 200 real questions with known-good answers through both models and compare
groundedness (does the answer cite a retrieved passage?), refusal rate, and cost.
Model B matches quality at ~40% lower cost — but they spot it occasionally drops
citations, so they tighten the **output guardrail** to reject uncited answers.

**Step 4 — Shadow run.** For a week, every live request still goes to Model A (the user
sees A's answer), but a copy is sent to Model B and logged. Comparing logs confirms B
behaves well on real traffic, not just the eval set.

**Step 5 — Gradual rollout behind a flag.** They flip a feature flag to route **5%** of
traffic to Model B, watch the observability dashboards (groundedness, latency, error
rate), then expand to 25%, 50%, and finally 100%. A regression at any step is a one-line
**rollback**: flip the flag back to Model A.

**Why this works.** Every risky change is reversible and observable. The provider
abstraction made the swap a config change; reliability patterns contained provider
failures; offline eval plus a shadow run caught quality issues before users did; and the
flagged, gradual rollout kept the blast radius small with an instant rollback path.
