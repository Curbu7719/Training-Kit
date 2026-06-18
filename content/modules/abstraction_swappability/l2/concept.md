# Abstraction & Swappability (L2) — Trade-offs and Limits

L1 showed *how* to make implementations swappable. L2 is about *when the abstraction is worth it, where it leaks, and when it actively hurts.*

## Abstraction is not free

Every contract adds indirection: another layer to read through, another place a bug can hide, and a design you must keep stable as requirements move. The cost is justified by **expected change** or **a need to fake in tests**. If neither pressure exists, an interface with exactly one implementation that will never change is **speculative generality** — cost now for a benefit that never arrives. A good rule: introduce the seam when you have a *concrete second reason* (a real second provider, a real test need), not on the hope of one.

## Leaky abstractions

The promise of swappability holds only as far as the contract is honest about behaviour, not just shape. Two adapters can satisfy the same method signatures yet differ in ways callers feel:

- **Semantics.** One storage provider is strongly consistent; another is eventually consistent. Same `read()`/`write()` shape, very different correctness for the caller.
- **Failure modes.** One provider throws on a missing key; another returns null. Callers written against one will break on the other.
- **Performance & limits.** Rate limits, pagination sizes, maximum payloads, latency. These rarely fit in a method signature but absolutely change how callers must behave.

The lesson: a contract is the *signatures plus the promised behaviour*. Swappability is only as real as the weakest promise both adapters actually keep.

## The lowest-common-denominator trap

To keep two providers interchangeable, you can only expose what *both* support. Abstract over too many providers and the contract shrinks to a feature-poor intersection — you lose access to the one provider's killer feature precisely because the others lack it. Sometimes the right call is to **not** abstract, and instead commit to one provider's full capabilities deliberately.

## When NOT to swappable-ize

- The dependency is **stable and standardised** (a mature protocol you'll never replace).
- There is **exactly one** real implementation and no test-faking need.
- The abstraction would force the **LCD trap**, costing you a feature you actually need.
- It's a **throwaway / spike** — indirection slows you down with no payoff.

Abstraction is a tool for managing *change you expect*. Where change is unlikely and the seam is costly, coupling directly is the simpler, honest choice.
