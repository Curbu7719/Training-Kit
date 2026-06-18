# Composing Behavior from Layered Configuration — Hints & Alternative Explanations

## Alternative phrasings

- **The "stacked transparencies" view:** Imagine printing each layer on a clear
  sheet and stacking them. The base sheet is full; the override sheet has only a
  few values; the runtime sheet just one or two. Looking down through the stack,
  the topmost mark for each setting is the one you see — that's precedence.
- **The "defaults plus deltas" view:** The base holds complete defaults; every
  layer above lists only the **deltas** — what changes. You never re-state a value
  that's already correct below, you only override what differs.
- **The "config out of code" view:** Think of the program as a machine and the
  configuration as the dials on the outside. Layering lets you turn the dials per
  environment without opening the machine (editing and redeploying code).

## Hint stack

- **H1:** Read the layers from the **top down**. The highest layer that supplies a
  value for a setting is the one that wins.
- **H2:** A layer only needs to mention a setting if it wants to *change* it. If a
  setting is missing from a layer, the value falls through to the layer below.
- **H3:** Resolve one setting at a time: start at runtime — is there a value? If
  not, drop to the override; if still none, use the base default. The first value
  you hit on the way down is the answer.

## FAQ

**Q: Why three layers instead of one config file per environment?**
Because separate full files duplicate everything and drift apart. With layers,
shared defaults live once in the base, and each environment file holds only its
handful of differences — easier to read and far less error-prone.

**Q: What does "precedence" mean here?**
The rule for which layer wins when more than one sets the same value. The standard
order is runtime > override > base: the *last* (highest) layer to set a value
takes effect.

**Q: Why keep configuration separate from code at all?**
So behavior can change without changing the program. The same tested build runs
everywhere; you adjust a setting by editing config or injecting a value, not by
editing source and redeploying.

**Q: What is "runtime injection"?**
Supplying a value as the program starts or runs — commonly an environment
variable or an injected secret. It sits at the top of the stack, so it overrides
both the override files and the base.

**Q: Why is the base layer described as immutable?**
Because it is the stable foundation of safe defaults that doesn't change while the
program runs. All variation is expressed by layering *over* it, never by editing
it at runtime.
