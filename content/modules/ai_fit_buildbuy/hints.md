# Hints — AI Fit & Build vs Buy

## Alternative phrasings of the core idea

- Two questions in order: first, *does AI even fit this problem* (fuzzy/judgment work) versus
  *is it exact and known* (deterministic code); only then, *how do I source it* — build, buy,
  fine-tune, or call an API.
- AI is non-deterministic and costs per call, so you adopt it when "probably right" beats
  nothing and you can tolerate variability — not when a lookup or formula gives the exact
  answer for free.
- Sourcing is a spectrum from call-an-API (fast, cheap upfront) to build-in-house (only when
  AI is your differentiator), and the real comparison is TCO and vendor lock-in, not sticker
  price.

## Hint stack

- **H1 (nudge):** Ask whether the rule is *exact and known*. If you can write it as a formula
  or lookup table, deterministic code beats a non-deterministic model — cheaper, testable,
  same answer every time.
- **H2 (structural):** Separate the two decisions. Fit first (is the work fuzzy and
  language/judgment-shaped?), sourcing second (build vs buy vs fine-tune vs API), and judge
  sourcing on total cost of ownership and switching costs, not the per-call price alone.
- **H3 (near-answer):** When AI is *not* your differentiator and you have no labeled data,
  start by **calling a hosted API behind an abstraction layer** — it ships fast, keeps
  lock-in low, and leaves fine-tune/buy/build open for later.

## FAQ

**Q: AI is powerful — why not use it for everything?**
Because it is non-deterministic, costs per call, and is hard to test. For exact, known rules
(tax, validation, routing) deterministic code is cheaper, faster, and gives the same answer
every time. Use AI only for fuzzy, judgment- or language-shaped work.

**Q: What's the difference between fine-tune and call-an-API?**
Calling an API uses a general hosted model as-is with a prompt — lowest upfront effort.
Fine-tuning further trains a model on your labeled data so it learns your domain's voice or
categories. Fine-tune when a general model is *close* but not quite, and you have the data.

**Q: What is vendor lock-in and how do I limit it?**
Lock-in is when proprietary formats, prompts, or APIs make switching providers expensive
(high switching cost). Limit it by putting AI behind an internal **abstraction layer** so you
can swap the underlying provider without rewriting your product.

**Q: What is TCO and why does it beat per-call price?**
Total cost of ownership includes integration, evaluation, monitoring, and maintenance — not
just the price per API call. A "cheap" option can have high TCO once you add the engineering
to operate it reliably.
