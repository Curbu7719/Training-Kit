# Retrieval-Augmented Generation (RAG)

A language model only "knows" what was in its training data, up to a cutoff date. It has never
seen *your* repository, your team's wiki, your coding standards, or last sprint's architecture
decision record. Ask a plain assistant "how do we paginate results in our internal API?" and it
will invent an answer that sounds right but is wrong. **Retrieval-Augmented Generation (RAG)**
fixes this. (Retrieval means fetching the right text.) At question time, RAG fetches relevant
text from your own sources and pastes it into the prompt. So the model answers from those
supplied passages, not from memory. The answer is grounded in *your* codebase and docs — and
far less likely to invent internal APIs.

**An analogy:** an open-book exam. A closed-book student answers from memory and may misremember.
Give them the right pages, and the answer comes straight from the text — and they can point to
the file they used.

The pipeline has six steps in two phases. **Indexing (done ahead of time):** (1) **chunk** your
repo, wiki, and API docs into passages of a few hundred words each; (2) **embed** each chunk —
turn it into a vector, which is a list of numbers that captures its meaning; (3) **store** those
vectors in a vector index. **Query time:** (4) **retrieve** — embed the developer's question and
pull the top-k chunks whose vectors are most similar (top-k means the few closest matches); (5)
**augment** — put those chunks into the prompt; (6) **generate** — the model writes an answer
using them.

**Embeddings and similarity** are the heart of retrieval. Text with a similar meaning lands at
nearby points in vector space. So "how do I retry a failed job?" can retrieve a wiki page titled
"Backoff and re-queue policy", even though they share no words.

**Chunking is a trade-off.** Chunks that are too large dilute relevance and waste prompt space.
Chunks that are too small split a function or a config block in the middle of a thought. A
sensible overlap keeps code and sentences from being cut in awkward places.

Finally, **citations and grounding**: because each chunk traces back to a file or wiki page, the
assistant can show *where* an answer came from. So a developer can open the real source and check
it.

## How each role uses this

- **Developer:** Builds and tunes the pipeline so an in-IDE assistant answers codebase questions from real files — chunk size, embedding model, top-k, and how retrieved code is formatted into the prompt.
- **Enterprise Architect:** Designs the retrieval architecture and which sources answers may be grounded on.
- **Tester:** Checks that answers cite real internal sources and follow the team's patterns. Tests that the right files come up.
- **Project Manager:** Uses a RAG assistant to query past design decisions and roadmap docs during scoping, instead of re-reading every old spec by hand.
