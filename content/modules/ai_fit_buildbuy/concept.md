# AI Fit & Build vs Buy

Before you use AI for a feature, ask two questions first. **Is AI even the right tool for
this problem?** And if it is, **how should you get it — build it, buy it, fine-tune it, or
call an API?** ("Fine-tune" means take a ready-made model and train it a little more on your
own data. An API is a way for your software to use another program over the internet — here,
a model that someone else runs and you just send requests to.) Reaching for a large language
model when a few lines of simple, fixed code would do is one of the most common and most
expensive mistakes in modern software work.

**Is AI the right tool?** AI fits problems that are **fuzzy, need judgment, or are about
language and perception** — summarizing free text, sorting messy support tickets, pulling
fields out of many different documents. AI fits poorly when the rule is **exact and known**:
working out tax, checking that an email address has the right shape, routing by a lookup
table. Those want **deterministic** code. Deterministic means it gives the **same answer
every time** for the same input. It is cheaper, faster, easy to test, and dependable. AI is
**non-deterministic** — the same input can give different output. So you use it only when you
can live with that change, and when **"probably right" is better than nothing**. Weigh three
things: how much **accuracy** the task really needs, how much **non-determinism** you can
accept, and the **cost** per call at your real usage.

**Analogy.** Choosing AI is like hiring a smart contractor who is sometimes wrong, versus
buying a calculator. For tax math you want the calculator — exact, instant, free. For "read
these 500 reviews and tell me the main themes," you want the contractor, even though they
might word it differently each time.

**Build vs buy vs fine-tune vs API.** Once AI fits, getting it is a range of choices.
**Call an API** (a model someone else hosts) for speed and low cost to start. **Buy** a
finished SaaS feature when it is not what makes you special. **Fine-tune** a model when a
general one is close but needs your field's wording or labels. **Build** in-house only when
AI is core to your product and you have the data, the people, and the budget. Watch out for
**vendor lock-in** and **switching costs** — special formats and prompts make it expensive to
leave a provider. Judge the real **TCO** (total cost of ownership): not just the price per
call, but also connecting it, watching it, testing it, and keeping it running. Use an
**abstraction layer** — a thin layer of your own code between your app and the provider — so
you can swap providers later.

## How each role uses this

- **Portfolio Manager:** Decides whether an incoming request is worth AI at all, and whether to build, buy, fine-tune, or call an API — weighing total cost with the tech team against company priorities and the roadmap.
- **Project Manager:** States the accuracy the task really needs and the data and workflow limits, plans the sourcing decision, and owns its risks and time-to-market.
- **Enterprise Architect:** Judges AI-vs-deterministic fit, designs a provider abstraction, and keeps switching costs and lock-in low.
- **Developer:** Spots when plain code beats a model, hides any AI behind that abstraction, and measures the real cost and speed per call.
- **Governance:** Flags the vendor, IP/licensing, and compliance limits that can block a build/buy choice.
