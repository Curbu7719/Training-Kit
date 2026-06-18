# Streaming & Real-Time Delivery — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The tasting-menu version.** Don't make the client wait for the whole meal. Serve each course the moment it's ready, so they start enjoying it while the kitchen cooks the rest. That's streaming; total cook time is similar, but the wait *feels* gone.
- **The trickle-vs-bucket version.** Request-response hands over one full bucket of water at the end. Streaming opens a tap and lets the water trickle through continuously, from first drop to last.
- **The push-vs-poll version.** Polling is a child asking "are we there yet?" every minute. Real-time push is the driver simply announcing "we've arrived" the instant it happens — no repeated asking, no wasted trips.

## Hint stack

- **H1 — Nudge.** Ask whether the client truly needs the *whole* answer before it can do anything useful. If it can act on the first piece, it shouldn't have to wait for the last.
- **H2 — Direction.** For streaming, keep the connection open and emit each chunk as it's produced; the client appends each chunk as it arrives. For live data, have the server *push* updates the moment they happen instead of the client polling on a timer.
- **H3 — Mechanism.** Plan for the connection dropping mid-stream: detect the break, then reconnect and resume (or surface a clear "connection lost" state). Account for ordering, buffering, and a fast producer outpacing a slow consumer (back-pressure).

## FAQ

**Q: If total time is about the same, why bother streaming?**
A: Perceived performance. Time-to-first-byte collapses from seconds to almost nothing, so the app feels responsive instead of frozen. For long or generated results, that change in *experience* is the entire point even when total time is unchanged.

**Q: When is plain request-response the better choice?**
A: When the result is small, fast, and one-shot. Streaming adds open connections, reconnect/resume logic, ordering and back-pressure concerns — overhead with no payoff if there's nothing meaningful to deliver incrementally.

**Q: What's the difference between streaming and real-time push?**
A: Streaming delivers one logical response *incrementally* over an open connection (the answer arrives in pieces). Real-time push delivers *new events the server decides to send*, unprompted, as they happen — the client never asks. They overlap technically but solve different problems: progressive delivery vs. live updates.
