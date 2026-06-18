# Retrieval-Augmented Generation (RAG)

A language model only "knows" what was in its training data, up to a cutoff date. It has never seen your company's internal wiki, last week's pricing sheet, or a customer's support history. **Retrieval-Augmented Generation (RAG)** fixes this by fetching relevant text from your own data at question time and pasting it into the prompt, so the model answers from those supplied passages instead of from memory alone. The result is grounded in *your* fresh, proprietary information — and far less prone to hallucination, because the model has the facts right in front of it.

**An analogy:** an open-book exam. A closed-book student answers from memory and may misremember. Give them the relevant pages and the answer comes straight from the text — and they can point to the paragraph they used.

The pipeline has six steps, done in two phases. **Indexing (done ahead of time):** (1) **chunk** your documents into passages a few hundred words each; (2) **embed** each chunk — turn it into a vector, a list of numbers that captures its meaning; (3) **store** those vectors in a vector index. **Query time:** (4) **retrieve** — embed the user's question and pull the top-k chunks whose vectors are most similar; (5) **augment** — insert those chunks into the prompt; (6) **generate** — the model writes an answer using them.

**Embeddings and similarity** are the heart of retrieval. Text with similar meaning lands at nearby points in vector space, so "How do I reset my password?" retrieves a chunk titled "Account recovery steps" even with no shared words. Retrieval ranks chunks by this semantic closeness, not keyword overlap.

**Chunking is a trade-off.** Chunks too large dilute relevance and waste prompt space; too small lose context and split ideas mid-thought. Sensible overlap between chunks keeps sentences from being cut awkwardly.

Finally, **citations and grounding**: because each retrieved chunk traces back to a source document, a RAG system can show *where* an answer came from. That makes answers verifiable and builds trust — and lets you tell when the model strayed beyond its sources.

## How each role uses this

- **Developer/Engineer:** Builds and tunes the pipeline — chunk size and overlap, embedding model, top-k, and how retrieved text is formatted into the prompt.
- **Business Analyst:** Identifies which knowledge sources to ground on and frames where stale or missing data would create wrong answers.
- **PM/Product Owner:** Scopes RAG as the path to "answers from our own up-to-date content," and weighs indexing cost and freshness against accuracy needs.
- **QA & Architect:** Tests retrieval quality and groundedness — checking answers cite real sources and don't invent facts beyond the retrieved chunks.
