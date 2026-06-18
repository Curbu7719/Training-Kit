# Worked Example: A Plausible-but-Broken Diff That Reads Fine

**The task.** Raj vibe-codes a discount calculator: apply a percentage discount to a cart, but
never let the total go below zero. He prompts for it and gets back a clean, confident function.

**The diff looks great.** It's well-named, has a comment, handles a `discountPercent` parameter,
and returns `total - (total * discountPercent / 100)`. It reads like something a senior engineer
wrote. Raj's reckless instinct is to accept it — it *runs*, and it *looks right*. That instinct is
exactly the **plausible-but-broken** trap: fluency is not correctness.

**Reading against the spec.** Raj instead reads the diff with his intent in mind — *"never below
zero."* He notices the function never clamps the result, and that `discountPercent` is taken
straight from a request with no bounds check. So a `discountPercent` of `150` returns a *negative*
total, and the "never below zero" rule from his spec is silently violated. Nothing crashed; a test
that only checked "no error" would have passed. This is **silent wrong code** hiding inside
plausible-but-broken output.

**Containing it.** Raj writes a test that asserts behaviour — `discount(100, 150)` should be `0`,
not `-50` — and watches it fail, confirming the bug. He prompts for a small fix to clamp the result
and validate the input range, **reads** the new diff, **runs** the test until it passes, and
**commits**. When he later notices the AI also tried to refactor an unrelated pricing module
(**scope creep**), he rejects that part and keeps the diff single-purpose.

**The lesson.** Every failure here was caught by a discipline aimed at it: reading caught the
plausible-but-broken logic, a behavioural test caught the silent wrong result, and a small-diff
habit caught the scope creep. "Runs and looks right" would have shipped all three.
