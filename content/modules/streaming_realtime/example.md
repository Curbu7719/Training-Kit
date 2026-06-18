# Streaming & Real-Time Delivery — Worked Example

## Streaming a generated answer, token by token

A user asks an assistant a question that takes several seconds to answer in full. The team must decide how to deliver the response.

**Request-response version.** The client sends the question and waits. For four or five seconds the screen shows a spinner and nothing else. Then the entire answer appears at once. The result is correct, but the wait feels long and the app feels frozen.

**Streaming version.** The client opens a streaming connection and sends the question. The server begins producing the answer and, instead of holding it back, emits each small chunk the instant it's ready:

1. The user clicks **Send**; the client opens a stream to the server and submits the question.
2. The server starts generating and emits the first chunk of text.
3. The client receives that chunk and **immediately appends it to the screen** — the user sees words appearing within a fraction of a second.
4. The server keeps emitting chunks; the client keeps appending each one as it arrives.
5. When the answer is complete, the server sends a final **"done"** marker and closes the stream.
6. The client sees the marker and finalises the message (enables the copy button, stops the typing indicator).

**The payoff.** Total generation time is roughly the same, but *time-to-first-word* drops from seconds to almost nothing. The user reads along as the answer forms, the app feels alive, and a long wait becomes an engaging one.

**The cost the team accepts.** The connection stays open for the whole answer, and they must handle it dropping mid-stream — detect the break, and either resume or show a clear "connection lost, retry" state rather than a half-finished message with no explanation.
