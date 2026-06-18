# Authorization & Security — Concept

## Who is allowed to do what?

Every serious application has to answer two different questions about a request.
First, **authentication**: *who are you?* Second, **authorization**: *now that I
know who you are, are you allowed to do this?* They are easy to confuse but
solve different problems — proving identity is not the same as granting
permission. A logged-in user is authenticated, but that alone does not mean they
may delete someone else's record.

## The core principles

- **Authentication vs. authorization** — identity first, permission second. A
  valid login does not imply unlimited access.
- **Least privilege** — give each user (and each part of the system) the minimum
  access needed to do its job, and nothing more. Fewer permissions means a
  smaller blast radius if something is compromised.
- **Row-level access control** — it is not enough to allow "users can read
  orders." You must enforce *which* orders: a user should see only their own
  rows, decided per record, not per table.
- **Defense in depth** — never rely on a single check. Layer protections (UI,
  API, database) so that if one fails, another still stands.
- **Never trust the client** — anything running in the browser or on a user's
  device can be inspected and tampered with. Authorization must be enforced on
  the server, where the user cannot rewrite the rules.

## A real-world analogy

Think of a hotel. The front desk **authenticates** you against your booking. Your
key card **authorizes** you — but only to *your* room and the gym, not to other
guests' rooms or the manager's office (least privilege, row-level access). Doors,
cameras, and staff each provide a layer (defense in depth). Crucially, the lock
is on the *door*, not printed on your key card for you to edit — the hotel never
trusts the guest to enforce the rules.

## Why it matters

Most damaging breaches are not exotic — they are missing or sloppy authorization:
a user changing an ID in a request and seeing someone else's data. Getting these
principles right is the difference between a private system and a public leak.
