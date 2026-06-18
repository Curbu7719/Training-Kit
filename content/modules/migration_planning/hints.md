# Migration Planning — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The short version.** Don't replace a core system in one risky flip. Run the new one alongside the old, move over in small reversible steps, and keep a way back at every stage.
- **The "moving house" framing.** You don't set fire to your old home before the new one is ready. You get the new place set up, move boxes over a few at a time, and keep the keys to the old place until you're sure everything works.
- **The "parachute" framing.** Every step of a migration should have a rollback — a parachute. If you can't get back to the last known-good state quickly, you're not migrating safely, you're gambling.

## Hint stack

- **Hint 1.** A safe migration is *incremental and reversible*. Look for an ordering where the system keeps working after every single step, not just at the end.
- **Hint 2.** Early steps reduce risk before any switch happens: understand the old system, find the seams, and put an abstraction in place. Verification and dual-running come before cutover, never after.
- **Hint 3.** The cutover is near the end, and it's gradual — a slice of traffic first, then more. Decommissioning the old system is the *last* step, only after the new one has proven itself. If a sequence retires the old system before verifying the new one, it's wrong.

## FAQ

**Q: Why not just do the switch in one well-tested deployment?**
A: No amount of testing reproduces real production load and data perfectly. A big-bang switch concentrates every possible failure into one moment with no exit. Incremental steps let you catch problems early, affecting few users, with rollback available.

**Q: What does "find the seams" mean?**
A: The seams are the points where your code touches the dependency. If access is scattered everywhere, route it through one thin layer first — then you have a single place to change.

**Q: Why write to both the old and new system for a while?**
A: Dual-writing keeps the new system's data current while the old one is still authoritative, so you can verify and compare before trusting the new one with reads.

**Q: When is it safe to delete the old system?**
A: Only after the new system has carried full real traffic reliably and you no longer need a fallback. Decommissioning is always the final step.
