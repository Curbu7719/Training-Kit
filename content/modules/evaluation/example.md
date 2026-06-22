# Worked Example: Stop Shipping AI Changes on a Gut Feeling

You tweak a prompt, it looks better on the three examples you tried, you ship it — and it quietly breaks a dozen cases you didn't check. You can't `assertEquals` an AI summary, so it feels like you're flying blind. **Evaluation** is what testing becomes when there's no single right string, and it's how you stop guessing.

**The trap: judging on a handful of demos.** Three good examples feel like proof; they aren't. *Why is this dangerous?* The same prompt produces different wording every run and there's rarely one correct answer — a tweak that shines on three inputs can regress on twenty you never saw.

**The fix: a golden dataset.** You curate a set of real inputs with known-good answers or rubrics — the QA equivalent of a test suite — and score the feature over all of them. *Why does this make your day easier?* "It feels better" becomes a number. You change the prompt, rerun the suite, and *keep the change only if the score went up.* That's TDD for AI: the numbers decide, not vibes.

**Score properties, not exact strings.** Since outputs vary, you measure accuracy, relevance, and faithfulness (does it stick to the source?) rather than string-matching. *Why use AI here at all?* An LLM-as-judge can score "is this answer faithful?" across hundreds of cases in minutes — fast enough to run on every change.

**Wire it into CI.** You run the eval suite after every change, like any other test gate, so a fix in one place can't silently break another. *Why does this save you?* The regression shows up in the pipeline, not in production.

**Stay in control.** The judge itself has to be trusted — spot-check its scores against your own judgment before you let a number gate a release.

**The takeaway:** you don't have to choose between "AI outputs vary" and "know if it works." A golden dataset, property scoring, and a CI gate turn a gut feeling into evidence — so you ship the prompt change that actually helped, not the one that demoed well.
