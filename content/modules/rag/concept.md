# Retrieval-Augmented Generation (RAG)

A language model only "knows" what was in its training data, up to a cutoff date. It has never seen *your* repository, your team's wiki, your coding standards, or last sprint's architecture decision record. Ask a plain assistant "how do we paginate results in our internal API?" and it will invent a plausible-but-wrong endpoint. **Retrieval-Augmented Generation (RAG)** fixes this by fetching relevant text from your own sources at question time and pasting it into the prompt, so the model answers from those supplied passages instead of from memory. The result is grounded in *your* codebase and docs — and far less prone to hallucinating internal APIs.

**An analogy:** an open-book exam. A closed-book student answers from memory and may misremember. Give them the relevant pages and the answer comes straight from the text — and they can point to the file they used.

The pipeline has six steps in two phases. **Indexing (done ahead of time):** (1) **chunk** your repo, wiki, and API docs into passages a few hundred words each; (2) **embed** each chunk — turn it into a vector, a list of numbers that captures its meaning; (3) **store** those vectors in a vector index. **Query time:** (4) **retrieve** — embed the developer's question and pull the top-k chunks whose vectors are most similar; (5) **augment** — insert those chunks into the prompt; (6) **generate** — the model writes an answer using them.

**Embeddings and similarity** are the heart of retrieval. Text with similar meaning lands at nearby points in vector space, so "how do I retry a failed job?" retrieves a wiki page titled "Backoff and re-queue policy" even with no shared words.

**Chunking is a trade-off.** Chunks too large dilute relevance and waste prompt space; too small split a function or a config block mid-thought. Sensible overlap keeps code and sentences from being cut awkwardly.

Finally, **citations and grounding**: because each chunk traces back to a file or wiki page, the assistant can show *where* an answer came from — so a developer can open the actual source and verify it.

## How each role uses this

- **Developer:** Builds and tunes the pipeline so an in-IDE assistant answers codebase questions from real files — chunk size, embedding model, top-k, and how retrieved code is formatted into the prompt.
- **Enterprise Architect:** Designs the retrieval architecture and which sources answers may be grounded on.
- **Tester:** Verifies answers cite real internal sources and follow the team's patterns, and tests that the right files surface.
- **Project Manager:** Queries past design decisions and roadmap docs through a RAG assistant during scoping, instead of re-reading every old spec by hand.
