# The Context Window and Managing It

Every LLM has a **context window**: the maximum amount of text — measured in tokens — it can consider at once. Crucially, this window covers **both** the input you send (your instructions, the conversation so far, any supplied documents) **and** the output the model generates. If the window is, say, 100,000 tokens and your input already fills 95,000, only about 5,000 tokens are left for the answer.

**An analogy:** the context window is a whiteboard of fixed size. You can write anything on it, but only so much fits. To add something new once it's full, you must erase something — and the model can only reason about what is currently on the board, never what was wiped off.

A second essential fact: **each API call is stateless**. The model does not "remember" your previous message. Any sense of an ongoing conversation is an illusion created by the application **re-supplying the prior context** with every call. If you don't send the earlier turns back, they're gone as far as the model is concerned.

So a core engineering question becomes **what to include** in that limited, re-sent window: the system instructions, the most relevant prior turns, the specific documents or data needed for *this* request — and what to leave out.

**What happens when you run out?** Either the call is rejected for exceeding the limit, or older content gets dropped/truncated and the model silently loses information — leading to forgotten instructions or contradictory answers.

Common **strategies** to live within the window:

- **Summarization** — compress earlier conversation or documents into a short recap that preserves the essentials.
- **Chunking** — split a large document into pieces and process them one at a time.
- **Retrieval** — store information externally and pull in only the few most relevant pieces per request.
- **Sliding window** — keep only the most recent N turns, letting the oldest fall away.
- **Checkpointing / handoff** — periodically save a structured summary of progress so work can continue (or transfer to another session) without resending everything.

## How each role uses this

- **Developer/Engineer:** Builds the call so context is re-supplied each request and stays under the limit, choosing summarization, retrieval, or a sliding window per use case.
- **Business Analyst:** Identifies which inputs are truly essential to a task, so prompts carry the right data and don't waste the window on irrelevant material.
- **PM/Product Owner:** Understands that longer conversations and bigger documents cost more tokens and may hit limits, shaping feature scope and budget expectations.
- **QA & Architect:** Tests behavior near and past the context limit (long chats, huge inputs) and chooses an architecture — retrieval vs summarization vs checkpointing — that degrades gracefully.
