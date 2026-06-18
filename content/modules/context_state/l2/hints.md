# Managing Long-Running Stateful Workflows — Hints & Alternative Explanations (L2)

## Alternative phrasings

- **The "safe to repeat" view:** Resuming means re-running the interrupted step,
  so every step must be safe to repeat. An idempotency key makes the second run a
  no-op that returns the first run's result — no double effect.
- **The "only one driver" view:** A checkpoint in shared storage can be read by
  many workers, but only one may *drive* the workflow forward at a time.
  Ownership (a lease or a version check) is the steering wheel that just one hand
  can hold.
- **The "no dead ends, no infinite waits" view:** Every state needs a path to a
  terminal state, and every wait needs a timeout. Otherwise a workflow can hang
  forever in a state nobody is watching.

## Hint stack

- **H1:** Ask what could go *wrong* in the scenario if the step ran twice, or if
  two workers acted at once. The right design choice is the one that closes that
  specific hole.
- **H2:** Match the symptom to the tool — *double effect on resume* → idempotency
  key; *two workers corrupting state* → ownership / compare-and-set; *stuck
  forever* → timeout transition; *lost on restart* → durable shared checkpoint.
- **H3:** For the *reason*, prefer the option that names the underlying guarantee
  (e.g. "because re-running with the same key yields the same result") over one
  that merely restates the action or claims a side benefit like speed.

## FAQ

**Q: Why must steps be idempotent if I already checkpoint after every step?**
Because the crash can happen *between* the step taking effect and the checkpoint
being written. On resume you re-run a step that already happened. Idempotency
makes that repeat harmless.

**Q: Isn't a lock the same as a version number?**
Both enforce single ownership. A **lease/lock** is pessimistic — you hold it
while you work. A **version number** is optimistic — you act, then commit only if
the version is unchanged. Optimistic checks avoid holding a lock during slow
external calls but must handle rejection by retrying.

**Q: Why not store the checkpoint in memory for speed?**
Because memory dies with the process. A checkpoint must survive the failure it is
meant to protect against, so it has to live in durable, shared storage.

**Q: What makes a state machine "stuck"?**
A state with no transition (including no timeout) that leads toward a terminal
state. The workflow sits there forever. Every non-terminal state should have a
way out — success, failure, or escalation.

**Q: What's the role of a terminal state?**
It marks a defined end (*Done*, *Cancelled*, *Failed*) with no outgoing
transitions, so the system can observe that the workflow is finished and stop
tracking it.
