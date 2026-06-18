# Hints & Alternative Phrasings (L2)

## Alternative phrasings of the core idea

- **One sentence:** Every context strategy buys space at a price — summarization loses fidelity, sliding window forgets early rules, retrieval depends on retrieving the right files, checkpointing depends on capturing the right migration state — so you choose by which failure mode you can tolerate.
- **Another angle:** There is no "safe" single technique for an AI-assisted refactor. Robust systems combine strategies and explicitly protect the rules (compatibility constraints, scope) that must never be dropped.
- **Risk framing:** Picking a strategy is picking a failure mode. Make that choice deliberately, then test for exactly that failure.

## Progressive hint stack

- **H1:** For each strategy, ask "what does this silently lose?" Summarization loses detail; sliding window loses early turns; retrieval can fetch the wrong/no file; checkpoints can omit in-flight decisions.
- **H2:** Match the failure mode to the symptom. A compatibility rule stated early that gets violated late → it scrolled out (sliding window) or was compressed away (summarization). Code pulled from thin air → retrieval missed or chunking split a function. A resumed session redoing finished work → an incomplete checkpoint.
- **H3:** The strongest answers usually *combine* strategies and *pin* non-negotiable rules so they're never summarized or dropped. Also remember position effects (lost-in-the-middle — place critical files near the edges) and reserving output headroom — a bigger window alone is not the fix.

## FAQ

**Q: Isn't a much larger context window a simpler fix than all this?**
A: It helps but isn't a cure. Larger windows cost more and add latency on frequent calls, models can attend less reliably to mid-context files, and you still must reserve room for the generated output. Strategy still matters.

**Q: Why do summaries get worse over a long migration?**
A: Summarizing a prior summary compounds loss — each round drifts further from the source. Protect critical rules (backward-compatibility, scope) by pinning them verbatim instead of letting them be re-summarized.

**Q: My retrieval-based code assistant sometimes writes confident but wrong code. Why?**
A: Likely a retrieval miss — wrong, partial, or stale files. The model then fills the gap by hallucinating. Align chunk boundaries to functions, refresh the index after edits, and verify retrieved chunks cover the symbol you're changing.
