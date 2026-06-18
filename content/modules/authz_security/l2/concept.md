# Authorization & Security — Concept (L2)

## When the simple rules collide with reality

L1 gave clean rules: authenticate, then authorize at the row level, on the
server, with least privilege. L2 is where those rules meet messy systems —
multiple roles, shared resources, performance pressure, and the temptation to
take shortcuts. The judgment is in knowing *which* control to apply and what
each one costs.

## Where authorization gets hard

- **Roles vs. ownership:** "Owns this row" is easy. But real apps mix *roles*
  (admin, manager, member) with *ownership*. An admin may read any record; a
  manager only their team's; a member only their own. Modeling this as a flat
  "logged in = allowed" check fails the moment a second role appears.
- **Indirect access:** A user may not own a document but might own the *folder*
  it sits in, inheriting access. Authorization sometimes follows relationships,
  not a single owner field — and every inherited path is another thing to check.
- **Centralised vs. scattered checks:** When the same permission rule is copied
  into many endpoints, one missed copy is a hole. Centralising authorization
  (e.g. database-enforced row policies) is more robust than re-implementing the
  check everywhere — a key reason to **not** trust application code alone.

## Trade-offs and when NOT to add more

- **Defense in depth has a cost.** Each extra layer adds latency and complexity.
  The goal isn't *maximum* checks; it's the *right* checks at the trust
  boundaries. Re-validating an already-server-verified value ten times wastes
  effort without adding safety.
- **Fail closed, not open.** When an authorization check errors or a value is
  missing, the safe default is to *deny*. A system that "allows on error" turns
  every bug into a breach.
- **Don't leak through error messages.** "Record not found" vs. "you are not
  allowed to see this record" can confirm a record *exists* to an attacker.
  Sometimes the secure choice is to reveal less, even though it's less helpful.

## The L2 mindset

Stop asking "is there a check?" and start asking "is the check in the right
place, enforced once authoritatively, failing closed, and matched to the
roles and relationships this data actually has?"
