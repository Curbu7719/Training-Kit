# RAG in Depth: Tuning Retrieval and Grounding

L1 covered the pipeline: chunk → embed → store → retrieve → augment → generate. At L2 the question shifts from *what the steps are* to *why RAG answers go wrong* — and almost every failure is a **retrieval** failure, not a generation one. If the right passage never reaches the prompt, even a strong model can't recover.

**Chunking strategy drives retrieval quality.** Fixed-size chunks are simple but cut across ideas; **semantic or structure-aware chunking** (splitting on headings, paragraphs, or sentence boundaries) keeps each chunk self-contained. **Overlap** (e.g., 10–20%) prevents a fact straddling a boundary from being lost. There's a real tension: small chunks give precise matches but may lack surrounding context; large chunks carry context but dilute the embedding's focus and crowd the prompt.

**Retrieval is rarely just "top-k by cosine similarity."** Common refinements:
- **Hybrid search** — combine semantic (embedding) search with keyword/BM25 search, so exact terms like product codes or error numbers aren't lost in pure-meaning matching.
- **Re-ranking** — retrieve a generous candidate set, then use a more precise (slower) model to reorder the top results before sending the best few onward.
- **Metadata filtering** — restrict retrieval by attributes (product, language, date, access level) so users only see chunks they're entitled to and that are current.

**Grounding and citations need active enforcement.** Instruct the model to answer *only* from the provided context and to say "not found" when context is insufficient — otherwise it falls back on training memory and may hallucinate. Attaching source IDs to each chunk lets the answer cite specifics and lets you trace a wrong answer to either bad retrieval or bad generation.

**Known failure modes:** retrieving irrelevant chunks (poor embeddings or chunking); the **"lost in the middle"** effect where models attend less to context buried between other passages; stale indexes serving outdated facts; and **chunk-boundary loss** where the one sentence that answers the question got split across two chunks neither of which fully contains it.

## How each role uses this

- **Developer/Engineer:** Chooses chunking strategy, adds hybrid search and re-ranking, applies metadata filters, and orders context to dodge the lost-in-the-middle effect.
- **Business Analyst:** Maps access rules and data freshness to metadata filters, ensuring the right users retrieve the right, current chunks.
- **PM/Product Owner:** Trades off retrieval sophistication (re-ranking, hybrid search) against latency and cost, and prioritizes which knowledge sources to index first.
- **QA & Architect:** Separately tests retrieval (did the right chunk surface?) from generation (was it used faithfully?), and probes stale-index and boundary-loss failure modes.
