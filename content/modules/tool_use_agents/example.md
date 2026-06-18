# Worked Example: An Agent Fixing a Failing Test

A teammate reports that `test_apply_discount` is red after a recent change. A single model call can't fix it well — it can't see the failure or the source. So we give a coding assistant three tools and let it run an **agent loop**.

**Tools the app declares to the model:**

- `run_tests(path)` → runs the suite, returns pass/fail and any traceback.
- `search_code(query)` → returns matching files and line ranges.
- `apply_patch(diff)` → applies a unified diff to the working tree.

**Iteration 1 — plan and act.** The model reasons it must see the actual failure first. Instead of guessing, it emits a tool request:

> `run_tests(path="tests/test_discount.py")`

The model stops and waits — it has *requested*, not executed.

**The app executes.** Your code runs pytest and returns the result into the conversation:

> Result: `FAILED — AssertionError: expected 90, got 100. apply_discount() in cart.py:42`

**Iteration 2 — observe, plan, act again.** The model now knows where the bug is but needs the source. It requests:

> `search_code(query="def apply_discount")`

The app returns `cart.py:40-46`, revealing the discount is never subtracted.

**Iteration 3 — act.** The model proposes a fix:

> `apply_patch(diff="--- a/cart.py ... price - discount ...")`

The app applies it.

**Iteration 4 — verify and finish.** The model re-runs the suite:

> `run_tests(path="tests/test_discount.py")` → `PASSED`

It calls no more tools and reports: "Fixed `apply_discount` in cart.py:42 — the discount wasn't being subtracted. Tests pass."

**What this illustrates:**

- The model **requested** tools; the **app executed** them — the boundary never blurs.
- The loop ran **plan → act → observe** until tests went green, then stopped on its own.
- A guardrail matters: if `run_tests` kept failing, a **max-iteration limit** (say, 8) would halt the loop instead of letting it edit-and-retry forever.

A single call would have hallucinated a patch. The agent loop let the model *gather the failure and the source it didn't know*, step by step, before committing a fix that's actually verified.
