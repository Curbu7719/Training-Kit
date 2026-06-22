# Worked Example: Pick the Strategy, Accept Its Failure Mode

You're running a multi-day, AI-assisted migration. No single trick keeps it inside the context window — so you combine a few, knowing exactly how each one can bite you. Here's how that keeps your own work moving instead of silently breaking.

**Recent dialogue: sliding window.** You keep only the last several turns live. *Why?* It's cheap and the recent back-and-forth is what matters now. *The catch you accept:* it's amnesiac by design — a rule you stated on day one scrolls out. So you **pin** that rule as a fixed fact rather than trusting the window to hold it.

**Older history: a running summary.** You compress yesterday's decisions into a short recap. *Why use AI here?* It writes the recap in seconds and you carry decisions forward without re-pasting everything. *The catch:* summaries are lossy and summaries-of-summaries drift — so you keep identifiers and acceptance criteria verbatim, never paraphrased.

**The codebase: retrieval.** You fetch only the files each step needs. *Why?* It keeps the window lean across hundreds of calls. *The catch:* now your risk is retrieval quality — a stale index serves last week's code and the AI "fixes" a file that already changed. So you re-index before each session.

**Placement matters.** You put the critical spec near the **start or end** of the prompt, not buried in the middle, because models attend less reliably to the middle of a long context — and you reserve headroom so a near-full input doesn't starve the output.

**The takeaway:** at depth the skill isn't finding a "safe" technique — there isn't one. It's matching strategy to content and handling its known failure mode on purpose, so a long AI-assisted job stays correct instead of quietly losing a constraint.
