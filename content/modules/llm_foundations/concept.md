# What a Large Language Model Is

A large language model (LLM) is a program that has read an enormous amount of text and learned the statistical patterns of language. At its core it does one deceptively simple thing: given the text so far, it predicts the **next token** (a token is a word or word-fragment). It picks a likely next token, adds it, and repeats — one token at a time — until a full answer emerges. Everything an LLM does across the software lifecycle, from drafting a commit message to reviewing an architecture proposal, is built on this next-token prediction loop.

**An analogy:** think of a phone keyboard's autocomplete, but trained on a library of code and prose instead of your texting history, and powerful enough to continue whole functions or design reviews. It isn't looking facts up in a database; it's reconstructing the most plausible continuation from patterns it absorbed.

Separate two phases. **Training** is the slow, expensive, one-time process where the model learns its patterns, producing a frozen set of weights. **Inference** is what happens every time a developer's tool calls it: the weights stay fixed and the model generates a response to the prompt. You pay for and wait on inference; training already happened.

Models come in **families and sizes** — a provider typically offers small/fast/cheap up to large/capable/slower. Bigger is not automatically better for every lifecycle task.

Key **capabilities**: writing and explaining code, summarizing requirements, drafting tests, translating, and step-by-step reasoning. Key **limits** to design around:

- **Hallucination** — it can state false things confidently (an API that doesn't exist), because it predicts plausible text, not verified truth.
- **Knowledge cutoff** — it only knows data up to its training date, so it may miss a newly released framework version.
- **Non-determinism** — the same prompt can give different answers, because it predicts plausible text rather than retrieving one fixed answer. Design around it: don't expect identical output every run, and don't assert against an exact string.

**Choosing a model** is a trade-off between **capability, cost, and latency**: use the smallest model that reliably does the lifecycle task, and reserve the largest for genuinely hard work like design or complex refactors.

## How each role uses this

- **Developer/Engineer:** Picks a small, cheap model for an inline code-completion assistant or generating commit messages, and a strong model for a complex multi-file refactor or hard bug diagnosis.
- **Business Analyst:** Uses a capable model to summarize a long requirements interview into structured user stories, and verifies any factual claims since the model can hallucinate.
- **PM/Product Owner:** Weighs capability vs cost vs latency when scoping an AI feature, knowing high-volume calls (e.g. PR-title generation) favor a cheaper model.
- **QA/Tester & Architect:** A tester uses a model to generate edge-case test data and designs assertions that tolerate non-determinism; an architect reserves the strongest model for design-review and trade-off analysis.
