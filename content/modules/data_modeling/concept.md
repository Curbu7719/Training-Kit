# Data Modeling — Concept

## What is data modeling?

**Data modeling** is the practice of deciding how the information your
application cares about is stored as structured data. Before you can save a
customer order or a support ticket, someone has to decide *what* gets stored,
*what type* each piece of information is, and *how the pieces connect* to one
another. That blueprint is the data model.

A data model is built from a few core ingredients:

- **Entities / tables** — the "things" you store (e.g. *Customer*, *Order*).
- **Fields / columns** — the individual facts about each thing, each with a
  **type** (text, number, date, true/false).
- **Relationships** — how entities link together. The most common is
  **one-to-many** (one customer has many orders).
- **Keys** — a **primary key** uniquely identifies each row; a **foreign key**
  in one table points to the primary key of another, wiring the relationship.
- **Normalization** — organising data so each fact lives in exactly one place,
  avoiding duplication.

## A real-world analogy

Think of a well-run library. Books, authors, and members are each kept in their
own card catalog (entities). Every book card has the same fields: title, ISBN,
shelf number (columns with types). A book card doesn't re-type the author's full
biography — it just references an author card by an author ID (a foreign key).
If an author changes their name, you update *one* author card, not every book
(normalization). The catalog *is* the data model.

## Why it matters

A clean model is the foundation everything else stands on. Get it right and
queries are simple, data stays consistent, and new features slot in. Get it
wrong — duplicate data, missing links, the wrong types — and you fight bugs,
contradictions, and painful migrations for the life of the project. Good
modeling is cheap up front and expensive to skip.
