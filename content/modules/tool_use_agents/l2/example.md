# Worked Example: Hardening a Refund Agent

A team builds an agent that processes refund requests. The naive version has one tool, `do_refund(order_id, amount)`, a max of 10 iterations, and a prompt saying "only refund valid orders." In testing it works. In production it fails in instructive ways — and the fixes are all L2 concerns.

**Failure 1 — uninterpretable results.** `lookup_order` returns a raw HTTP `500` when the order service is briefly down. The model can't tell a *missing* order from a *temporary outage*, so it assumes the order is invalid and refuses a legitimate refund.

*Fix — interpretable, typed results.* The tool now returns `{"status": "unavailable", "retryable": true}` versus `{"status": "not_found", "retryable": false}`. The model retries the first and stops on the second.

**Failure 2 — a spinning loop.** When the service stays down, the model calls `lookup_order` with identical arguments ten times, hits the iteration cap, and gives up after burning ten model calls.

*Fix — non-progress detection.* The loop detects the same tool + same arguments repeated and a `retryable` error, applies **backoff**, and after two failed retries reports "service unavailable, please try later" instead of spinning to the cap.

**Failure 3 — an irreversible action behind only a prompt.** The prompt said "only refund valid orders," but a malformed request convinced the model to refund \$5,000 to the wrong account. The prompt was the *only* guard, and the model overrode it.

*Fix — an architectural approval gate.* `do_refund` over a threshold now requires **human approval** before execution — enforced in the application, not the prompt. The model can *request* the refund; a person must confirm large ones. A boundary can't be talked out of.

**Failure 4 — a black-box failure.** When a refund went wrong, the team had no record of what the agent did.

*Fix — observability.* Every iteration now logs the plan, the tool requested, its arguments, and the observation, so any run can be replayed and traced.

**The through-line:** the L1 loop was correct; reliability came from **tool design, loop control, architectural guardrails, and observability** layered on top. Autonomy is only safe when it's bounded by structure the model cannot bypass.
