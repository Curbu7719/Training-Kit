# Streaming & Real-Time (L2) — Worked Example

## Choosing push vs. polling for a status dashboard

A team builds an internal dashboard showing the status of background jobs. Most jobs finish in minutes; a few run for hours. They reach for real-time push by reflex — "live data, so stream it." Then they think through the trade-offs.

**The push design.** Every open dashboard holds a persistent connection. The server pushes a message whenever any job's status changes. Pros: updates appear instantly. Cons that surface on inspection:

- **Resource cost.** Dozens of teammates leave the dashboard open in background tabs all day. That's dozens of idle-but-pinned connections, each consuming server memory and a concurrency slot, for data that changes only a handful of times an hour.
- **Reconnect complexity.** Laptops sleep and Wi-Fi drops constantly. Every wake triggers a reconnect, and the client must re-sync missed status changes — needing a cursor and idempotent updates so a replayed "job finished" event doesn't double-count.
- **Low urgency.** Nobody is making a millisecond-sensitive decision off this dashboard. A status that's ten seconds stale is completely fine.

**The polling design they chose instead.** The client requests the current job list every ten seconds. It's stateless, trivially cacheable, and a dropped network just means one skipped poll with automatic recovery on the next tick. No persistent connections, no cursor, no idempotency machinery.

**Where they kept push.** One screen *does* need it: the live log tail of a single running job a developer is actively debugging. There, latency matters and the user is staring at it in real time — so push earns its complexity for that one focused case.

**The lesson:** "it's live data" does not automatically mean "use push." Match the mechanism to **urgency and update frequency**. Reserve persistent connections for where low latency genuinely pays for its cost; let humble polling handle the rest.
