# Worked Example: A Forced Model Migration (and a Cost Scare Along the Way)

Your **AI support assistant** has run smoothly for months. Then two operational realities hit
that have nothing to do with writing new features — they're pure ops.

## Part 1 — The provider deprecates your model

An email arrives: the model version you **pinned** will be **retired in 30 days**. You must
migrate to the new version or the feature breaks. You don't trust "it's basically the same
model" — the same prompt can behave differently, and a silent quality drop would erode customer
trust. So you run a disciplined migration instead of a hopeful swap.

1. **Shadow.** You send a **copy** of real production traffic to the new model in parallel with
   the live one, serving only the old model's answers to users. For each, you log both outputs,
   tokens, and latency. You also run the new version against your **offline eval set** — including
   the cases distilled from past incidents.
2. **Compare.** The numbers come in: groundedness is equal, latency is ~10% better, **but cost
   per answer is up 20%** because the new version is more verbose. You tighten the output
   instruction to claw most of that back, and re-shadow.
3. **Canary.** You route **5%** of live traffic to the new model behind the `assistant_model`
   flag, and watch the online monitors (refusal rate, thumbs-down, p95) for a day. Stable.
4. **Roll out — with rollback ready.** You move to 100%. The flag stays in place so that if a
   subtle regression surfaces, a single flip reverts to the old version (still available for the
   rest of the deprecation window).

No customer noticed the migration. That's the goal: a model change underneath the feature, made
**boring** by shadow → canary → flagged rollout.

## Part 2 — The 2 a.m. cost anomaly

A week later, the **cost-anomaly alert** fires: spend is running **4× the trend**. Not a fixed
threshold — the anomaly detector caught a deviation from the normal curve. The on-call pulls up
the **cost-by-feature** breakdown and sees it isn't the assistant at all: a new internal
batch job re-summarizing the entire knowledge base got stuck in a **retry loop**, each failure
re-sending a huge prompt.

The **hard cap** has already done its job — it throttled the batch job's spend once it crossed
the ceiling, so the bill is bounded while a human investigates. The runbook: identify the
runaway call in the trace (the retry loop), cap its retries, and requeue. Because cost was
**attributed per feature**, finding the culprit took minutes, not a finance review next month.

## The lesson

Neither event was about model quality or new functionality. The feature stayed healthy because
it was **operated**: a deprecation became a measured shadow/canary migration with a rollback
flag, and a cost runaway was **caught by an anomaly alert, bounded by a hard cap, and traced to
its source by per-feature attribution**. At scale, the model and the bill both change on their
own — operating AI means having the machinery to absorb that without a customer ever noticing.
