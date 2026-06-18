# Data Modeling — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The blueprint view:** A data model is the architectural blueprint for your
  information — it names the "things" you store, the facts about each thing, and
  the wires connecting them, *before* a single record exists.
- **The spreadsheet view:** Imagine well-designed spreadsheets where each kind of
  thing gets its own sheet, every column has one clear meaning and type, and
  sheets reference each other by ID instead of copy-pasting the same text.
- **The single-source-of-truth view:** Modeling is mostly about making sure each
  fact lives in exactly one place, so updating it is a one-line change and the
  data can never contradict itself.

## Hint stack

- **H1:** Start by listing the nouns in the problem — the distinct "things" you
  need to remember. Each strong noun is usually a candidate entity (table).
- **H2:** For each entity, write down its facts (fields) and the type of each
  (text, number, date, yes/no). Ask: which single field uniquely identifies one
  row? That is your primary key.
- **H3:** Wherever one thing "has many" of another (one customer → many orders),
  put a foreign key on the *many* side pointing back to the *one* side. If you
  ever find yourself copying the same text into many rows, split it into its own
  entity instead.

## FAQ

**Q: What's the difference between a primary key and a foreign key?**
A primary key uniquely identifies each row *within its own table*. A foreign key
is a column in another table that stores a primary-key value to point back to
that row, creating the relationship.

**Q: Why is duplicated data a problem if it's just a copy?**
Because copies drift. The moment one copy is updated and another isn't, the data
contradicts itself and there's no reliable answer. Normalization keeps each fact
in one authoritative place.

**Q: How do I know when to split something into a new table?**
When a group of fields repeats across many rows, or describes a separate "thing"
with its own identity, it usually deserves its own entity linked by a key.
