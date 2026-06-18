# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "Cost is roughly tokens times price — and input and output tokens are priced
  separately, with output (the review comments) usually costing more than input (the diff)."
- "Latency is the wait, driven by model size, how much text it generates, network hops,
  and any extra steps — fetching files, linters, multi-step chains — in the CI pipeline."
- "Quality, cost, and latency form a triangle: making the AI check catch more bugs usually
  makes it slower or pricier, so you balance them per check."

**Hint stack**

- **H1 (nudge):** Think about *what you're charged for* and *what makes the PR check wait*.
  They aren't the same thing, and one lever can help both or trade one for the other.
- **H2 (structure):** Separate the two numbers. For cost, split input tokens (diff +
  context) from output tokens (comments). For latency, list every step a review goes
  through — context fetch, model call, any tool calls — and which produces the most tokens.
- **H3 (worked path):** Output tokens cost more and take longer per token, so capping the
  review length helps cost *and* latency. Trimming context (changed hunks, not whole files)
  mainly helps cost. Streaming helps perceived latency only. Routing a tiny diff to a
  smaller model helps both.

**Short FAQ**

- **Does streaming make the review cheaper or actually faster?** Neither — total tokens and
  total time are the same. It only improves *perceived* speed by showing comments as
  they're written, so the developer isn't staring at a blank check.
- **Why is output usually more expensive than input?** Generating each token requires a
  full forward pass; input is processed more efficiently in parallel, and providers price
  the difference in.
- **Should every PR go to the biggest model?** No. The biggest model catches more but costs
  more and is slower. Use the smallest model that reliably reviews routine diffs, and route
  only large or release PRs to a bigger one.
- **What's the single highest-impact lever for a CI assistant?** Usually trimming context
  to the changed hunks and capping output length — together they cut the dominant cost and
  the wait developers feel on the merge gate.
