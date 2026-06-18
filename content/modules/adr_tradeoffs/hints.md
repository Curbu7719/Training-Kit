# Architecture Decisions & Trade-Offs — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The short version.** An architecture decision is a choice between options that each cost something. An ADR is a small note recording what you chose and why, so future-you doesn't have to guess.
- **The "menu" framing.** Picking an option without listing the alternatives is like ordering the first dish you see. Writing the options down is reading the whole menu — and the consequences are the price next to each dish.
- **The "future stranger" framing.** Write the decision for a competent stranger who joins the team next year. If they can read it and understand why the system is the way it is, the ADR did its job.

## Hint stack

- **Hint 1.** Two things matter in these questions: the **decision** (which option) and the **reason** (why it's the best fit for *this* context). A right decision for the wrong reason is not a full answer.
- **Hint 2.** Re-read the context. The "best" option is the one whose trade-offs match the stated constraints — team size, scale, what already exists, what must not break. Ignore options that solve a problem the scenario doesn't have.
- **Hint 3.** Reject reasons that are factually wrong or that praise an option for something it doesn't actually do. The correct reason names a real consequence that fits the situation, not a generic-sounding benefit.

## FAQ

**Q: Isn't writing ADRs just bureaucracy that slows us down?**
A: A good ADR is half a page and takes minutes. It saves hours later when someone re-litigates a settled decision or is afraid to touch code nobody understands.

**Q: What if we later discover the decision was wrong?**
A: That's normal. You write a new ADR that supersedes the old one, referencing it. The old record still has value — it shows the choice was sound given what you knew then.

**Q: Do small decisions need an ADR?**
A: No. Record decisions that are hard to reverse, affect many parts of the system, or that people will predictably ask "why?" about later.

**Q: What makes a trade-off "honest"?**
A: It states what you *give up*, not only what you gain. If an option's downside section is empty, you haven't analysed it — you've advertised it.
