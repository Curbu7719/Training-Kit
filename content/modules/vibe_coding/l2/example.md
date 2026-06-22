# Worked Example: Place Each Discipline Where AI Code Actually Breaks

You've got the vibe-coding loop down — but at depth the disciplines aren't a ritual, they're each a defense against a *specific* way AI-generated code fails. Knowing the failure modes is what lets you place each guard deliberately instead of going through the motions. Here's how that keeps the speed without the silent damage.

**Silent wrong code.** It runs, returns a value, and is simply wrong — off-by-one, inverted condition. Nothing crashes, so "it runs" tells you nothing. *The guard:* tests that assert *behaviour*, not just absence of errors. *Why does this make your day easier?* The bug surfaces in the suite now, not in production next week — you catch the thing a glance can't.

**Plausible-but-broken.** The output reads like confident, idiomatic code and passes a skim, but mishandles a null, an edge case, or concurrency. Its fluency *is* the trap. *The guard:* actually read the diff with your spec's edge cases in mind. *Why use AI this way?* Because the better the AI gets at *looking* right, the more your real value is checking whether it *is* right.

**Scope creep and silent drift.** You ask for one change and the AI helpfully rewrites three things. *The guard:* small diffs, one change at a time, so you can see exactly what moved. *Why does this matter?* A big "helpful" blob hides the one line that broke something — small steps keep the damage visible.

**Take the wheel when it loops.** When the AI keeps producing variations that don't converge, you stop prompting and write the tricky part yourself. *Why?* Re-prompting a stuck model burns time and tokens; recognizing the loop early is what keeps fast from turning into a spiral.

**The takeaway:** at depth, each discipline maps to a failure mode — tests for silent-wrong, reading for plausible-but-broken, small steps for drift, taking the wheel for loops. Place them on purpose and AI keeps you fast *and* keeps the code something you can stand behind.
