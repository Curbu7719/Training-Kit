# Abstraction & Swappability (L2) — Worked Example

## When the abstraction leaks: two "interchangeable" caches

A team puts a cache behind a clean contract so they can swap implementations:

```
Cache.get(key) -> value | null
Cache.set(key, value, ttl) -> void
```

They start with an **in-process cache** (a map living inside the application). Later they swap in a **distributed cache** (a separate networked service) by writing a new adapter. Same signatures, one-line config change. The swap "works" — and then production behaves strangely.

**What leaked, even though the shapes matched:**

- **Consistency.** The in-process cache was per-instance: each server had its own copy, and a `set` on one was invisible to others. Code had quietly relied on that isolation. The distributed cache is *shared*, so one request now overwrites another's entry — a correctness change the signature never revealed.
- **Failure mode.** The in-process `get` could never fail. The networked `get` can time out. Callers had no error handling because the original contract never *needed* any.
- **Latency & limits.** Microsecond local reads became millisecond network reads, and the distributed service rejected values above a size the local map happily accepted.

**The fix is to make the contract honest about behaviour, not just shape.** The team amended the contract to promise: reads may fail (callers must degrade gracefully), entries are shared across instances, and values have a maximum size. They updated callers to handle those realities — and only *then* were the two caches truly swappable.

**The deeper lesson:** matching method signatures is necessary but not sufficient. Real swappability requires that every adapter honour the same *behavioural* promises — consistency, failure modes, and limits — or the seam silently breaks the callers it was meant to protect.
