# AI or Automation? Choosing the Right Tool

Having AI on tap makes it tempting to reach for a model for everything. But the first question
is not *how* to use AI — it is *whether* you should, or whether plain **automation** does the
job better. Getting this wrong is one of the most common and expensive mistakes in modern
software work: a slow, flaky, costly model doing what ten lines of fixed code would do
perfectly for free — or, the opposite, hand-coding thousands of rules for messy language that
only a model can read.

Two words to define. **Deterministic automation** (also called "rules" or "traditional code")
means code that follows fixed steps and gives the **same answer every time** for the same
input — a formula, a lookup table, a **regex** (a pattern that matches text of a known shape),
a database query. **AI** here means a model (usually an LLM) that is **non-deterministic** —
the same input can give slightly different output — and works by pattern, not by exact rule.

**Three questions, in order.** For any task, ask:

1. **Can I write the rule, and will it stay the same?** If the logic is exact, known, and
   stable — tax math, format checks, routing by a lookup — use **deterministic automation**. It
   is cheaper, faster, testable, auditable, and dependable.
2. **Is it messy language, perception, or judgment?** If the input is free text, varied
   documents, or images, or the task is summarizing, drafting, or classifying fuzzy input — use
   **AI**, where "probably right, then checked" beats nothing.
3. **What happens when it is wrong?** If a wrong answer is costly or must be exact, wrap the AI
   in deterministic checks — the answer is usually a **hybrid**: AI does the fuzzy part, code
   validates it and does anything exact.

**Deterministic vs AI at a glance.** Deterministic code gives the same answer every time; it is
cheap, fast, easy to test, and auditable — but it can only do what you can spell out as a rule.
AI handles ambiguity, language, and open-ended work — but it costs per call, is slower,
non-deterministic, and can be **confidently wrong**, so its output needs checking. Choosing AI
is like hiring a smart assistant who is sometimes wrong; choosing automation is like using a
calculator. For tax you want the calculator; for "read these 500 reviews and tell me the
themes" you want the assistant.

**Hybrid is usually the real answer.** Most good systems are not "AI" or "automation" — they
are both. The AI proposes; deterministic code checks the shape (a valid format, a number in
range, an allowed category) and does anything exact (the real balance, the actual total).
Example: an app drafts a reply to a customer with AI, but pulls the customer's **exact** account
balance with a database query — never from the model. Same screen, two tools, each where it
belongs.

**Common traps.**

- **Using a model for exact rules** — asking an LLM to add numbers, sort a list, or apply a
  fixed discount. It is slower, costs money, and can get wrong what code never gets wrong.
- **"Agent-washing" plain automation** — wrapping a scheduled report or a fixed data pipeline in
  an "AI agent" because it sounds modern. If the steps are fixed, it is automation.
- **Hand-coding language** — trying to cover every phrasing of a free-text request with keyword
  rules. That is exactly where AI earns its keep.
- **Forgetting cost and reliability** — AI is not free or instant. Reserve it for where its
  flexibility is genuinely needed.

## How each role uses this

- **Portfolio / Project Manager:** Challenges "let's use AI" requests — is this really fuzzy
  language or judgment work, or a rule we can automate more cheaply and reliably?
- **Enterprise Architect:** Draws the line in the design — deterministic services for exact
  logic, AI only where ambiguity lives, with checks around it (hybrid).
- **Developer:** Spots when plain code beats a model, and puts deterministic validation around
  every AI output.
- **Tester / DevOps:** Tests deterministic parts exactly; treats AI parts as probabilistic
  (ranges, thresholds, guardrails), not pass/fail on a single run.
- **Governance:** Notes that deterministic decisions are auditable and repeatable; AI decisions
  need logging, review, and a human in the loop where it matters.

> This is the *fit* question in miniature. Once you have decided AI belongs, the **AI Fit &
> Build vs Buy** module covers how to source it — call an API, buy, fine-tune, or build.
