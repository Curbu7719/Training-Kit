# Composing Behavior from Layered Configuration — Concept

## What is layered configuration?

Most software has to behave differently in different situations — a timeout that
is short in testing but long in production, a feature switched on for one
customer and off for another. **Layered configuration** is the practice of
building the final settings from several stacked layers instead of one flat file,
and keeping those settings **separate from the code** so behavior can change
without editing and redeploying the program.

A typical stack has three layers, each able to override the one beneath it:

- **Immutable base layer** — the sensible defaults that ship with the software.
  It never changes at runtime; it is the foundation every environment starts from.
- **Overrides** — per-environment or per-customer values layered on top of the
  base (e.g. a production override that raises a timeout). Overrides only specify
  what *differs* from the base.
- **Runtime injection** — values supplied as the program starts or while it runs,
  such as environment variables or secrets, layered on last so they win.

The final value of any setting is found by reading from the top of the stack
down: take the runtime value if present, otherwise the override, otherwise the
base default. This "last layer wins" rule is called **precedence**.

## A real-world analogy

Think of dressing for the weather. Your **base layer** is the outfit you'd wear
on an ordinary day. When it's cold you add a **sweater** (an override) on top —
you don't redesign the whole outfit, you just layer over what needs to change. At
the door you grab an umbrella because it *started* raining (runtime injection).
Each layer covers the one below only where it needs to.

## Why it matters

Mixing settings into code means every change — a new timeout, a flipped feature —
requires editing source and redeploying. Layering configuration and keeping it
**separate from code** means the same build runs everywhere, differences live in
small override files, and operators can adjust behavior safely without touching
the program. You get one tested binary, many environments, and far fewer risky
code changes.
