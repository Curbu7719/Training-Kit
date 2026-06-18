# Managing Long-Running Stateful Workflows — Worked Example (L2)

## A payment-capture workflow that survives failure

A checkout flow must **reserve** funds, then **capture** them, then **fulfil**
the order. Capturing money is the dangerous step: if we resume after a crash and
capture twice, we double-charge the customer. Here is how L2 techniques prevent
that.

## Idempotent steps with a stable key

Every capture call carries an **idempotency key** equal to the order id:

```
state: "Capturing"
order_id: 4821
idempotency_key: "order-4821-capture"
version: 7
```

The payment provider records that key. If the worker crashes *after* the provider
captured but *before* the checkpoint was saved, the resumed worker re-sends the
same key — and the provider returns the original result instead of charging
again. Re-running the step is safe.

## Ownership via a version number

The state record carries `version: 7`. To move *Capturing* → *Captured*, the
worker issues a compare-and-set:

> Set state to *Captured* and version to 8 **only if** version is still 7.

If a second, stale worker also reloaded version 7 and acts a moment later, its
update finds version is now 8 and is rejected. Only one worker can advance the
workflow.

## A timeout transition

If the provider is unreachable, the job retries with backoff. After 30 minutes
stuck in *Capturing*, a **timeout transition** moves it to *NeedsReview* — a
human queue — rather than silently hanging forever. *NeedsReview*, *Fulfilled*,
and *Refunded* are terminal or human-owned, so the workflow always has a defined
end.

## What we gained

Re-running after a crash never double-charges (**idempotency**); two workers
can't both advance the state (**ownership**); and a stuck capture escalates
instead of hanging (**timeout**). The workflow is correct *under failure*, not
just on the happy path.
