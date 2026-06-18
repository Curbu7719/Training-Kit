# Hints & Alternative Phrasings

## Alternative phrasings

- Tool use lets a text-only model **act on your codebase**: it *requests* a tool (run the tests, search the code), your app *runs* it and returns the result, then the model continues with that new information.
- An agent is a model running a **plan → act → observe** loop, deciding each turn whether to call another tool (run, search, patch) or finish.
- The model never executes tools itself — think of it as an engineer pairing over a screen share, asking you (your code) to run the command and read back the output.

## Hint stack

**H1 (nudge):** A model alone can only output text — it can't run your test suite or read the failing file. What mechanism lets it ask your application to do those things on its behalf?

**H2 (mechanism):** In tool use, you describe tools (name, description, inputs) like `run_tests`, `search_code`, `apply_patch` to the model. When it wants one, it emits a structured **request**; your app executes the real command and returns the **result** into the conversation. For a multi-step task like fixing a bug, an **agent** repeats this in a loop: plan the next step, act (request a tool), observe the result, repeat until the tests pass.

**H3 (worked):** To fix a failing test, a single call fails (it can't see the failure or the source). An agent loops: iteration 1 it *requests* `run_tests` and the app returns the traceback; iteration 2 it `search_code` to find the function; iteration 3 it `apply_patch`; iteration 4 it re-runs the tests and they pass, so it stops. A max-iteration limit guards against an edit-and-retry loop that never converges.

## FAQ

**Q: Does the model run the tests or edit the file itself?**
No. The model only *requests* a tool by emitting a structured call. Your application executes the real command (pytest, grep, patch) and returns the result. Keeping this boundary clear is the heart of tool use.

**Q: When should I use an agent instead of a single model call?**
Use a single call for one-shot tasks (summarize a PR, explain an error). Use an agent when the task is multi-step, needs fresh state, or depends on intermediate results — like fixing a bug, where each edit must be re-tested before the next decision.

**Q: What's a "runaway loop" and how do I stop it?**
That's when the agent keeps running tests and editing without converging, wasting time and money. A **maximum-iteration limit** caps the loop; timeouts, budgets, and human-approval steps add further guardrails.

**Q: Why are coding agents riskier than single calls?**
More autonomy means more ways to fail: cost grows per iteration, an early misread failure can compound through later edits, the model may call the wrong or a destructive tool (force-push, delete a branch), and loops can spin. Guardrails — limits, input validation, approvals on risky tools — make the autonomy safe.
