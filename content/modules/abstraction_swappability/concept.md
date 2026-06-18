# Abstraction & Swappability — Concept

## The core idea

**Abstraction** means depending on *what* a thing does, not *how* it does it. You define a contract — a list of capabilities and the shape of their inputs and outputs — and your code talks to that contract. The concrete thing that fulfils the contract sits behind it and can be replaced without your code noticing.

When code is written this way, the concrete implementation becomes **swappable**: you can change the engine without rebuilding the car around it.

## A real-world analogy

Think of a wall socket. Your toaster doesn't know or care what produces the electricity — a coal plant, a wind farm, or solar panels. It just needs the *contract*: the right voltage at the right shape of plug. The power company can swap its entire generation method overnight and your toaster keeps working, because it depends on the **socket interface**, not on the generator.

In software, the socket is an **interface** (or "contract", or "port"). The generator is the **implementation** (or "adapter", or "provider"). Your code is the toaster.

## Why it matters

- **Replaceability.** Swap a payment provider, a storage backend, or an email service by writing a new adapter — callers stay untouched.
- **Testability.** In tests you plug in a fake implementation that returns predictable results, with no network or database needed.
- **Decoupling.** Teams can work against the contract in parallel before the real implementation exists.
- **Resilience to change.** When a vendor raises prices or shuts down, you replace one adapter instead of rewriting the application.

## The principle behind it

This is **dependency inversion**: high-level policy (your business logic) should not depend on low-level details (a specific database or API). Both should depend on an abstraction. The arrows of dependency point *toward* the contract, never toward a concrete vendor. Program to an interface, not an implementation.
