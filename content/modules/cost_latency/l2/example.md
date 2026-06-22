# Worked Example: Tune the AI Reviewer for Real Team Scale

Your AI reviewer works, but now it runs across thousands of PRs a month and the bill and the wait both matter at scale. At depth, "fast and cheap" splits into specific numbers you can move. Here's how the deeper levers keep the tool helpful when the whole team leans on it.

**Latency is two numbers.** You measure **time-to-first-token** (how long until the first comment appears) and **tokens-per-second** after that. *Why does this make your day easier?* Streaming gives a low TTFT so you see feedback fast — and you realize a check that dumps 2,000 tokens of prose feels slow even with a great TTFT, so you shorten the review itself.

**Caching turns repetition into savings.** Your coding standards and few-shot review examples are the same on every PR. *The lever:* prefix caching reuses that stable prefix at a reduced rate. *Why use AI this way?* You're paying full price to re-send the identical preamble thousands of times — caching it is free money once you notice it.

**Route by risk, not by reflex.** A docs typo and an auth refactor don't deserve the same model. *Why does this matter at scale?* Sending everything to the big model multiplies the bill for no extra catch on the routine 90% — tiered routing puts spend where the risk is.

**Measure before you optimize.** You profile real PRs — token counts in and out, TTFT, where the seconds go — before changing anything. *Why?* The slow step is often a pipeline stage (fetching files, a linter call), not the model — optimizing the wrong one wastes effort.

**The takeaway:** at team scale, "tune the reviewer" becomes concrete: watch TTFT and token rate, cache the stable prefix, route by risk, and profile before you cut. That's what keeps an every-PR AI step fast and affordable as the whole org leans on it.
