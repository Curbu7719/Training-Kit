# RAG in Depth: Tuning Retrieval Over Your Codebase

L1 covered the pipeline: chunk → embed → store → retrieve → augment → generate. At L2 the question shifts from *what the steps are* to *why a codebase assistant gives wrong answers* — and almost every failure is a **retrieval** failure, not a generation one. If the right file never reaches the prompt, even a strong model can't recover.

**Chunking strategy drives retrieval quality.** Fixed-size chunks are simple but cut across functions; **structure-aware chunking** (splitting on function, class, or heading boundaries) keeps each chunk self-contained. **Overlap** (10–20%) prevents a signature or config straddling a boundary from being lost. There's real tension: small chunks give precise matches but may lack surrounding context; large chunks carry context but dilute the embedding's focus and crowd the prompt.

**Retrieval is rarely just "top-k by cosine similarity."** Common refinements:
- **Hybrid search** — combine semantic search with keyword/BM25, so exact tokens like a function name, error code, or service name aren't lost in pure-meaning matching.
- **Re-ranking** — retrieve a generous candidate set, then use a more precise (slower) model to reorder before sending the best few onward.
- **Metadata filtering** — restrict retrieval by attributes (service, language, branch, doc-vs-code) so a question about the `billing` service doesn't pull `payments` code.

**Grounding and citations need active enforcement.** Instruct the model to answer *only* from the provided context and to say "not found" when it's insufficient — otherwise it falls back on training memory and invents an API. Attaching the source file path to each chunk lets the answer cite a real location and lets you trace a wrong answer to either bad retrieval or bad generation.

**Known failure modes:** retrieving the wrong service's near-identical code; the **"lost in the middle"** effect where models attend less to context buried between passages; **stale indexes** serving a function signature that a recent refactor already changed; and **chunk-boundary loss** where the one line that answers the question got split across two chunks.

## How each role uses this

- **Developer:** Chooses structure-aware chunking, adds hybrid search and re-ranking, applies a service/branch metadata filter, and orders context to dodge lost-in-the-middle.
- **Enterprise Architect:** Designs which sources and access levels a given user may retrieve, and the overall retrieval architecture.
- **Infrastructure Engineer:** Owns the vector index/store, keeps it fresh, and flags where a stale index would mislead.
- **Tester:** Separately tests retrieval (did the right file surface?) from generation (was it used faithfully?), and probes stale-index and boundary-loss modes after each refactor.
- **Project Manager:** Trades retrieval sophistication (re-ranking, hybrid search) against latency and cost, and prioritises which repos and wikis to index first.
