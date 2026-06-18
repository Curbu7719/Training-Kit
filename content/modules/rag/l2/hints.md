# Hints & FAQ (L2)

## Alternative phrasings

- At L2, treat RAG quality as mostly a **retrieval** problem: if the right passage never reaches the prompt, the model cannot answer correctly no matter how good it is.
- Think of advanced RAG as layering filters and re-rankers on top of plain similarity search — narrowing a broad candidate set down to the few passages that truly answer the question.
- Grounding is something you *enforce*, not something you get for free: instruct the model to use only the supplied context and to admit when it isn't there.

## Hint stack

- **H1 (nudge):** When a RAG answer is wrong, decide first: did the right chunk get *retrieved*, or did the model fail to *use* a correct chunk? These have different fixes.
- **H2 (structure):** Retrieval failures are fixed in the retrieval layer — chunking, metadata filtering, hybrid search, re-ranking, freshness of the index. Generation failures are fixed with prompt instructions to ground and cite. Diagnose by logging the actual top-k chunks.
- **H3 (near-answer):** If two near-identical chunks differ only by an attribute (region, date, product), add a **metadata filter** plus **hybrid search** so the exact distinguishing term is weighted; then **re-rank** so the on-point chunk rises into the top-k. A wrong-but-cited answer usually means retrieval surfaced the wrong source.

## FAQ

**What is hybrid search?** Combining semantic (embedding) similarity with keyword/BM25 matching. Semantic search captures meaning; keyword search preserves exact terms like codes, IDs, or region names that pure embeddings may underweight.

**What is re-ranking?** Retrieve a larger candidate set cheaply, then apply a slower, more accurate model to reorder them, sending only the best few to the generator. It trades a bit of latency for noticeably better precision.

**What is the "lost in the middle" effect?** Models tend to attend most to context at the start and end of the prompt and least to passages buried in the middle. Ordering the most relevant chunks at the edges mitigates it.

**Why can a citation reveal a retrieval bug?** If the answer cites a real but wrong source, generation faithfully used what it was given — the error is that retrieval supplied the wrong chunk.
