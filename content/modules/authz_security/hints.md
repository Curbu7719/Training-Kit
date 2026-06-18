# Authorization & Security — Hints & Alternative Explanations

## Alternative phrasings of the core idea

- **The two-question view:** Every request faces two gates. *Authentication*
  asks "who are you?" and *authorization* asks "are you allowed to do this
  specific thing?" Passing the first gate never auto-opens the second.
- **The bouncer view:** Authentication checks your ID at the door; authorization
  is the bouncer deciding which rooms you may enter. Being inside the building
  doesn't mean every door opens for you.
- **The trust-boundary view:** Anything the user can touch — the browser, the
  request, hidden form fields — can be edited. Real enforcement has to live on
  the server, behind a boundary the user cannot cross.

## Hint stack

- **H1:** For any sensitive action, separate the two checks in your head: have we
  confirmed *who* this is, and separately, are *they* allowed to act on *this
  exact resource*?
- **H2:** Don't stop at table-level rules like "users can read invoices." Ask the
  row-level question: *which* invoices — and enforce that the record belongs to
  the requesting user before returning it.
- **H3:** Treat every value coming from the client (IDs, roles, flags) as
  attacker-controlled. Re-check permissions on the server for each request, and
  layer the check so a failure in one place is caught by another (defense in
  depth).

## FAQ

**Q: If a user is logged in, isn't access already handled?**
No. Logging in proves *identity* (authentication). Whether that identity may
perform a given action on a given record is a *separate* decision
(authorization) that must still be enforced.

**Q: The UI never shows other users' IDs — isn't that enough?**
No. Hiding something in the interface is not a security control. The user can
inspect and modify requests directly, so the server must enforce the rule
regardless of what the UI displays.

**Q: What does "least privilege" mean in practice?**
Grant each account and component only the permissions it genuinely needs. A
report viewer shouldn't have delete rights; a service that only reads data
shouldn't hold write credentials. Smaller permissions limit the damage if that
account is ever compromised.
