# Hints & Alternative Phrasings

## Alternative phrasings

- Tool use lets a text-only model **act on the world**: it *requests* a function, your app *runs* it and returns the result, then the model continues with that new information.
- An agent is a model running a **plan → act → observe** loop, deciding each turn whether to call another tool or give a final answer.
- The model never executes tools itself — think of it as an analyst on a phone asking an assistant (your code) to fetch records.

## Hint stack

**H1 (nudge):** A model alone can only output text — it can't reach live data or systems. What mechanism lets it ask your application to do something on its behalf?

**H2 (mechanism):** In tool use, you describe tools (name, description, inputs) to the model. When it wants one, it emits a structured **request**; your app executes the real function and returns the **result** into the conversation. For multi-step work, an **agent** repeats this in a loop: plan the next step, act (request a tool), observe the result, repeat until done.

**H3 (worked):** To answer "what's the weather in Paris tomorrow?", a single call fails (it doesn't know future data). An agent loops: iteration 1 it *requests* `get_forecast`; the app runs it and returns "12°C, rain"; iteration 2 the model observes that and writes the final answer. A max-iteration limit guards against the loop never converging.

## FAQ

**Q: Does the model run the tool itself?**
No. The model only *requests* a tool by emitting a structured call. Your application executes the real function and returns the result. Keeping this boundary clear is the heart of tool use.

**Q: When should I use an agent instead of a single model call?**
Use a single call for one-shot tasks (summarize, translate). Use an agent when the task is multi-step, needs fresh or external data, or depends on intermediate results — like research or operating on a live system.

**Q: What's a "runaway loop" and how do I stop it?**
That's when the agent keeps calling tools without converging on an answer, wasting time and money. A **maximum-iteration limit** caps the loop; timeouts, budgets, and human-approval steps add further guardrails.

**Q: Why are agents riskier than single calls?**
More autonomy means more ways to fail: cost grows per iteration, an early wrong observation can compound through later steps, and loops can spin. Guardrails (limits, validation, approvals) make the autonomy safe.
