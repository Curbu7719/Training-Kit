# Extensibility Seams — Deeper Worked Example (L2)

A reporting system exports data. Today it exports CSV. Three change pressures are on the horizon, and each calls for a *different shape* of seam — choosing wrong is the trap.

**Pressure 1: more export formats (PDF, JSON).** This is a classic implementation swap along a clear axis — at least two concrete variants are already named. The right seam is an **interface**: an `Exporter` with a `format(data)` method, one implementation per format. New formats slot in without touching the export trigger.

**Pressure 2: behavior differs per customer tier.** Enterprise customers get larger export limits; free customers are capped. This isn't a new *implementation* — it's the *same* logic parameterized by environment. An interface here would be over-engineering. The right seam is **configuration**: a limit value resolved per tier. No new code per tier, just data.

**Pressure 3: other teams want to react when an export finishes** — one team to log it, another to bill for it, more to come. The core export code must not grow a hard-coded list of these consumers. The right seam is an **event/hook**: emit an `exportCompleted` event; interested parties subscribe. The core stays ignorant of who listens.

Now the mistake to avoid. A developer proposes a single grand "ExportPlugin" registry to handle all three pressures uniformly. It sounds elegant, but it's the wrong mechanism for two of them: tiers don't need plugins (config suffices), and forcing the format swap through a plugin registry adds ceremony with no payoff. Worse, the registry's contract would have to cover formats, limits, *and* reactions — a bloated abstraction that's hard to change later.

The L2 lesson: "add a seam" is not enough. Identify each axis of change separately, and fit the *mechanism* — interface, config, or event — to the *kind* of change it absorbs.
