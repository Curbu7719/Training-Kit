# Worked Example: Choosing Models Across a Coding Sprint (Coding Phase)

**Phase: Coding/Implementation.** A development team is wiring AI into its daily workflow during a feature sprint. Three distinct lifecycle tasks come up, and each calls for a different model choice — showing the capability/cost/latency trade-off in practice.

**Task 1 — generating commit messages.** Every push triggers a small prompt: *"Summarize this diff as a one-line commit message. Diff: ..."*. The model continues the text and its most probable next tokens become the message. This is high-volume, simple, and well-bounded, so the team picks a **small, fast, cheap** model at **low temperature** — they want concise, consistent phrasing, not creativity. Paying flagship prices on every commit would be wasteful.

**Task 2 — generating unit-test cases.** A tester prompts the model to produce edge cases for a date-parsing function. This needs more reasoning than a commit message but isn't the hardest task, so a **mid-tier** model fits. Temperature is set slightly higher so the model proposes *varied* inputs (leap years, time zones, empty strings) rather than repeating the obvious ones.

**Task 3 — reviewing an architecture proposal.** An architect asks the model to critique a proposed service split for hidden coupling and failure modes. This is genuinely hard, open-ended reasoning where a weak answer is costly, so the team reserves the **largest, most capable** model — accepting its higher cost and latency because it runs rarely and the stakes are high.

**Where the limits bite.** The model once suggested a library method that doesn't exist — a **hallucination**. So the team treats every AI suggestion as a draft a human verifies, and pins the framework version in prompts to offset the **knowledge cutoff**.

**Result:** one team, three tasks, three model sizes. The choice followed each task's demands — not a habit of always reaching for "the best" model.
