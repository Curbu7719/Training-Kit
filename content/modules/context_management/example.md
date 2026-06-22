# Worked Example: Stop Pasting the Whole Repo at the AI

You're refactoring a feature that touches five files. The obvious move is to paste the whole repo into the chat so the AI "has everything" — and that's exactly what makes it slow, expensive, and forgetful. Here's how thinking about the context window makes your own day easier.

**The chore: feeding the AI for a multi-file change.** You paste 30 files, ask for the refactor, and the answer is cut off halfway. *Why?* The context window is one shared budget for **what you send and what it writes back** — fill it with source you didn't need and there's no room left for the code you actually wanted. So you send only the five files the change touches, and suddenly the answer comes back whole.

**The surprise: "but I told it that earlier."** You set a rule in message one ("keep the column name `legacy_id`"), and ten messages later the AI renames it anyway. *Why?* Each call is **stateless** — the model only knows what's in the window right now; older turns are gone unless the tool resends them. So you re-state the non-negotiable constraint in the message that matters, instead of trusting it to "remember."

**The fix that saves the day: a short recap.** Instead of re-pasting a long design thread, you write a three-line summary — decisions made, names to keep, what's left to do — and paste that. *Why use AI here at all?* Because now the AI works from a tight, correct brief, and you've turned a window that kept overflowing into one with room to think.

**Stay in control.** A bigger window is not a memory. If a constraint matters, put it *in* the window for the request where it matters — don't assume it survived.

**The takeaway:** you don't feed the AI everything; you feed it the *right* slice. Less context, sent deliberately, gets you a complete answer that honors your rules — and costs less doing it.
