# Worked Example: Let AI Take the Boring Parts of Your Day

Think about the small, repetitive chores in a normal working day — and how picking the *right* model quietly removes them, so your time goes to the work that actually needs you.

**The chore: writing commit messages.** Every push, you stop to summarise the diff into a tidy one-line message — dozens of times a day. A small, fast, cheap model writes it for you in a second: consistent phrasing, no thinking, cost too small to notice. *Why use AI here?* It's pure overhead for you and trivial for the model — you get those minutes back, every day.

**The chore: thinking up edge cases.** Before you ship a date parser you have to remember leap years, time zones, empty strings, the lot. A mid-tier model lists them in seconds and catches the ones you'd have forgotten. *Why use AI here?* Faster and more thorough than doing it from memory — and you still decide which cases matter.

**The hard one: a design gut-check.** You're unsure whether a service split hides coupling. You ask the strongest model to poke holes in it *before* the review meeting. *Why use AI here?* A serious second opinion in 30 seconds beats finding the problem in production — and the pricier model is worth it because the stakes are high and you ask rarely.

**The catch — so you stay in control.** The model once suggested a method that doesn't exist (a **hallucination**), and it doesn't know your newest framework version (**knowledge cutoff**). So you treat its output as a draft you check, not gospel.

**The takeaway:** match the model to the chore — cheap and fast for the everyday stuff, the big one only for the genuinely hard call. AI earns its place by handing you back time on the boring parts and a second brain on the hard parts.
