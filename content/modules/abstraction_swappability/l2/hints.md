# Abstraction & Swappability (L2) — Hints & Alternative Explanations

## Alternative phrasings of the deeper idea

- **Contract = shape + promises.** An interface is not just method names and types; it's also the *behaviour* every implementation must honour — consistency, failure modes, limits. Swappability that only matches the shape is an illusion.
- **The intersection cost.** Abstracting over N providers limits you to what *all N* support. The more providers you cover, the smaller and blander the contract becomes. Width of support trades against depth of capability.
- **Pay for change, not for hope.** Add a seam when you have a concrete second reason (a real second implementation or a real test need). Adding it "just in case" is buying insurance against an event that may never occur, at a cost you pay every day.

## Hint stack

- **H1 — Nudge.** Before swapping one implementation for another behind the "same" interface, ask: do they make the *same promises* about consistency, errors, and limits — or only have the same method names?
- **H2 — Direction.** List the behavioural assumptions callers silently rely on (can this never fail? is data shared or isolated? any size cap?). Promote those into the contract explicitly, so every adapter must honour them.
- **H3 — Mechanism.** If two implementations genuinely can't keep the same promises, you have a choice: widen callers to handle the weaker promise, or accept they aren't interchangeable and don't pretend otherwise. Don't let a matching signature hide a behavioural mismatch.

## FAQ

**Q: How do I know if an abstraction is "speculative generality"?**
A: Count the *real* implementations and *real* test needs. One implementation, no faking need, and no concrete second provider on the horizon usually means the seam is costing you without paying you back. Introduce it when the second reason becomes concrete, not before.

**Q: A new provider supports a feature my contract doesn't expose. What now?**
A: You've hit the lowest-common-denominator trap. Either widen the contract (and accept that other adapters must now emulate or reject the feature), or decide that provider's depth matters more than swappability and commit to it directly. Don't silently bolt a vendor-specific escape hatch onto a "generic" contract.

**Q: My two implementations have the same signatures but behave differently in production. Did I do something wrong?**
A: The abstraction leaked — the contract captured shape but not behaviour. Make the promises explicit (consistency, failure modes, limits), update callers to honour the weaker promise, and re-verify. A signature match is necessary but never sufficient for swappability.
