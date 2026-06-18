# Worked Example: When Each Strategy's Failure Mode Bites (Maintenance Phase)

**Phase: Maintenance — a multi-day legacy migration.** A team runs an AI assistant to migrate a service from a deprecated framework to its successor. Three incidents, each exposing a different strategy's failure mode, show why one technique is never universally "safe."

**Incident 1 — summarization drift.** To control tokens, older turns of the migration were folded into a running summary, which was itself re-summarized as the work grew. By day three, the rule "preserve the public `/v1/orders` response shape for backward compatibility" had been compressed away. The model changed the response schema, breaking downstream consumers. **Lesson:** summarization is lossy, and summaries-of-summaries drift. The fix: **pin** backward-compatibility rules as protected facts carried verbatim, never summarized.

**Incident 2 — sliding-window amnesia.** A second session kept only the last 12 turns verbatim with no summary. The migration's stated goal from turn 1 (move auth to the new middleware, leave routing untouched) scrolled out, and the assistant began rewriting routing too. **Lesson:** sliding window is amnesiac by design. The fix: pair it with a short persistent summary of goal and scope.

**Incident 3 — retrieval miss.** Source files were served to the model via retrieval. A poorly chunked file split a validation function across two chunks; the retriever returned only the first half, and the model hallucinated the rest, producing code that compiled but skipped a check. **Lesson:** retrieval moves the risk to retrieval quality — chunk boundaries and index freshness now matter. The fix: align chunks to function boundaries plus a check that retrieved chunks cover the symbol being edited.

**The combined design.** The team ended with: retrieval for source files (with quality checks), a sliding window for recent dialogue, a running summary for older history, *pinned* compatibility and scope rules, and a **checkpoint** written at the end of each day so the next session resumes cleanly.

**Takeaway:** every strategy has a characteristic failure mode. Robust context management combines techniques and protects the facts that must never be lost.
