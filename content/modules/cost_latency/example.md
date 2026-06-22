# Worked Example: Add an AI Reviewer to CI Without It Becoming a Tax

You want an AI code reviewer that leaves inline comments on every PR — it would catch the nits you're tired of catching by hand. But wire it up naively and it runs dozens of times a day, the CI bill climbs every sprint, and everyone waits 30 seconds before they can merge. Here's how cost and latency thinking keeps the help from turning into a tax.

**The chore it removes: nitpicking every diff.** You're tired of flagging the same style and edge-case misses. *Why use AI here?* An always-on reviewer does that grind on every PR so you review for design, not commas — but only if it's cheap and fast enough that nobody dreads it.

**Cost: you pay per token, twice.** Send the whole diff *plus* thousands of lines of surrounding files and you pay for all of it — and **output is priced higher than input**. *The lever:* send only the diff and the few files it touches, and ask for "top issues only," not an essay. The trimmed output cuts the bill more than trimming input does.

**Latency: people wait on the merge.** A big model that reasons for 30 seconds blocks the merge. *The lever:* route routine PRs to a faster, smaller model and reserve the big one for the scary refactors. *Why does this make your day easier?* The check clears in seconds, so the reviewer speeds you up instead of standing between you and merge.

**The triangle you can't cheat.** Quality, cost, and latency trade off — you can't max all three. *Why does naming it help?* You decide on purpose: "good enough and fast on every PR, deep and slow only when escalated," instead of paying for max quality on a typo fix.

**The takeaway:** an AI step that runs on every commit lives or dies on cost and latency. Trim the input, cap the output, match the model to the PR — and the reviewer becomes a help you keep, not a tax you rip out next sprint.
