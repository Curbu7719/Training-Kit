# Worked Example: A Codebase Q&A Assistant for the Dev Team

**SDLC phase: Coding / Maintenance.** A platform team maintains a large service and a 400-page internal wiki. New engineers keep asking the same questions in chat — "how do we authenticate service-to-service calls?" — and a plain LLM assistant invents endpoints that don't exist. The team wants an assistant that answers using only *their* code and docs. Here's how RAG delivers it.

**Indexing (run once, ahead of time, refreshed on each merge).** The repo source files, the wiki, and the API reference are split into chunks of roughly 300 words (or one function/section), with a 50-word overlap so a function signature spanning a boundary isn't lost. That yields about 6,000 chunks. Each chunk is passed through an embedding model, producing a vector that encodes its meaning. Every vector is stored in a vector index, tagged with its source file path and the wiki page URL.

**Query time.** A new developer asks: *"How do I make an authenticated call to the billing service?"*

1. **Embed the question** using the same embedding model.
2. **Retrieve top-k (k=4).** The index returns the four closest chunks. The top match comes from `auth/service_client.py` and a wiki page titled *"Internal mTLS setup,"* even though neither uses the exact phrase "billing service" — semantic similarity surfaced them.
3. **Augment the prompt.**
   > Answer using only the context below. Cite the file or wiki page.
   > Context: [chunk 1] [chunk 2] [chunk 3] [chunk 4]
   > Question: How do I make an authenticated call to the billing service?
4. **Generate.** The model replies: *"Use `ServiceClient.for('billing')`, which loads the mTLS cert from the secrets mount. (Source: `auth/service_client.py`; wiki: Internal mTLS setup.)"*

**Why this works.** The answer is grounded in real, current code and carries a citation the developer can open and verify. If no chunk had been relevant, a well-designed prompt would have the model reply "I couldn't find this in our codebase" rather than inventing an endpoint. Merge a refactor, re-index those chunks, and the assistant's answers update too — no retraining required.
