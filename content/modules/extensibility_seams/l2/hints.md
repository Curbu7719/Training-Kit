# Extensibility Seams — Deeper Hints (L2)

## Alternative phrasings

- **The "axis vs. boundary" version:** Boundaries are everywhere; axes of change are rare. Spend seams only along an axis where you can name two or three concrete future variants.
- **The "right tool" version:** Swapping whole implementations → interface. Varying by environment → config/flag. Letting unknown parties react → event/hook. Letting outside parties extend → plugin registry. Mismatch the tool and you reintroduce the very edits the seam was meant to prevent.
- **The "stable contract" version:** A seam is a promise. Once callers depend on its shape, changing that shape is itself a breaking change — so a premature or wrong-shaped seam can be costlier than no seam.

## Hint stack

- **H1 (nudge):** First ask *what kind* of change this is — swap an implementation, vary by environment, or let others react? The kind determines the mechanism.
- **H2 (sharper):** Can you name two or three concrete future variants? If yes, it's a real axis — pick the matching mechanism. If no, defer (YAGNI); a speculative seam locks in a guessed contract.
- **H3 (near-answer):** Implementation swap → interface/strategy. Per-environment variation → config/flag. Unknown future reactors → event/hook. Outside-the-release extenders → plugin registry. Don't force one mechanism to cover changes of different kinds.

## FAQ

**Q: Why is choosing the wrong seam mechanism worse than no seam?**
A: A wrong mechanism still forces edits to the core when change arrives (e.g., a config flag where you needed a plugin registry), so you pay the seam's carrying cost without getting containment.

**Q: How does a premature seam "lock in" an abstraction?**
A: Once callers depend on its interface, reshaping that interface is a breaking change across every caller — you've committed to a guess before you had evidence.

**Q: How do I weigh extensibility against YAGNI at this level?**
A: Estimate expected change value (likelihood × retrofit cost saved) against carrying cost (indirection, contract stability, testing). Add the seam only when value exceeds cost; otherwise defer and be ready to retrofit.

**Q: Events vs. interfaces — quick rule?**
A: Use an interface when the core *needs a result* from one chosen implementation. Use an event when the core *announces* something and any number of unknown parties may react.
