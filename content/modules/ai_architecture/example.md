# Worked Example: Architecting an Internal Policy Assistant

A company wants an internal assistant that answers employee questions about HR and IT
policies, citing the relevant policy document. The team sketches the architecture before
writing code.

**The request flow they design.**

1. **Client** — a chat box in the internal portal. It only captures the question and
   renders the answer; it holds no API keys and runs no business logic.
2. **App / orchestration layer** — a server-side service receives the question. This is
   where everything important happens.
3. **Retrieval (vector store)** — the orchestrator embeds the question and searches a
   vector store of policy documents, pulling the 3 most relevant passages.
4. **Guardrail (input)** — it checks the question isn't asking for something off-limits
   (e.g., another employee's salary) before proceeding.
5. **Model provider** — the orchestrator builds a prompt containing the retrieved
   passages plus the question and calls the LLM, instructing it to answer *only* from the
   supplied passages and to cite them.
6. **Guardrail (output)** — it verifies the answer cites a real retrieved passage and
   contains no obvious PII leak before returning it.
7. **Observability** — the whole exchange (question, retrieved docs, model response,
   latency, tokens) is logged for evaluation.

**Key decisions and why.**

- **Secrets stay server-side.** The model API key lives in the orchestration layer's
  environment, never in the browser, so it can't be stolen from client code.
- **The model is behind an abstraction.** The orchestrator calls an internal
  `answer()` interface, so swapping providers or routing to a cheaper model later is a
  config change, not a rewrite.
- **Grounding via retrieval** reduces hallucination: the model answers from real policy
  text instead of its own memory, and citations make answers verifiable.
- **Fallback.** If the provider call fails, the orchestrator retries once, then returns a
  graceful "try again shortly" message rather than crashing.

**Rollout.** They ship behind a feature flag to the IT team first, watch the evaluation
logs for wrong or uncited answers, then expand company-wide once quality holds.
