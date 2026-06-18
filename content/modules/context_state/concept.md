# Managing Long-Running Stateful Workflows — Concept

## What is a stateful workflow?

Some tasks finish in a single step. Many do not. Onboarding an employee,
processing a refund, or running a multi-stage data pipeline can span minutes,
days, or many separate requests. A **stateful workflow** is any process that
must remember *where it is* between steps so it can pick up where it left off.
Managing one well rests on three ideas:

- **State machine** — model the work as a set of named **states** (e.g.
  *Submitted*, *Approved*, *Shipped*) connected by **transitions**. A transition
  is a rule: "from *Submitted*, an approval moves you to *Approved*." Only the
  defined transitions are allowed, which keeps the process from reaching an
  impossible state.
- **Checkpointing** — periodically save the current state and just enough
  progress data so the work survives a crash, restart, or a long pause.
- **Resuming / hand-off** — reload the last checkpoint and continue, whether on
  the same machine, a different one, or by a different person. Because the saved
  state is small and explicit, the process never has to keep its entire history
  in working memory.

## A real-world analogy

Think of a board game you pause overnight. You don't memorise every past move —
you note **whose turn it is** and snap a photo of the board (the checkpoint).
Tomorrow, anyone can glance at the photo and continue. The rulebook says which
moves are legal from the current position (the transitions). The photo is small,
yet it captures everything needed to resume.

## Why it matters

Without explicit state, long processes are fragile: a crash loses progress, two
workers collide, and the process bloats as it tries to hold every detail in
memory at once. A clear state machine plus checkpoints makes the work
**durable** (survives failure), **resumable** (any worker can continue), and
**bounded** (it never overflows its working memory). The result is a process you
can trust to finish correctly even when the world interrupts it.
