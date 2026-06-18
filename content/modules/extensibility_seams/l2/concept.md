# Extensibility Seams — Deeper (L2)

At L1, a seam is "a place to add behavior without rewriting." At L2 the harder questions are *where exactly*, *what shape*, and *how much* — because a seam in the wrong place, or the wrong kind, costs more than it saves.

**Identify the axis of change, not just a boundary.** Boundaries are everywhere; most never see new variants. A seam pays off only along an **axis of change** — a direction in which the system is likely to grow new variants (new providers, new formats, new rules). The discipline is to predict the *kind* of change, not merely to abstract for its own sake. A useful test: can you name two or three concrete variants you'd plausibly add? If not, the axis is speculative and a seam is premature.

**Match the seam's mechanism to the change.** Seams come in different shapes, each suited to a different kind of variation:

- **Interface / strategy** — when you'll *swap whole implementations* (payment providers, storage backends).
- **Configuration / feature flag** — when behavior varies by *deployment or environment*, not by code.
- **Event / hook** — when *unknown future parties* need to react to something happening, and you don't want the core to know about them.
- **Plugin registry** — when third parties, outside your release cycle, add capabilities.

Choosing the wrong mechanism is a subtle failure: a config flag where you needed a plugin registry forces edits to the core every time a new party appears.

**Account for the cost side honestly.** Each seam adds indirection, a contract you must keep stable, and a testing surface. Premature seams also *lock in the wrong abstraction* — once callers depend on an interface, changing its shape is itself a breaking change. This is why YAGNI and extensibility are not opposites but a single trade-off: add the seam when expected change value exceeds carrying cost, and defer otherwise. The senior skill is estimating both sides under uncertainty, and being willing to retrofit when a guess proves wrong.
