# The Context Window and Managing It

Every LLM has a **context window**: the maximum amount of text — measured in tokens — it can consider at once. Crucially, this window covers **both** the input you send (instructions, the conversation so far, any code or spec you paste) **and** the output it generates. If the window is 100,000 tokens and you've pasted 95,000 tokens of source files, only ~5,000 are left for the answer.

**An analogy:** the context window is a whiteboard of fixed size. You can write any part of the codebase or requirements on it, but only so much fits. To add a new file once it's full, you must erase something — and the model can only reason about what is currently on the board.

A second essential fact: **each API call is stateless**. The model does not remember your previous message. Any sense of an ongoing refactor or a long requirements interview is an illusion created by the application **re-supplying the prior context** every call. If you don't send the earlier turns back, they're gone as far as the model is concerned.

So a core engineering question becomes **what to include** in that limited window: the system instructions, the relevant files, the specific spec section needed for *this* request — and what to leave out.

**What happens when you run out?** Either the call is rejected for exceeding the limit, or older content is dropped and the model silently loses information — forgetting an instruction or contradicting an earlier decision in a multi-file change.

Common **strategies** to live within the window:

- **Summarization** — compress an earlier conversation or a long requirements thread into a short recap that preserves the essentials.
- **Chunking** — split a large file or document into pieces and process them one at a time.
- **Retrieval** — store the codebase or docs externally and pull in only the few most relevant pieces per request.
- **Sliding window** — keep only the most recent N turns of an interview or session, letting the oldest fall away.
- **Checkpointing / handoff** — periodically save a structured summary of progress so a refactor (or a session) can continue without resending everything.

## How each role uses this

- **Developer:** Feeds an AI just the relevant files for a multi-file refactor via retrieval, instead of pasting the whole repo and overflowing the window.
- **Project Manager:** Knows that bigger documents and longer sessions cost more tokens and can hit limits, which shapes feature scope and budget.
- **Tester:** Probes behaviour near and past the limit — very long sessions, huge inputs — to expose silent context loss.
- **Enterprise Architect:** Chooses retrieval vs summarization vs checkpointing so the system degrades gracefully instead of forgetting silently.
