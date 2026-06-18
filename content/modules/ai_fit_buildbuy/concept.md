# AI Fit & Build vs Buy

Before you adopt AI for a feature, two decisions come first: **Is AI even the right tool
for this problem?** and, if so, **how should you source it — build, buy, fine-tune, or
call an API?** Reaching for a large language model when a few lines of deterministic code
would do is one of the most common and expensive mistakes in modern software work.

**Is AI the right tool?** AI fits problems that are **fuzzy, judgment-heavy, or
language/perception-shaped** — summarizing free text, classifying messy support tickets,
extracting fields from varied documents. It fits poorly when the rule is **exact and
known**: calculating tax, validating an email format, routing by a lookup table. Those want
deterministic code, which is cheaper, faster, testable, and gives the **same answer every
time**. AI is **non-deterministic** — the same input can yield different output — so you
adopt it only when you can tolerate that variability and when **probably-right beats
nothing**. Weigh three things: how much **accuracy** the task truly needs, how much
**non-determinism** you can live with, and the **cost** per call at your real volume.

**Analogy.** Choosing AI is like hiring a smart but occasionally-wrong contractor versus
buying a calculator. For tax math you want the calculator — exact, instant, free. For
"read these 500 reviews and tell me the themes," you want the contractor, even knowing they
might phrase it differently each time.

**Build vs buy vs fine-tune vs API.** Once AI fits, sourcing is a spectrum. **Call an API**
(a hosted model) for speed and low upfront cost. **Buy** a finished SaaS feature when it is
not your differentiator. **Fine-tune** a model when a general one is close but needs your
domain's voice or labels. **Build** in-house only when AI is core to your product and you
have the data, talent, and budget. Watch **vendor lock-in** and **switching costs** —
proprietary formats and prompts make leaving expensive — and judge the real **TCO** (total
cost of ownership): not just per-call price, but integration, monitoring, evaluation, and
maintenance. Favor an **abstraction layer** so you can swap providers later.

## How each role uses this

- **Developer/Engineer:** Spots when deterministic code beats a model, wraps any AI behind
  an abstraction so the provider can be swapped, and measures real per-call cost and latency.
- **Business Analyst:** Frames the accuracy the task actually needs and which data and
  workflows constrain build-vs-buy, mapping each option to a requirement.
- **PM/Product Owner:** Decides whether AI is a differentiator worth building or a commodity
  to buy, and owns the TCO and lock-in trade-off against time-to-market.
- **QA & Architect:** Defines how a non-deterministic feature is tested and accepted, and
  designs the integration so vendor switching costs stay low.
