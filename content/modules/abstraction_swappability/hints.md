# Abstraction & Swappability — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The job-description version.** Write down the *job* ("send a notification") as a contract, then let any worker who can do that job apply. Your code hires the job, not a specific worker — so you can replace the worker anytime.
- **The plug-and-socket version.** Build your app around standard sockets (interfaces). Vendors are just plugs. As long as a new plug fits the socket, the app neither knows nor cares which one is plugged in.
- **The arrow version.** Make every dependency arrow point at an abstraction, never at a concrete vendor. Business logic and vendor code both depend on the same contract in the middle — neither depends on the other.

## Hint stack

- **H1 — Nudge.** What does the caller actually *need* from the thing it's calling? Describe that need as a small list of capabilities, ignoring how any one vendor provides them.
- **H2 — Direction.** Put that list of capabilities behind a named contract (interface). Have the caller depend on the contract. Have each vendor's code implement the contract through a thin adapter.
- **H3 — Mechanism.** Decide *which* implementation to use in one place (configuration / startup) and pass it in to callers — don't let callers construct vendors themselves. Now swapping is a one-line config change, and tests can inject a fake.

## FAQ

**Q: Isn't this just extra layers and indirection I don't need?**
A: For throwaway code, maybe. The value appears the moment something behind the contract is *likely to change* — a vendor, a storage engine, anything you might swap or want to fake in tests. Add the abstraction where change or testing pressure is real, not everywhere.

**Q: What's the difference between an interface and an adapter?**
A: The *interface* is the contract: the capabilities and the shape of their inputs/outputs. The *adapter* is one concrete implementation that fulfils that contract by translating it into a specific vendor's API. One interface, many possible adapters.

**Q: Where do I decide which implementation to use?**
A: In one composition point — startup or configuration — then hand (inject) it to the callers. Callers should never name a concrete vendor themselves; if they do, they're coupled to it and the swap stops being free.
