# Streaming & Real-Time (L2) — Trade-offs and Edge Cases

L1 covered *what* streaming and push are and *when* they help. L2 is about the hard parts: the failure modes, the resource economics, and the cases where real-time is the **wrong** answer.

## The connection is a liability, not just a feature

An open connection is state the server must hold for the client's entire session. At scale this flips the economics: serving 100,000 idle-but-connected clients can cost more than serving 100,000 quick request-response calls, because each connection pins memory and a slot in your concurrency budget. Request-response lets the server forget you the instant it replies; streaming and push do not. **Plan capacity around concurrent connections, not requests per second.**

## Failure and resume are the real design work

Happy-path streaming is easy. The engineering is in the unhappy paths:

- **Mid-stream drop.** The client must detect the break and decide: resume from where it left off, or restart? Resuming requires the server to expose a cursor / last-event-id so the client can say "send me everything after X."
- **Duplicate delivery.** After a reconnect the client may receive an event it already saw. Push systems are often *at-least-once*, so consumers must be **idempotent** — applying the same event twice must be harmless.
- **Ordering.** Across reconnects or multiple connections, events can arrive out of order. If order matters, you need sequence numbers and client-side reordering.

## Back-pressure: the producer-consumer mismatch

If the server produces faster than the client (or network) can absorb, something must give. Either the server **buffers** (consuming unbounded memory — a denial-of-service risk), **drops** data (lossy, sometimes acceptable for live metrics), or **slows down** to the consumer's pace (back-pressure done right). Choosing the policy is a real decision, not a default.

## Push vs. polling — and when polling wins

Real-time push isn't automatically superior. **Smart polling at a sane interval** is simpler, statelessly cached, and survives flaky networks gracefully. Push earns its complexity only when **latency genuinely matters** (live trading, collaborative editing, alerts) *and* update frequency is high enough that polling would be wasteful. For data that changes every few minutes, a periodic poll is often the better engineering choice.

## When NOT to stream

- The result is **small and fast** — there's nothing meaningful to deliver incrementally.
- Updates are **rare or non-urgent** — polling is simpler and cheaper.
- You **can't afford** the per-connection resource cost at your scale.
- Clients are on **hostile networks** where holding a long connection open is itself unreliable, and a retry-friendly request-response fits better.
