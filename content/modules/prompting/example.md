# Worked Example: Get It Right on the First Try by Writing a Better Brief

You ask the AI to "write some tests for this function" and get three trivial happy-path tests you have to rewrite. The problem wasn't the model — it was the brief. Here's how a few minutes on the prompt saves you the rewrite.

**The chore: vague request, useless output.** "Write some tests" gives the model nothing to aim at, so it guesses. You change it to: "Cover the empty-list, single-item, and overflow cases; use pytest; one assertion per test." *Why use AI here?* Same model, but now it writes the exact cases you'd have typed by hand — you got the boring tests *and* you got the ones you'd have forgotten.

**The lever: set the rules once, up top.** You put the durable stuff in the **system message** — "You write tests with our framework and never invent APIs" — and keep the **user message** for the specific ask. *Why?* The system rule sticks across every request, so you stop re-typing your coding standards into every prompt.

**The shortcut: show, don't describe.** Instead of explaining your test-naming style in a paragraph, you paste one example test. *Why use AI here?* One good example ("few-shot") teaches house style better than three sentences ever could — the model copies your pattern instead of inventing its own.

**Wrap the artifact.** You fence the function in triple backticks so the model knows what's *instructions* and what's *the thing to process* — no more it "fixing" your prompt text.

**Stay in control.** A first prompt is a draft, like code before the tests pass. Run it on a couple of inputs, see where it's wrong, tighten the wording — don't expect a magic spell.

**The takeaway:** the quality of the answer tracks the quality of the brief. Spend three minutes being specific and you stop spending twenty minutes rewriting what the AI guessed.
