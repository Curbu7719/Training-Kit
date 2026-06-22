# The Context Window and Managing It

Every LLM has a **context window**: the most text — measured in tokens — it can look at at once. Important: this window covers **both** the input you send (instructions, the conversation so far, any code or spec you paste) **and** the output it writes. If the window is 100,000 tokens and you have pasted 95,000 tokens of source files, only about 5,000 are left for the answer.

**An analogy:** the context window is a whiteboard of fixed size. You can write any part of the codebase or requirements on it, but only so much fits. To add a new file once it is full, you must erase something. And the model can only reason about what is on the board right now.

A second key fact: **each API call is stateless** (the model keeps no memory between calls). The model does not remember your earlier message. Any feeling of an ongoing refactor or a long requirements interview is an illusion. The application creates it by **sending the earlier context again** every call. If you do not send the earlier turns back, they are gone as far as the model is concerned.

So a core engineering question becomes **what to include** in that limited window: the system instructions, the files that matter, the exact spec section needed for *this* request — and what to leave out.

**What happens when you run out?** Either the call is rejected for going over the limit, or older content is dropped and the model quietly loses information — forgetting an instruction or going against an earlier decision in a multi-file change.

Common **strategies** to stay within the window:

- **Summarization** — squeeze an earlier conversation or a long requirements thread into a short recap that keeps the key points.
- **Chunking** — split a large file or document into pieces and handle them one at a time.
- **Retrieval** — store the codebase or docs outside the model and pull in only the few most relevant pieces per request.
- **Sliding window** — keep only the most recent N turns of an interview or session, and let the oldest ones drop off.
- **Checkpointing / handoff** — save a structured summary of progress from time to time, so a refactor (or a session) can continue without sending everything again.

## How each role uses this

- **Developer:** Feeds an AI just the relevant files for a multi-file refactor via retrieval, instead of pasting the whole repo and overflowing the window.
- **Project Manager:** Knows that bigger documents and longer sessions cost more tokens and can hit limits, which shapes feature scope and budget.
- **Tester:** Probes behaviour near and past the limit — very long sessions, huge inputs — to expose quiet context loss.
- **Enterprise Architect:** Chooses retrieval vs summarization vs checkpointing so the system degrades gracefully instead of forgetting quietly.
