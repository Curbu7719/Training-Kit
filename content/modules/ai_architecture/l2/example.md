# Worked Example: Make Your AI Helper Survive a Bad Day

Your release-notes helper works — until the model provider has an outage, rate-limits you, or returns garbage mid-release. At depth, architecture is about how the pieces *fail* and how you keep working anyway. Here's how a few reliability patterns mean a provider's bad day isn't yours.

**The abstraction earns its keep on failure.** Because the model sits behind an internal interface, you can add a **fallback** — primary provider down, fail over to a secondary — without touching the feature. *Why does this make your day easier?* Your release doesn't stop because one vendor is having an incident; the helper quietly switches and keeps drafting.

**Design for the remote call to misbehave.** Provider APIs time out, rate-limit, and sometimes return malformed output. *The patterns:* a **timeout** on every call, **retries with backoff** for transient errors, a **circuit breaker** so a failing provider doesn't cascade. *Why bother?* Without them, one slow call hangs your tool; with them, it degrades gracefully instead of freezing.

**Have a degraded mode.** When everything's struggling, you fall back to a cheaper backup model or a cached answer rather than a hard error. *Why use AI this way?* A slightly-less-polished draft beats a red error screen on release day — the helper stays useful at its worst, not just its best.

**Roll out changes safely.** A new prompt or model goes out behind a flag, to a fraction of runs first, watched against your evals. *Why?* So a regression hits one canary release note, not every team's, and you can roll back in one switch.

**The takeaway:** at depth, the question isn't "does it work?" but "what happens when the provider doesn't?" Fallbacks, timeouts, retries, a degraded mode, and safe rollout are what turn a helper that works on good days into one you trust on bad ones.
