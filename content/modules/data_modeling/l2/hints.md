# Data Modeling — Hints & Alternative Explanations (L2)

## Alternative phrasings of the core idea

- **The trade-off view:** L2 modeling isn't "never duplicate" — it's knowing the
  *price* of each choice. Normalization buys consistency at the cost of join
  complexity; denormalization buys read speed at the cost of sync work. You pick
  which cost you'd rather pay for *this* workload.
- **The shape-of-the-problem view:** Match the model to the data's real shape.
  Many-to-many needs a junction table; temporal questions need history; sparse
  free-form data may not belong in rigid tables at all.
- **The accident-vs-decision view:** Redundancy that sneaks in is a bug;
  redundancy chosen on purpose, documented, and centrally maintained is a
  legitimate optimisation. The difference is intent and discipline.

## Hint stack

- **H1:** When a model "feels wrong," first ask whether the workload is
  read-heavy or write-heavy — that single fact drives most normalization
  trade-offs.
- **H2:** If you're tempted to duplicate a value, ask three questions: How often
  does it change? Who is responsible for updating every copy? What breaks if one
  copy drifts? Acceptable answers justify the redundancy; vague ones forbid it.
- **H3:** Before forcing data into tables, check its shape. Pairs of related
  things → junction table. "What was it back then?" → history/temporal rows.
  Sparse, unpredictable attributes → consider a document/JSON field instead of
  many nullable columns.

## FAQ

**Q: Isn't denormalization just bad practice?**
No — accidental duplication is bad practice. Denormalization is a deliberate,
documented optimisation for read-heavy paths where the sync cost is understood
and contained. Intent is what separates the two.

**Q: When should I avoid a strict relational model entirely?**
When data is genuinely sparse, free-form, or rapidly evolving (user settings,
raw event payloads). Cramming that into rigid columns creates a sea of nullable
fields; a flexible document or JSON field models it more honestly.

**Q: Why prefer a surrogate key over a meaningful real-world value?**
Real-world values change (emails, phone numbers) and aren't always as unique as
assumed. A system-generated surrogate key stays stable and unique regardless of
how the business data shifts.
