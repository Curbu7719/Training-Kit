# Worked Example: One Model Doesn't Fit Your Whole Day

You use AI all day, but not every task deserves the same model. Here's how matching the model to the job keeps your tools fast and cheap — and why it's worth a moment's thought.

**Inline completion — you want it instant.** As you type, a small fast model suggests the next line. *Why a small model?* A big "reasoning" model would think for seconds on every keystroke and cost a fortune — here speed beats brilliance, so you point completion at the cheapest fast model and cap the output short.

**PR review — good enough, on every PR.** A mid model reviews each pull request; only the sprawling, scary refactors get escalated to a stronger one. *Why route instead of always-big?* Most PRs are routine — sending them all to the expensive model would multiply the bill for no extra catch.

**The rare hard call — bring the big brain.** Once in a while you ask "is this design sound?" That's when the strongest reasoning model earns its cost, because it's rare and the answer really matters.

**Two settings that keep output sane.** You cap **max output** so the reviewer gives you the top issues, not an essay, and set a **stop sequence** so completion ends cleanly at the block.

**Why bother matching at all?** Pointing one big model at everything is the simple-looking trap: completion gets slow, the bill climbs every sprint, and you still hit hallucinations. Matching the model to the task hands you speed where you need it and depth where it counts.

**The takeaway:** there's no "the AI" — there's a small fast one for the routine, a strong one for the hard call, and routing that sends each task to the cheapest model that can do it.
