# Managing Long-Running Stateful Workflows — Hints & Alternative Explanations

## Alternative phrasings

- **The "save point" view:** A state machine is the rulebook for a process, and a
  checkpoint is a video-game save point. You don't replay the whole game from the
  start — you load the last save and continue. Resuming and hand-off are just
  *someone* loading that save.
- **The "current position" view:** At any moment the workflow is sitting on
  exactly one state, like a token on a board. Transitions are the only legal moves
  off that square. Checkpointing writes down which square the token is on so you
  can put it back later.
- **The "small note, not a diary" view:** Instead of keeping the whole story in
  memory, you keep one short note — the current state plus a little progress data.
  That note is enough to carry on, which is why the process never overflows its
  working memory.

## Hint stack

- **H1:** Every long-running process is *in* exactly one state at a time. What is
  the very first thing that has to happen before any other step can run?
- **H2:** A transition always goes *from* a known state *to* the next one, driven
  by an event. Trace the natural cause-and-effect chain: which state must already
  be true for the next transition to be legal?
- **H3:** Walk it forward in plain language — "first the work is *started*, which
  lets it be *processed*, which lets it be *checkpointed*, which lets it be
  *finished*." Order the steps so each one's *from*-state matches the previous
  step's *to*-state.

## FAQ

**Q: What's the difference between a state and a transition?**
A state is a named situation the process can rest in (*In Review*). A transition
is the rule that moves it from one state to another in response to an event
(*approve* moves *In Review* → *Approved*).

**Q: Why not just keep everything in memory until the workflow finishes?**
Because long processes get interrupted — crashes, restarts, deploys, people
going offline. Memory is lost on interruption; a saved checkpoint is not. It also
keeps memory use bounded no matter how long the process runs.

**Q: How much should a checkpoint contain?**
Just enough to resume: the current state plus any small progress data the next
step needs. It should not contain the entire history — that defeats the purpose
of keeping working memory bounded.

**Q: What is a hand-off?**
Loading a checkpoint on a *different* worker or by a *different* person and
continuing from there. Because the state is explicit and external, whoever picks
it up needs no other context.

**Q: What stops a workflow from reaching an invalid state?**
The state machine: only the transitions you define are allowed. If there is no
transition from *Draft* to *Approved*, that jump simply cannot happen.
