# Migration Planning (L2) — Concept

## Going deeper: managing risk during the switch

L1 introduced the safe shape of a migration: find the seams, run old and new side by side, move incrementally, keep a rollback. L2 is about the harder reality — the patterns and pitfalls that decide whether an incremental migration actually stays safe under production load.

## Patterns that make migrations safe

- **The strangler-fig pattern.** Rather than rewriting a system at once, you wrap it and redirect functionality piece by piece to the new implementation. The old system shrinks as the new one grows around it, like a strangler fig over a tree, until nothing of the old remains. Each redirected piece is small and independently reversible.
- **Expand–contract (parallel change).** When you must change a shared contract — a schema, an API — you don't change it in place. You *expand*: add the new shape alongside the old so both work at once. You *migrate* readers and writers to the new shape gradually. Only when nothing uses the old shape do you *contract* and remove it. This keeps old and new code compatible throughout, which is what lets you deploy and roll back independently.
- **Feature flags / kill switches.** Route traffic to old or new behind a flag you can flip instantly, without a deployment. This is what makes rollback fast: flipping a flag is faster and safer than redeploying.

## The hard parts

- **Backward and forward compatibility.** During the migration, old and new versions run *simultaneously*. New code must tolerate old-format data; old code must not choke on new fields. Break this and you can't roll back, because the new system has written data the old one can't read.
- **Data consistency.** Dual-writing can partially fail — one store succeeds, the other doesn't. You need reconciliation: compare the two, log divergences, and converge them, rather than assuming both writes always succeed.
- **The point of no return.** Some steps are genuinely irreversible (deleting the old store, dropping a column). Identify them in advance, do them last, and only after extended verification.

## Why it matters

The big-bang switch is tempting precisely because compatibility work is tedious. But that compatibility — old and new coexisting safely — is exactly what buys you reversibility. Skip it and "incremental" becomes a series of one-way doors.
