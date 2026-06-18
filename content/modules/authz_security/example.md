# Authorization & Security — Worked Example

## The invoice that wasn't yours

An app lets users view their invoices at a URL like:

```
GET /api/invoices/1042
```

The frontend only ever shows links to *your own* invoice IDs, so the team
assumes that's safe. But a curious user opens the browser tools, sees the
request, and simply changes the number:

```
GET /api/invoices/1043
```

If the server responds with invoice 1043 — belonging to a *different* customer —
the app has just leaked private data. The mistake was **trusting the client**:
the UI hid the other IDs, but the server never checked ownership.

## The fix: enforce authorization on the server

The server must verify, for *this* request, that the authenticated user actually
owns the requested invoice — a **row-level** check:

```
user = authenticate(request)            // who are you?
invoice = db.get_invoice(1043)
if invoice.owner_id != user.id:         // are you allowed THIS row?
    return 403 Forbidden
return invoice
```

Now changing the URL gets the attacker a `403`, not someone else's data.

## What the example teaches

Authentication alone wasn't enough — the user *was* logged in. The missing piece
was **authorization at the row level**, enforced **on the server** rather than
assumed from the UI. Hiding a link is presentation; checking ownership on every
request is security.
