# RAG in Depth: Tuning Retrieval Over Your Codebase

L1 covered the pipeline: chunk → embed → store → retrieve → augment → generate. At L2 the
question changes. It is no longer *what the steps are*. It is *why a codebase assistant gives
wrong answers* — and almost every failure is a **retrieval** failure, not a generation one. If
the right file never reaches the prompt, even a strong model cannot recover.

**Chunking strategy drives retrieval quality.** Fixed-size chunks are simple, but they cut
across functions. **Structure-aware chunking** splits on function, class, or heading boundaries,
so each chunk stays self-contained. **Overlap** (10–20%) stops a signature or config block that
sits on a boundary from being lost. There is a real tension here. Small chunks give precise
matches but may miss the surrounding context. Large chunks carry context but blur the embedding's
focus and crowd the prompt.

**Retrieval is rarely just "top-k by cosine similarity."** (Cosine similarity is the math that
measures how close two vectors are.) Common refinements:
- **Hybrid search** — combine semantic search (search by meaning) with keyword/BM25 search, so
  exact tokens like a function name, error code, or service name are not lost in pure-meaning
  matching.
- **Re-ranking** — retrieve a generous set of candidates, then use a more precise (but slower)
  model to reorder them and send only the best few onward.
- **Metadata filtering** — limit retrieval by attributes (service, language, branch, doc-vs-code),
  so a question about the `billing` service does not pull in `payments` code.

**Grounding and citations need active enforcement.** Tell the model to answer *only* from the
provided context, and to say "not found" when the context is not enough. Otherwise it falls back
on training memory and invents an API. Attaching the source file path to each chunk lets the
answer cite a real location. It also lets you trace a wrong answer to either bad retrieval or bad
generation.

**Known failure modes:** retrieving the wrong service's near-identical code; the **"lost in the
middle"** effect, where models pay less attention to context buried between passages; **stale
indexes** that serve a function signature a recent refactor already changed; and **chunk-boundary
loss**, where the one line that answers the question was split across two chunks.

## How each role uses this

- **Developer:** Chooses structure-aware chunking. Adds hybrid search and re-ranking. Applies a service/branch metadata filter. Orders context to dodge lost-in-the-middle.
- **Enterprise Architect:** Designs which sources and access levels a given user may retrieve, and the overall retrieval architecture.
- **Infrastructure Engineer:** Owns the vector index/store. Keeps it fresh. Flags where a stale index would mislead.
- **Tester:** Tests retrieval (did the right file come up?) separately from generation (was it used faithfully?). Probes stale-index and boundary-loss modes after each refactor.
- **Project Manager:** Trades retrieval sophistication (re-ranking, hybrid search) against latency and cost. Decides which repos and wikis to index first.
