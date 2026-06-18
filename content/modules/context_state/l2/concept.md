# Managing Long-Running Stateful Workflows — Concept (L2)

L1 introduced states, transitions, checkpointing, and hand-off. At L2 we deal
with the hard part: keeping state **correct** when failures, retries, and
concurrency are the norm rather than the exception.

## Idempotency and the resume problem

When you resume from a checkpoint, you re-run the step that was interrupted — but
that step may have *already* taken effect before the crash (the email went out,
the row was inserted). A step is **idempotent** when running it twice has the
same effect as running it once. Make steps idempotent (e.g. "insert this order
*if it does not already exist*", keyed by a stable id) so that resuming after a
checkpoint is safe and never double-charges or double-sends.

## Where the checkpoint lives

A checkpoint is only useful if it outlives the thing that failed. That means
writing state to **durable, shared storage** (a database, a queue, a workflow
engine) — never to in-process memory or a single machine's local disk. The
durability boundary is what turns "resume" from a hope into a guarantee, and it
is what lets a *different* worker perform the hand-off.

## Concurrency and ownership

If two workers reload the same checkpoint, they can both advance the workflow and
corrupt it. Real systems add an **ownership** mechanism — a lease, a lock, or an
optimistic version number on the state record. A worker may only apply a
transition if it still holds the lease (or if the version it read still matches).
Transitions become **compare-and-set** operations: "move from *In Review* to
*Approved* **only if** the current state is still *In Review*." This rejects
stale or duplicate actors.

## Timeouts, retries, and dead states

Long workflows stall: a downstream service is down, a human never responds. Model
this explicitly. Add **timeout transitions** (after N hours in *In Review*,
transition to *Escalated*) and a **retry policy** with backoff for transient
failures. Define **terminal states** (*Done*, *Cancelled*, *Failed*) that have no
outgoing transitions, so the workflow has a clear, observable end. A state with
no path to any terminal state is a bug — the process can get stuck forever.

## Why it matters at L2

The naïve version works until the first crash mid-step, the first duplicate
worker, or the first stuck request. Idempotent steps, durable shared checkpoints,
ownership on transitions, and explicit timeouts are what make a stateful workflow
trustworthy under real-world failure — the difference between "usually correct"
and "correct".
