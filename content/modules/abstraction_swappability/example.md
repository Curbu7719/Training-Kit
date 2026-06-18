# Abstraction & Swappability — Worked Example

## Sending notifications without locking in a vendor

A team is building an app that needs to send messages to users. Today they want to use one email service; next quarter they may switch to a cheaper one, and later add text messages too.

**The risky approach.** Scatter calls to the email vendor's library throughout the codebase — in the signup flow, the password-reset flow, the billing flow. Each call names the vendor directly. Switching vendors later means hunting down and rewriting every one of those call sites, and testing them all over again.

**The swappable approach.** First, define a contract — a `Notifier` with a single capability:

```
Notifier.send(recipient, subject, body) -> Result
```

Every part of the app that needs to notify someone depends only on `Notifier`. None of them know which vendor is behind it.

Then write an **adapter** that implements `Notifier` by translating those calls into the email vendor's specific API. At startup, the app picks which adapter to use and hands it to the callers (this hand-off is *dependency injection*).

**The payoff.** When the team switches vendors, they write one new adapter — `NewEmailAdapter` — that fulfils the same `Notifier` contract, and change a single line of configuration. Not one signup, reset, or billing call changes. To add text messages, they write an `SmsAdapter` against the same contract.

And in their automated tests, they inject a `FakeNotifier` that just records what *would* have been sent — so tests run instantly, offline, with no real messages going out.

One contract, many interchangeable implementations: that is swappability in practice.
