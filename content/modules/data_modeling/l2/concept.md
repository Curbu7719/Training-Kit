# Data Modeling — Concept (L2)

## Beyond the clean blueprint

At L1 the rule was simple: separate every entity, never duplicate a fact. In
real systems that rule has *trade-offs*, edge cases, and moments where breaking
it is the right call. L2 is about judgment, not just correctness.

## When normalization goes too far

Fully normalized models split data across many tables. Reading one screen of
information may then require joining five or six tables together. On a
read-heavy system — a dashboard hit thousands of times a minute — those joins
can become the bottleneck. **Denormalization** deliberately stores a redundant
copy (e.g. caching `order_count` on the Customer row) to make reads fast. The
cost is that you now own keeping the copy in sync. The trade-off is explicit:
**read speed and simplicity vs. write complexity and the risk of drift.** Choose
it on purpose, never by accident.

## Relationships that resist the simple shape

- **Many-to-many** (students ↔ courses) cannot be expressed with a single
  foreign key. It needs a **junction table** holding pairs of keys — a modeling
  decision people often miss until data won't fit.
- **Optional vs. required** links (nullable foreign keys) change meaning: does
  "no value" mean *unknown*, *not applicable*, or *not yet*? The model should
  make that distinction unambiguous.

## Edge cases worth naming

- **Natural vs. surrogate keys:** using a real-world value (email, SSN) as the
  primary key feels economical until it changes or isn't actually unique. A
  surrogate key (a system-generated ID) is usually safer.
- **History and time:** a single current value can't answer "what was the price
  *last* month?" Temporal questions often demand extra rows or audit tables.

## When NOT to model rigidly

For genuinely free-form, sparse, or fast-changing data (user preferences,
event payloads), a rigid relational schema fights you. A flexible document or
JSON field can be the better tool. The skill at L2 is recognising which problem
you actually have before forcing it into tables.
