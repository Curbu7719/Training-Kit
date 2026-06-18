# Hints — Security & Privacy (L2)

## Alternative phrasings of the core idea

- Governing AI privacy means tracing every data flow from a developer's keyboard to a vendor's
  training set, binding controls to data classification, and verifying retention, residency,
  and no-train as contract terms rather than assumptions.
- Privacy lives wherever data flows — prompts, logs, caches, vector stores, multi-tenant
  context — so redacting only the typed prompt is "redaction theatre" if the other surfaces
  leak.
- Mature programs classify data, bind AI usage rules to each tier, verify vendor terms,
  control every leak surface, and run continuous monitoring and red-teaming.

## Hint stack

- **H1 (nudge):** The typed prompt is rarely the only place sensitive data goes. Where else
  does it flow — what gets embedded, cached, logged, or shared across tenants?
- **H2 (structural):** Separate the surfaces: ingestion (vector store / embeddings), the
  assembled prompt (retrieved context added *after* redaction), the logs/observability stack,
  and the vendor contract (retention, residency, training). Each needs its own control.
- **H3 (near-answer):** Redacting the typed prompt while the vector store holds raw PII, the
  logs capture the assembled prompt, and the contract allows 30-day retention is redaction
  theatre. Classify and redact at ingestion, exclude assembled prompts from plain logs, and
  verify the contract.

## FAQ

**Q: We redact every prompt. Isn't PII contained?**
Only if the prompt is the only flow. Embeddings in a vector store, retrieved context appended
after redaction, and prompts copied into logs are all separate surfaces that can leak raw PII.

**Q: Why does data classification come first?**
Because you cannot enforce a rule you can't express. Tagging data (public, confidential,
regulated) lets you bind specific AI usage rules to each tier instead of relying on judgement.

**Q: How do I actually trust a "zero-retention" claim?**
Verify it in the signed agreement and the API configuration, check the processing region for
residency, and confirm sub-processors and any abuse-monitoring retention window. Free and
enterprise tiers of the same product often differ.

**Q: What is multi-tenant data bleed?**
When weak isolation lets one customer's data — through shared context, caches, or embeddings —
surface in another customer's session. Tenant-scoped isolation and per-tenant stores prevent it.
