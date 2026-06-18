# Worked Example: The Leak That Survived Redaction

**Phase: building an AI support-assistant feature.** A team ships an internal assistant that
answers support questions by retrieving relevant tickets from a **vector store** and feeding
them to a model. They are proud of their privacy work: every prompt typed by an agent is run
through a **redaction** filter that strips emails and credit-card numbers before it reaches
the provider. They believe customer PII is contained. It is not.

**Leak 1 — the vector store.** To build the retrieval feature, they embedded the **entire
ticket history**, raw and un-redacted, into a vector database. The embeddings encode real
customer names, addresses, and account details. Redacting the typed prompt does nothing: the
sensitive data was ingested upstream and is now retrievable by anyone who can query the
store — including across the tenant boundary if isolation is weak.

**Leak 2 — the logs.** For debugging, the team logs every full prompt *and* model completion
to their shared observability platform. The redaction filter runs on what the agent types,
but the **retrieved ticket text** — un-redacted PII pulled from the vector store — is
appended to the prompt *after* redaction and flows straight into the logs, readable by a wide
internal audience.

**Leak 3 — the vendor terms.** They assumed zero-retention. The contract actually grants the
provider a 30-day retention window for "abuse monitoring," and processing happens in a region
that violates their data-residency commitment. Nobody verified the agreement.

**The fix.**

- **Classify and redact at ingestion**, not just at the prompt — minimise PII before it ever
  enters the vector store, and isolate embeddings per tenant.
- **Exclude prompts and completions from plain logs**, or redact the *assembled* prompt
  (including retrieved context) before logging.
- **Verify the contract**: confirm zero-retention, residency, and no-train in writing and in
  the API configuration.

**The lesson.** Privacy lives wherever data flows, not only at the keyboard. Redacting the
prompt while the vector store, the logs, and the contract all leak is **redaction theatre** —
each surface needs its own control.
