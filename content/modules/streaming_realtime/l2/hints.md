# Streaming & Real-Time (L2) — Hints & Alternative Explanations

## Alternative phrasings of the deeper idea

- **Connections are inventory, not throughput.** Request-response scales on requests-per-second; push scales on *concurrent open connections*. Each connection is held inventory — memory and a concurrency slot pinned for the whole session. Size your capacity by connection count.
- **The happy path is the easy 20%.** Anyone can stream when nothing breaks. The real work is mid-stream drops, duplicate delivery, out-of-order events, and a fast producer flooding a slow consumer. Design those first.
- **Push is a cost, justify it.** Polling is the simpler default. Push earns its complexity only when low latency genuinely matters *and* updates are frequent enough that polling would waste effort. Otherwise the humble poll wins.

## Hint stack

- **H1 — Nudge.** Before choosing push, ask two questions: does anyone make a *time-sensitive decision* off this data, and does it change *often enough* that polling would be wasteful? If either answer is no, polling is probably the better engineering choice.
- **H2 — Direction.** If you do stream, design the failure paths first: expose a cursor / last-event-id so clients can resume, make consumers idempotent so replays are harmless, and add sequence numbers if ordering matters.
- **H3 — Mechanism.** Decide a back-pressure policy explicitly — buffer (bounded, or you risk running out of memory), drop (lossy, fine for some live metrics), or slow the producer to the consumer's pace. And budget capacity by concurrent connections, not requests per second.

## FAQ

**Q: It's live data — isn't real-time push always the right call?**
A: No. "Live" describes the data, not the required mechanism. If updates are infrequent or no one needs millisecond freshness, polling at a sane interval is simpler, cheaper, and far more resilient to flaky networks. Reserve push for genuinely latency-sensitive, high-frequency cases.

**Q: Why must streaming consumers be idempotent?**
A: Reconnects and at-least-once delivery mean a client can receive the same event more than once. If applying an event twice corrupts state (double-counting, duplicate side effects), reconnection becomes a source of bugs. Idempotency makes a replayed event harmless, which is what makes resume safe.

**Q: What is back-pressure and why can't I ignore it?**
A: It's the situation where the producer outpaces the consumer. Ignoring it forces an implicit choice: unbounded buffering (a memory/DoS risk), silent data loss, or a stalled connection. Choosing the policy deliberately — bound the buffer, drop intentionally, or slow the producer — is part of designing any serious stream.
