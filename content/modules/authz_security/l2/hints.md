# Authorization & Security — Hints & Alternative Explanations (L2)

## Alternative phrasings of the core idea

- **The role-plus-relationship view:** At L2, "are you allowed?" rarely has a
  one-line answer. It depends on your *role* (admin, lead, member) **and** your
  *relationship* to the resource (you own it, your team owns it). Correct rules
  combine both.
- **The single-authority view:** A permission rule copied into ten endpoints is
  a rule waiting to be forgotten in the eleventh. Enforcing it once, in an
  authoritative place (like database row policies), is safer than re-checking
  everywhere by hand.
- **The fail-closed view:** Security is decided by what happens when things go
  wrong. If a missing value or an error makes the system *deny*, bugs stay safe.
  If they make it *allow*, every bug becomes a breach.

## Hint stack

- **H1:** When one ownership check feels too strict or too loose, the data
  probably has more than one access path. List the roles and ask what each is
  *legitimately* allowed to see before writing any condition.
- **H2:** Watch for the two classic failures: "owner-only" wrongly blocks
  admins/leads; "staff can skip the check" wrongly grants access across
  boundaries. The fix is a rule that grants by role *scoped to* the right
  relationship (e.g. lead **of that team**).
- **H3:** Default every branch to **deny**, and make the authoritative check live
  as close to the data as possible (ideally enforced by the database), so a
  forgotten check in one endpoint can't open a hole. Also avoid error messages
  that confirm a hidden record exists.

## FAQ

**Q: Is more defense-in-depth always better?**
No. Layers cost latency and complexity. The aim is the *right* checks at trust
boundaries, enforced authoritatively — not the same value re-validated endlessly
after it's already trusted.

**Q: Why centralise authorization in the database instead of the app?**
Because application checks scattered across many endpoints invite one to be
missed. A database-enforced row policy applies to *every* query automatically,
making it far harder to accidentally bypass.

**Q: Why should a system "fail closed"?**
So that an error, a null, or an unexpected state results in denial rather than
access. Failing open means any unhandled edge case silently becomes an
authorization bypass.
