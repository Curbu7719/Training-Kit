# What a Large Language Model Is

A large language model (LLM) is a program that has read an enormous amount of text and learned the statistical patterns of language. At its core it does one deceptively simple thing: given the text so far, it predicts the **next token** (a token is a word or word-fragment). It picks a likely next token, adds it, and repeats — one token at a time — until a full answer emerges. Everything an LLM does, from writing code to summarizing a contract, is built on this next-token prediction loop.

**An analogy:** think of a phone keyboard's autocomplete, but trained on a library instead of your texting history, and powerful enough to continue whole paragraphs of reasoning. It isn't looking facts up in a database; it's reconstructing the most plausible continuation from patterns it absorbed.

Separate two phases. **Training** is the slow, expensive, one-time process where the model learns its patterns from data, producing a frozen set of internal weights. **Inference** is what happens every time you use it: the weights stay fixed and the model generates a response to your prompt. You pay for and wait on inference; training already happened.

Models come in **families and sizes** — a provider typically offers small/fast/cheap up to large/capable/slower, plus specialized variants. Bigger is not automatically better for every job.

Key **capabilities**: fluent writing, summarizing, translating, classifying, drafting and explaining code, and step-by-step reasoning. Key **limits** you must design around:

- **Hallucination** — it can state false things confidently, because it predicts plausible text, not verified truth.
- **Knowledge cutoff** — it only "knows" data up to its training date; it isn't aware of yesterday's news unless you supply it.
- **Non-determinism** — the same prompt can give different answers. A **temperature**/sampling setting controls this: low temperature = more focused and repeatable, high temperature = more varied and creative.

**Choosing a model** is a trade-off between **capability, cost, and latency**: use the smallest model that reliably does the job, and reserve the largest for genuinely hard tasks.

## How each role uses this

- **Developer/Engineer:** Picks the model size and temperature per feature — low temperature for structured/code output, a smaller model for high-volume simple calls to cut cost and latency.
- **Business Analyst:** Frames where hallucination and knowledge cutoff create risk in a workflow, so outputs that touch facts get a verification step rather than blind trust.
- **PM/Product Owner:** Weighs capability vs cost vs latency when scoping a feature, and sets expectations that LLM output is probabilistic, not guaranteed identical each run.
- **QA & Architect:** Designs tests that tolerate non-determinism (checking properties, not exact strings) and plans guardrails for hallucination, such as grounding answers in supplied sources.
