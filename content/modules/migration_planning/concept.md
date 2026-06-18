# Migration Planning — Concept

## The core idea

Sooner or later you have to replace something central: a database, a payment provider, an authentication system, a whole platform. The naive way is a **big-bang switch** — turn off the old thing, turn on the new thing, hope it works. It rarely does, and when it fails you have no easy way back. **Migration planning** is the discipline of swapping out a core dependency *safely*: in small, reversible steps, keeping the system working the whole way through.

The safe pattern has a recognisable shape:

- **Understand and find the seams.** Learn what the old system does and locate the points where your code talks to it. The fewer and cleaner those points, the easier the swap.
- **Introduce an abstraction (if one isn't there).** Put a thin layer between your code and the dependency so you can change what's behind it without rewriting callers.
- **Run old and new side by side.** Make the new system reachable while the old one still serves real traffic. Often you write to both, or compare their outputs, before trusting the new one.
- **Migrate incrementally.** Move a slice of traffic or data, watch it, then move more — instead of everything at once.
- **Keep a rollback plan.** At every step you must be able to go back quickly if something breaks.

## A real-world analogy

Think of replacing a bridge that traffic still crosses every day. You don't demolish it on Monday and hope the new one appears by Friday. You build the new bridge alongside the old, divert a few lanes across to test it under real load, keep the old bridge open as a fallback, and only remove it once the new one has carried full traffic safely.

## Why it matters

Core dependencies are exactly the things you can't afford to break. A big-bang switch couples every possible failure into a single moment with no exit. Incremental migration spreads risk across many small, observable, reversible steps — so when something goes wrong, you notice early, affect few users, and can undo it. Slower on paper, far safer in practice.
