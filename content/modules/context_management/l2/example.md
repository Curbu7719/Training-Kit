# Worked Example: When Each Strategy's Failure Mode Bites

A team runs an AI assistant that helps analysts work through multi-day data investigations. Three incidents, each exposing a different strategy's failure mode, show why one technique is never universally "safe."

**Incident 1 — summarization drift.** To control tokens, older turns were folded into a running summary, and that summary was itself re-summarized as the case grew. By day three, the constraint "exclude EU-region records for compliance" had been compressed away. The model produced an analysis including EU records. **Lesson:** summarization is lossy, and summaries-of-summaries drift. The fix was to **pin** compliance constraints as protected facts that are never summarized, only carried verbatim.

**Incident 2 — sliding-window amnesia.** A separate session kept only the last 12 turns verbatim with no summary. The analyst's stated goal from turn 1 scrolled out, and the assistant began answering a subtly different question. **Lesson:** sliding window is amnesiac by design. The fix was to pair it with a short persistent summary of goal and decisions.

**Incident 3 — retrieval miss.** Reference policies were served via retrieval. A poorly chunked document split a key rule across two chunks; the retriever returned only the first half, and the model hallucinated the rest. **Lesson:** retrieval moves the risk to retrieval quality — chunking and index freshness now matter. The fix was better chunk boundaries plus a check that returned chunks actually cover the question.

**The combined design.** The team ended with: retrieval for policies (with quality checks), a sliding window for recent dialogue, a running summary for older history, *pinned* non-negotiable constraints, and a **checkpoint** written at end of each day so the next session resumes cleanly.

**Takeaway:** every strategy has a characteristic failure mode. Robust context management combines techniques and protects the facts that must never be lost.
