# Streaming & Real-Time Delivery — Concept

## The core idea

In the classic **request-response** model, a client asks for something and waits, doing nothing useful, until the *entire* answer is ready. Then the whole thing arrives at once.

**Streaming** breaks that pattern. Instead of waiting for the complete result, the server sends the answer **incrementally — piece by piece, as each piece is produced.** The client starts using the first chunk while the rest is still being made. The connection stays open and data flows over it as a continuous trickle rather than one big delivery.

Closely related is **real-time push**: the server doesn't wait to be asked at all. When something new happens, it pushes the update to connected clients immediately, instead of clients having to poll ("anything new yet? ... anything new yet?") on a timer.

## A real-world analogy

Request-response is ordering a meal and being served only when *every* dish is plated — you stare at an empty table until then. Streaming is a tasting menu: each course arrives the moment it's ready, and you start eating while the kitchen cooks the next. Real-time push is a waiter who, without you asking, immediately brings out anything new the kitchen sends.

## When streaming or push wins

- **Long or large results.** Generating a big report, or text from a language model — the user sees progress immediately instead of a frozen spinner.
- **Live data.** Prices, scores, sensor readings, chat messages, presence indicators — anything where "now" matters.
- **Perceived speed.** Time-to-first-byte drops dramatically even if total time is similar; the experience feels far more responsive.

## What it costs

Streaming and push are not free. Open connections **consume server resources** for their whole lifetime. Failures are **harder to handle**: a connection can drop mid-stream, so you need reconnection and resume logic. Ordering, buffering, and back-pressure (a fast producer overwhelming a slow consumer) all become your problem. For small, quick, one-shot results, plain request-response is simpler and entirely sufficient.
