# Hints — Vibe Coding Done Right

## Alternative phrasings of the core idea

- Vibe coding is directing an AI to write your code — and doing it *right* means staying the
  pilot: clear intent in, small steps, and you reading and understanding every diff before it lands.
- It is the prompt → run → verify → refine loop with guardrails: tests and version control as
  your safety net, secrets kept out of prompts, and a human who never ships code they can't explain.
- The tool is the same whether you do it well or badly; the discipline (spec first, small
  reviewable diffs, read the output, take the wheel when the AI loops) is what separates the two.

## Hint stack

- **H1 (nudge):** The fastest-looking shortcut — paste the AI's output because it "looks right"
  — is the one that bites later. What step does that skip?
- **H2 (structural):** Map the loop: *intent/spec* → *small prompt* → *run/test* → *read &
  understand the diff* → *review/commit*. Which steps does reckless vibe coding drop, and what
  failure does each dropped step let through?
- **H3 (near-answer):** The non-negotiable rule is **never ship code you don't understand.**
  Reading the diff, tests, and version control exist so that mistakes surface early and are
  reversible — that is what lets you move fast safely, not unread output.

## FAQ

**Q: Isn't reading every diff slow? The whole point is speed.**
Reading is what *makes* it safely fast. Unread output ships silent bugs that cost far more to
debug later than the minutes spent reviewing. Small diffs keep reading cheap.

**Q: The code runs and looks right — isn't that enough?**
No. "Runs" and "looks right" miss the most dangerous failures: plausible-but-broken logic,
hallucinated APIs that happen to compile around, missing auth, or tokens that never expire.
Tests and a real read catch these; vibes don't.

**Q: When should I stop prompting and write it myself?**
When the AI loops, re-guesses the same fix, or invents APIs that don't exist. That is the signal
to take the wheel — prompt → run → verify → refine, and when refine stops converging, you drive.

**Q: What should never go into a prompt?**
Secrets and sensitive data — API keys, passwords, customer PII. Keep them in environment
variables or a secret store, and review generated code for hard-coded credentials and insecure
patterns before you commit.

**Q: How do I keep the codebase coherent if AI wrote much of it?**
Hold the architecture yourself: enforce the project's patterns in your prompts, reject diffs
that drift, and refactor so the system stays something the team can reason about — not a pile of
generated code no one understands.
