# Migration Planning (L2) — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The short version.** The thing that makes an incremental migration reversible is *compatibility*: old and new must coexist at every step. Expand–contract, the strangler-fig pattern, and feature flags are the tools that keep them compatible while you switch.
- **The "two-way door" framing.** Most migration steps should be two-way doors — you can walk back through them. Identify the few one-way doors (deleting the old store, dropping a column) and save them for last, after long verification.
- **The "renovate while occupied" framing.** You're remodelling a house people still live in. You can't shut off the water for a week. You add the new plumbing alongside the old, switch over room by room, and only remove the old pipes once nothing depends on them.

## Hint stack

- **Hint 1.** Ask what breaks if you had to roll back *right now*. The safe choice is the one where old and new still work together, so a rollback is harmless.
- **Hint 2.** Watch for irreversible steps performed too early. Dropping the old column, deleting the old store, or removing the old code path before the new one is verified turns an incremental plan into a one-way gamble.
- **Hint 3.** "Expand, then migrate, then contract" is the safe order for changing a shared contract. Adding the new shape alongside the old is safe; removing the old shape is the dangerous part and comes last. A correct reason names the compatibility or reversibility benefit, not a vague claim of speed.

## FAQ

**Q: How is expand–contract different from just dual-writing?**
A: Dual-writing is one technique used during the expand/migrate phases. Expand–contract is the wider discipline of changing a shared contract: add the new shape, migrate everyone to it, then remove the old shape — keeping both compatible in between.

**Q: Why are feature flags so important for rollback?**
A: Flipping a flag is near-instant and needs no deployment, so reverting to the old behaviour is fast and low-risk. Rolling back via a redeploy is slower and itself can fail.

**Q: What's the danger if new code writes data old code can't read?**
A: You lose the ability to roll back. Once the new system has written incompatible data, returning to the old version would break on that data. Backward compatibility is what preserves the exit.

**Q: How do I handle a dual-write where one write succeeds and the other fails?**
A: Don't assume both always succeed. Add reconciliation — periodically compare the two stores, log divergences, and converge them — so a partial failure is detected and repaired rather than silently corrupting data.
