# Worked Example: Tuning a Document-Summarizer's Cost and Latency

A team ships a feature that summarizes uploaded documents. The first version sends the
full document plus instructions to a large model and asks for a detailed summary.

**Baseline per request.**

| Part | Approx. tokens | Notes |
|---|---|---|
| Input (instructions + full document) | 8,000 | Most of the document is boilerplate |
| Output (detailed summary) | 1,200 | Long, free-form |

Suppose the large model is priced at **$5 per million input tokens** and **$15 per
million output tokens**. One request costs roughly:

`(8,000 × $5 + 1,200 × $15) ÷ 1,000,000 = $0.040 + $0.018 = $0.058`

Measured latency is about **9 seconds**, and users complain the screen sits blank the
whole time.

**Applying levers.** The team makes three changes:

1. **Trim context** — strip repeated headers/footers and irrelevant sections, cutting
   input from 8,000 to **3,500 tokens**.
2. **Shorter output** — instruct for a 5-bullet summary, dropping output to **350 tokens**.
3. **Stream** the response so bullets appear as they're generated.

**After tuning.**

`(3,500 × $5 + 350 × $15) ÷ 1,000,000 = $0.0175 + $0.00525 ≈ $0.023`

Cost drops from **$0.058 to ~$0.023** per request (about 60% cheaper), and end-to-end
latency falls to roughly **4 seconds**. Streaming makes it *feel* even faster because
the first bullet appears in under a second.

**The trade-off check.** A 5-bullet summary is slightly less detailed than the original
paragraph version. The team confirms with users that bullets are actually preferred for
this feature, so the quality "cost" is acceptable. For a separate legal-review feature
where detail matters, they keep the large model and longer output — a deliberate,
per-feature balance on the quality/cost/latency triangle.
