# Worked Example: Shrink the AI Surface and Keep the Decision Reversible

You've decided AI fits a feature — but "use AI" isn't one decision, it's several, and the wrong one is expensive to unwind. At depth the move is to make the AI surface as small as possible and keep your sourcing call reversible. Here's how that makes the whole thing cheaper to build and easier to live with.

**Decompose before you decide.** Most "AI features" are mostly deterministic with *one* genuinely fuzzy step. A document extractor is: validate the file (code), look up the customer (code), and *understand the messy free-text field* (AI). *Why does this make your day easier?* Push everything you can into plain code — testable, same answer every time — and point the model only at the irreducibly fuzzy core. The narrower the AI surface, the cheaper and more testable the whole system.

**Decide on three axes together, not by gut.** Accuracy needed, non-determinism you can tolerate, and cost at real volume — weighed *together*. *Why?* A task can be a great AI fit on accuracy and a terrible one on cost-per-call at your volume; looking at one axis hides the other.

**Keep it reversible.** You call an API behind your own interface instead of welding to one vendor. *Why use AI this way?* When volume grows and an API call gets expensive, or a fine-tune starts to pay off, you switch the source without rewriting the feature — the decision stays changeable as your data, volume, and accuracy needs grow.

**Re-decide on a schedule.** The "right" sourcing call at pilot volume is often wrong at scale. *Why does this save you?* You revisit it deliberately instead of being trapped by a choice that fit last quarter.

**The takeaway:** at depth, fit isn't yes/no and sourcing isn't forever. Shrink the AI to the fuzzy core, decide on accuracy + variability + cost together, and keep the source swappable — so AI makes the feature cheaper to build *and* cheap to change your mind about.
