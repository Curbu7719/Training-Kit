# Worked Example: Let an Agent Take the 3 a.m. Page — Within Limits

It's 3 a.m. and an alert fires. The dream is an on-call agent that picks it up, investigates, and fixes it before you wake. The nightmare is the same agent confidently restarting the wrong service at 3 a.m. The difference is entirely in how you bound it. Here's how to get the sleep without the blast radius.

**The shift that changes everything: tool vs actor.** A chatbot returns text and *you* act on it. An **on-call agent takes the action** — it restarts the service, pushes the config, scales the cluster. *Why does this make your day easier?* It does the investigate-and-remediate grind while you sleep — but because it *acts*, a wrong move is a wrong *action*, not just a wrong answer.

**Bound the blast radius first.** Before autonomy, you decide what it's *allowed* to touch: read-only investigation freely, low-risk remediations on its own, high-impact actions (touching prod data, scaling spend, deleting) only behind a human gate. *Why use the agent at all then?* Because the vast majority of pages are routine — restart a stuck worker, clear a queue — and the agent clears those instantly, escalating to you only the rare call that needs judgment.

**Make every action observable.** The agent logs what it saw, what it decided, and what it did. *Why does this matter?* At 3 a.m. you need to read its actions like a runbook trail — "alert → checked X → restarted Y" — not guess what a black box did to prod.

**Stay accountable.** A human still owns the outcome. The agent acts within bounds *you* set; you review what it did. *Why?* Autonomy doesn't remove responsibility — it moves your job from doing every step to setting the limits and checking the trail.

**The takeaway:** an acting agent is the difference between a page that wakes you and one that fixes itself. Bound the blast radius, log every action, keep a human accountable — and you get the help of an actor without handing it the keys to break prod unsupervised.
