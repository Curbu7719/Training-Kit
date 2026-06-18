# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "Cost is roughly tokens times price — and input and output tokens are priced
  separately, with output usually costing more."
- "Latency is the wait, driven by model size, how much text it has to generate, network
  hops, and any extra retrieval or tool steps in the pipeline."
- "Quality, cost, and latency form a triangle: improving one usually pressures the
  other two, so you balance them per feature."

**Hint stack**

- **H1 (nudge):** Think about *what you're charged for* and *what makes you wait*. They
  are not the same thing, and one lever can help both or trade one for the other.
- **H2 (structure):** Separate the two numbers. For cost, split input tokens from output
  tokens. For latency, list every step a request goes through (model call, retrieval,
  tool calls) and which produces the most tokens.
- **H3 (worked path):** Output tokens cost more and take longer per token, so capping
  output length helps cost *and* latency. Trimming input mainly helps cost. Streaming
  helps perceived latency only. Routing easy work to a smaller model helps both.

**Short FAQ**

- **Does streaming make the request cheaper or actually faster?** Neither — the total
  tokens and total time are the same. It only improves *perceived* speed by showing
  output as it's produced.
- **Why is output usually more expensive than input?** Generating each token requires a
  full forward pass through the model, while input can be processed more efficiently in
  parallel; providers price this difference in.
- **Is the biggest model always best?** No. The biggest model raises quality but costs
  more and is slower. Use the smallest model that reliably does the job, and route only
  hard tasks to the large one.
- **What's the single highest-impact lever?** It depends, but reducing output length
  and routing easy tasks to smaller models usually give the largest combined cost +
  latency win.
