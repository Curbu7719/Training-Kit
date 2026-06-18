# Extensibility Seams — Worked Example

A team builds an app that sends users notifications. On day one, there is exactly one channel: email. The quickest path is to write the email-sending code directly inside the "user signed up" logic:

```
function onUserSignup(user) {
  sendEmail(user.address, "Welcome!");   // email logic hard-wired in
}
```

This works — but email is unlikely to stay the *only* channel. Product already mentions SMS and in-app notifications. Changing channels later would mean hunting down every place that calls `sendEmail` and editing it. That is a costly, likely change — a perfect spot for a **seam**.

So the team adds one: a `Notifier` interface with a single method, `send(user, message)`. The signup logic now depends on the seam, not on email:

```
function onUserSignup(user) {
  notifier.send(user, "Welcome!");       // depends on the seam
}
```

`EmailNotifier` is the first implementation. Later, adding SMS means writing one new `SmsNotifier` that implements the same interface — the signup code never changes. The seam absorbed the change.

**Where they did NOT add a seam.** The same app formats dates in one report. Someone suggested a pluggable "date-format strategy" for hypothetical future locales. The team said no: there's no evidence multiple formats are coming, and adding one later is a trivial, local change. Building that seam now would be pure YAGNI overhead.

The lesson: the team spent its abstraction budget on the change that was **probable and expensive to retrofit** (notification channels) and refused it for the change that was **speculative and cheap** (date formats).
