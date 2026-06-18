# Authorization & Security — Worked Example (L2)

## Three roles, one endpoint

A support tool exposes:

```
GET /api/tickets/{id}
```

Three kinds of users hit it:

- **Members** may read only tickets they created.
- **Team leads** may read any ticket owned by their team.
- **Admins** may read any ticket.

The first version checks only `ticket.owner_id == user.id`. It works for
members but **wrongly blocks** team leads and admins from tickets they are
legitimately allowed to see. A naive fix — "if the user is staff, skip the
check" — swings too far and lets a lead read *other teams'* tickets. Both
versions are wrong: one too strict, one too loose.

## A role-and-relationship-aware rule

The authorization logic must combine ownership *and* role:

```
ticket = db.get_ticket(id)        // load once
if user.role == "admin":          allow
elif user.role == "lead" and ticket.team_id == user.team_id:  allow
elif ticket.owner_id == user.id:  allow
else:                             deny   // fail closed
```

## Why this is the L2 lesson

Flat "logged in = allowed" or "owner-only" rules break as soon as multiple roles
exist. Correct authorization here follows both **role** and **relationship**
(team membership), is decided **on the server**, and **fails closed** by denying
anything the rules don't explicitly permit. Note also: returning a generic
`404`/`403` rather than "this belongs to team B" avoids confirming the ticket's
existence to someone who shouldn't know it.
