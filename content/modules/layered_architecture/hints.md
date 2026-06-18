# Layered Architecture — Hints & Alternative Explanations

## Alternative phrasings

- **The "lanes" version:** Each layer is a lane on a road. The UI lane talks to users, the function lane runs trusted logic, the BaaS lane guards the data, and external services are off-ramps to other systems. Crossing lanes only at defined points keeps traffic safe.
- **The "trust boundary" version:** The client is *untrusted* (the user controls it), so it can't hold secrets or be the final word on access. Trust increases as you move inward: functions are trusted to run logic and hold keys; the BaaS is the trusted source of truth.
- **The "one job each" version:** UI = show and collect. Functions = decide and orchestrate. BaaS = store and authorize. External services = specialized tasks you outsource.

## Hint stack

- **H1 (nudge):** Ask "who is this layer's responsibility, and what should it *never* do?" Secrets and final access decisions never belong on the user's device.
- **H2 (sharper):** The client is controllable by the user, so it cannot be the place that enforces rules or stores keys. Push those inward to the function or BaaS layer.
- **H3 (near-answer):** Match each concern to the layer that owns it: presentation → client; trusted logic and secrets → serverless function; data and access rules → BaaS; outsourced specialized work → external service.

## FAQ

**Q: Why not just call the external API straight from the browser?**
A: The browser would have to hold the secret key, and anyone can inspect browser traffic. The function layer keeps the key server-side.

**Q: Isn't enforcing access rules in the database redundant if the UI hides buttons?**
A: Hiding a button is only cosmetic. A determined user can call the API directly, so the real rule must live at the source of truth — the BaaS layer.

**Q: Do I always need all four layers?**
A: No. Small apps may skip the function layer until they need secrets or shared logic. Use the layers your problem actually requires.

**Q: What's the single biggest payoff of layering?**
A: Containment. A change in one layer (a new vendor, a redesign, a rule tweak) doesn't force a rewrite of the others.
