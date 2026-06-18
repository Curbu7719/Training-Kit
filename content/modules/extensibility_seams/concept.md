# Extensibility Seams — Concept

A **seam** is a place in a system where you can change behavior *without* rewriting what's around it. The term comes from clothing: a tailor lets out a seam to resize a garment without re-cutting the whole fabric. In software, a seam is a deliberate gap — an interface, a configuration value, a plugin slot, an event hook — where new behavior can be added later by plugging into the gap instead of editing the core.

**Designing for extensibility** means anticipating *which kinds* of change are likely, then placing seams exactly where those changes will land. If you expect to support new payment providers, you put a seam at the payment boundary: define a common interface that any provider can implement, so adding "PayProvider X" later means writing one new module, not surgery across the codebase.

**Why it matters.** Requirements always change. Without seams, every new feature forces you to reopen and re-test existing, working code — slow and risky. With well-placed seams, new behavior slots in cleanly, the old code stays untouched, and you can test the new part in isolation.

**The balance: YAGNI.** "You Aren't Gonna Need It." Seams are not free — each one adds an abstraction, indirection, and cognitive cost. If you add a seam for every imaginable future, you get an over-engineered maze that's *harder* to change than plain code. The skill is judgment: add a seam where change is **likely and costly to retrofit**; skip it where change is unlikely or cheap to add later.

**Analogy:** building a house, you leave a stub-out — a capped pipe — where a future bathroom *might* go, because adding plumbing later means tearing open finished walls. But you don't stub out a pipe in every room "just in case." You place stub-outs where a future need is probable and retrofitting would be painful. Seams are software stub-outs: placed with foresight, not everywhere.
