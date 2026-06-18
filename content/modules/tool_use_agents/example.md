# Worked Example: An Agent Answering "What Should I Wear in Paris Tomorrow?"

A single model call can't answer this well — it doesn't know tomorrow's weather (knowledge cutoff) and can't look it up. So we give it two tools and let it run an **agent loop**.

**Tools the app declares to the model:**

- `get_forecast(city, date)` → returns temperature and conditions.
- `get_calendar(date)` → returns the user's events for that day.

**Iteration 1 — plan and act.** The model reasons that it needs the weather first. Instead of guessing, it emits a tool request:

> `get_forecast(city="Paris", date="tomorrow")`

The model stops and waits — it has *requested*, not executed.

**The app executes.** Your code calls the real weather service and returns the result into the conversation:

> Result: `12°C, light rain in the afternoon.`

**Iteration 2 — observe, plan, act again.** The model now knows the weather but realizes outfit advice depends on the day's plans. It requests the second tool:

> `get_calendar(date="tomorrow")`

The app runs it and returns:

> Result: `Outdoor walking tour, 2-5 PM.`

**Iteration 3 — observe and finish.** With both observations in hand, the model has everything it needs. It calls no more tools and writes the final answer:

> "Expect 12°C and afternoon rain during your 2-5 PM walking tour — wear a warm layer and bring a waterproof jacket and umbrella."

**What this illustrates:**

- The model **requested** tools; the **app executed** them — the two never blur.
- The loop ran **plan → act → observe** twice before converging, then stopped on its own.
- A guardrail matters here: if a tool kept failing, a **max-iteration limit** (say, 5) would halt the loop instead of letting it spin forever and rack up cost.

A single call would have hallucinated the weather. The agent loop let the model *gather what it didn't know*, step by step, before committing to an answer.
