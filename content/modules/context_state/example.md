# Managing Long-Running Stateful Workflows — Worked Example

## A document approval workflow

Imagine a company where every expense report must be **submitted**, then
**reviewed**, then either **approved** or **rejected** before payment. This can
take days and pass through several people, so we model it as a state machine.

## The states and transitions

| From state | Event | To state |
|------------|----------------|------------|
| *Draft* | submit | *Submitted* |
| *Submitted* | start review | *In Review* |
| *In Review* | approve | *Approved* |
| *In Review* | reject | *Rejected* |

Notice what is *not* in the table: there is no transition from *Draft* straight
to *Approved*. The state machine makes that jump impossible, so a report can
never be paid without a review.

## Checkpointing and resuming

Each time the report changes state, the system saves a small checkpoint:

```
report_id: 4821
state: "In Review"
reviewer: "queue-finance"
updated_at: 2026-03-10T14:02Z
```

That is all anyone needs to continue. If the review server restarts overnight,
it reloads this checkpoint and the report is still safely *In Review* — no
progress lost. If the original reviewer is on holiday, a colleague reads the same
checkpoint and takes over: a clean **hand-off**.

## What we gained

The workflow is **durable** (a crash can't lose the report's place),
**resumable** (any worker continues from the checkpoint), and **bounded** (the
system only holds the tiny current-state record, not the full history). The
explicit transitions guarantee the process always follows the legal path.
