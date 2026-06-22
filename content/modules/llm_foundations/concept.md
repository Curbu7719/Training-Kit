# What a Large Language Model Is

A large language model (LLM) is a computer program. It has read a huge amount of text, so it has learned how words usually go together. It does one simple job, again and again: it reads the text so far and predicts the **next token**. (A token is a word or part of a word.) It picks a likely next token, adds it, and repeats — one token at a time — until a full answer is built. Everything an LLM does across the software lifecycle — from writing a commit message to reviewing an architecture proposal — is built on this next-token loop.

**An analogy:** think of the autocomplete on a phone keyboard. But this one was trained on a whole library of code and writing, not on your old texts. And it is strong enough to continue whole functions or design reviews. It does not look facts up in a database. It builds the most likely continuation from patterns it has learned.

Keep two phases apart. **Training** is the slow, costly, one-time process where the model learns its patterns. It produces a fixed set of weights (the numbers the model learned). **Inference** is what happens every time a developer's tool calls the model: the weights stay fixed, and the model writes a response to the prompt. You pay for and wait on inference; training already happened.

Models come in **families and sizes**. A provider usually offers a range: small/fast/cheap up to large/capable/slower. Bigger is not always better for every lifecycle task.

Key **capabilities**: writing and explaining code, summarizing requirements, drafting tests, translating, and step-by-step reasoning. Key **limits** to plan around:

- **Hallucination** — it can say false things with confidence (for example, an API that does not exist). This happens because it predicts likely text, not checked truth.
- **Knowledge cutoff** — it only knows data up to its training date. So it may miss a new framework version.
- **Non-determinism** — the same prompt can give different answers. This is because it predicts likely text, not one fixed answer. Plan around it: do not expect the same output every run, and do not test against an exact string.

**Choosing a model** is a trade-off between **capability, cost, and latency** (latency is how long you wait for the answer). Use the smallest model that reliably does the task, and save the largest for truly hard work like design or complex refactors.

## How each role uses this

- **Developer:** Picks a small, cheap model for inline code-completion or commit messages, and a strong model for a complex multi-file refactor or a hard bug.
- **Enterprise Architect:** Saves the strongest model for design review and trade-off analysis, and treats the model as a part you can swap out.
- **Tester:** Uses a model to make edge-case test data, and writes checks that allow for non-determinism.
- **Project Manager:** Weighs capability vs cost vs latency when scoping a feature — knowing that high-volume calls (for example, PR-title generation) suit a cheaper model — and tracks model choice as a cost/quality risk.
