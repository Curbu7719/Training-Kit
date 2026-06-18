# Extensibility Seams — Hints & Alternative Explanations

## Alternative phrasings

- **The "stub-out" version:** A seam is a capped pipe in a wall. You leave it where a future need is likely and where retrofitting would mean tearing the wall open — not in every room "just in case."
- **The "plug socket" version:** A seam turns a soldered-in wire into a wall socket. New behavior plugs in without rewiring the house. But every socket costs money to install, so you only put them where something will probably be plugged in.
- **The "boundary" version:** Identify the boundary that future change will cross (a provider, a channel, a format). Put an interface at that boundary so new variants implement the interface instead of editing the callers.

## Hint stack

- **H1 (nudge):** Ask "what is most likely to change here, and how expensive would it be to retrofit a seam later?" High likelihood + high retrofit cost = add a seam now.
- **H2 (sharper):** A seam belongs at the boundary the change will cross. New payment provider → seam at the payment interface. New notification channel → seam at the notifier interface. Match the seam to the *axis of change*.
- **H3 (near-answer):** Don't add a seam for change that is unlikely or cheap to add later — that's YAGNI over-engineering. Spend your abstraction budget only where change is both probable and costly to retrofit.

## FAQ

**Q: How do I know where to put a seam?**
A: Look for the axis of likely change — the thing that will gain new variants (providers, formats, channels, rules). Put the seam at that boundary.

**Q: Isn't more flexibility always better?**
A: No. Each seam adds indirection and cognitive load. Too many seams make code harder to follow and change — the opposite of the goal. That's what YAGNI guards against.

**Q: What if I guess wrong about future change?**
A: Then you've paid for an unused seam, or you retrofit one later. Both have a cost, which is why the judgment is "likely and costly to retrofit," not "anything imaginable."

**Q: Seam vs. just refactoring later?**
A: Refactoring later is fine when retrofitting is cheap and local. A seam pays off specifically when the future change would otherwise ripple across many places.
