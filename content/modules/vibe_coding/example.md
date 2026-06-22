# Worked Example: Ship Fast With an AI Coding Assistant — Without Losing the Plot

You can now ask an AI to write the code and steer it to a working result. Done well it's the fastest way you've ever shipped. Done by accepting whatever "looks right," it leaves you with code nobody understands and bugs you can't find. The tool isn't the difference — the discipline is. Here's how to keep the speed and the control.

**Start from intent, not a vibe.** Before prompting, you know the behaviour, inputs, outputs, edge cases — "add an endpoint returning a user's last 10 orders, paginated." *Why does this make your day easier?* A clear small spec gives the AI a target *and* gives you a way to check the result. "Make it better" gives neither, and you'll burn the afternoon re-prompting.

**Work in small, reviewable steps.** One change, run it, then the next. *Why use AI this way?* Small diffs are easy to read, test, and undo; a giant generated blob is none of those — and when it's wrong you can't tell where. Small steps are what let you move fast *safely*.

**Never ship code you don't understand.** This is the core rule. If you can't explain what a generated function does, you can't maintain or trust it. *Why does this matter even though the AI wrote it?* Because *you* own it the moment you merge it — reading the diff isn't optional polish, it's the job.

**Keep a safety net.** Commit working states often, run or generate tests, review the diff before merge. *Why?* The net is exactly what lets you accept the AI's speed — mistakes surface immediately and are reversible, so going fast stops being reckless.

**The takeaway:** vibe coding makes you fast *because* of the discipline, not despite it. Clear intent, small steps, read every diff, and a test-and-commit safety net — that's how an AI assistant becomes a force multiplier instead of a debt machine.
