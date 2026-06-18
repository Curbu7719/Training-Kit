# Hints & FAQ (L2)

## Alternative phrasings

- At L2, treat a codebase assistant's quality as mostly a **retrieval** problem: if the right file never reaches the prompt, the model can't answer correctly no matter how good it is.
- Think of advanced RAG as layering filters and re-rankers on top of plain similarity search — narrowing a broad candidate set down to the few files that truly answer the question.
- Grounding is something you *enforce*, not get for free: instruct the model to use only the supplied code and to admit when the answer isn't there rather than invent an API.

## Hint stack

- **H1 (nudge):** When a codebase answer is wrong, decide first: did the right file get *retrieved*, or did the model fail to *use* a correct file? These have different fixes.
- **H2 (structure):** Retrieval failures are fixed in the retrieval layer — chunking, metadata filtering (service/branch), hybrid search, re-ranking, index freshness. Generation failures are fixed with prompt instructions to ground and cite. Diagnose by logging the actual top-k chunks.
- **H3 (near-answer):** If two near-identical chunks differ only by an attribute (which service, which branch), add a **metadata filter** plus **hybrid search** so the exact distinguishing token is weighted; then **re-rank** so the on-point chunk rises into top-k. A wrong-but-cited answer usually means retrieval surfaced the wrong source.

## FAQ

**What is hybrid search?** Combining semantic (embedding) similarity with keyword/BM25 matching. Semantic search captures meaning; keyword search preserves exact tokens like function names, error codes, or service names that pure embeddings may underweight.

**What is re-ranking?** Retrieve a larger candidate set cheaply, then apply a slower, more accurate model to reorder them, sending only the best few to the generator. It trades a little latency for noticeably better precision.

**What is the "lost in the middle" effect?** Models tend to attend most to context at the start and end of the prompt and least to passages buried in the middle. Ordering the most relevant chunks at the edges mitigates it.

**Why can a citation reveal a retrieval bug?** If the answer cites a real but wrong file (e.g., the `payments` service instead of `billing`), generation faithfully used what it was given — the error is that retrieval supplied the wrong chunk.
