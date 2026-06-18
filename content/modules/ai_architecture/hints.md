# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "An LLM app is the model plus an orchestration layer around it that builds prompts,
  retrieves context, calls tools, and enforces guardrails."
- "Treat the model provider as a swappable dependency behind an abstraction, not a
  hard-wired core of your system."
- "Cross-cutting concerns — secrets, PII/governance, reliability/fallbacks, monitoring,
  cost controls — apply to the whole system, not a single component."

**Hint stack**

- **H1 (nudge):** Ask *where does this responsibility belong?* Anything involving secrets,
  business rules, or decisions belongs server-side in the orchestration layer — never in
  the client.
- **H2 (structure):** Trace one request through the boxes: client → orchestration →
  (retrieval / guardrails / tools) → model → (output guardrail) → back. For each box ask
  what it owns and what it must *not* own.
- **H3 (worked path):** Secrets and logic go in orchestration; grounding goes through the
  vector store; real-world actions go through tools; safety checks go in guardrails;
  visibility goes in observability. Keep the model behind an abstraction so it can be
  swapped and given a fallback when it fails.

**Short FAQ**

- **Why not call the model directly from the client?** The client would have to hold the
  API key (a security risk) and you'd lose central control over prompts, guardrails,
  logging, and cost. The orchestration layer exists to own all of that.
- **What does the vector store actually do?** It stores embeddings of your documents so
  the app can retrieve the passages most relevant to a question and feed them to the
  model — grounding answers in real data instead of the model's memory.
- **What's a fallback in this context?** A planned response when the provider fails or is
  slow — retry, route to a backup model, or return a graceful message — so one provider
  outage doesn't take the whole feature down.
- **Why abstract the model provider?** So you can swap providers, add routing, or run a
  cheaper model for easy tasks by changing configuration instead of rewriting the app.
