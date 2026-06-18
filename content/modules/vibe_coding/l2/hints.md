# Hints — Vibe Coding in Depth

## Alternative phrasings of the core idea

- Each good vibe-coding discipline is a defense against a specific failure mode: tests catch
  silent wrong code, reading catches plausible-but-broken logic, running catches hallucinated
  APIs, small diffs catch scope creep, and the "understand it" rule catches eroded understanding.
- The disciplines compose like layered defenses — drop one and the failure it contained walks
  through; "it runs and looks right" is exactly the gap where silent and plausible-but-broken bugs live.
- The deepest discipline is keeping an accurate mental model of the system as the AI writes into
  it; that model is what makes architectural coherence and security review possible at all.

## Hint stack

- **H1 (nudge):** "It runs" and "it looks right" each miss a different failure. Which failure does
  *running* fail to catch, and which does *a glance* fail to catch?
- **H2 (structural):** Pair each failure mode with its containing discipline — silent wrong code ↔
  behavioural tests, plausible-but-broken ↔ reading against the spec, hallucinated API ↔ run + take
  the wheel, scope creep ↔ small single-purpose diffs, eroded understanding ↔ never ship what you
  don't understand. A gap means a missing or misplaced discipline.
- **H3 (near-answer):** Plausible-but-broken is the trap of fluency: confident, idiomatic code that
  mishandles an edge case. Only reading the diff *with your spec's edge cases in mind* — backed by a
  behavioural test — reliably catches it; "compiles and runs" does not.

## FAQ

**Q: If the code runs and a smoke test passes, what's left to worry about?**
Silent wrong code (runs, returns the wrong value) and plausible-but-broken logic (reads fine,
mishandles an edge case). Both need a behavioural test and a real read against your spec, not just
"no crash."

**Q: Why is eroded understanding called the most dangerous failure mode?**
Because it compounds silently. Each unread accepted diff is fine in isolation, but accumulated they
leave a system no one can debug, secure, or extend — and you only discover it when something breaks
and there's no mental model to reason from.

**Q: The AI keeps suggesting a method that doesn't exist. Is that my prompt's fault?**
It's a hallucinated API, and the fix isn't endless reprompting. Running the code exposes it, and a
loop of near-identical wrong suggestions is your signal to take the wheel and write it yourself.

**Q: How do I stop AI-assisted work from eroding architecture?**
Keep the mental model: enforce the project's patterns in prompts, reject diffs that drift or creep
in scope, and refactor toward coherence. You can only catch drift if you still understand the whole.
