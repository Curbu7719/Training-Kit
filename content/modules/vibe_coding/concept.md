# Vibe Coding Done Right

**Vibe coding** means you build software by *asking an AI assistant to write the code* for you.
Then you guide it until it works. Done well, it is a fast and powerful way to ship. Done badly —
when you accept whatever the AI gives you because it "looks right" — it makes code that nobody
understands, with hidden bugs, and a codebase that slips out of control. The difference is not
the tool. It is the **discipline** you bring when you direct it. (Discipline here means working
in a careful, planned way, not just trusting your gut.)

**Start from intent, not vibes alone.** Before you prompt, know what you want: the behaviour,
the inputs and outputs, and the edge cases. (An edge case is a rare or extreme situation, like an
empty list or a huge number.) A clear, small **spec** gives the AI a target, and it gives *you* a
way to check the result. (A spec is a short, clear description of what the code should do — for
example, "add an endpoint that returns the last 10 orders for a user, in pages.") "Make it
better" gives neither.

**Work in small, reviewable steps.** Ask for one change at a time. Run it, then ask for the next.
Small **diffs** are easy to read, test, and undo. (A diff is the set of exact lines the AI added,
removed, or changed.) A giant block of generated code is none of those.

**Always read and understand the output before you accept it.** This is the core rule: *never
ship code you don't understand.* If you can't explain what a generated function does, you can't
maintain it, debug it, or trust it. Reading the diff is not extra polish — it is the job.

**Use tests and version control as your safety net.** Save working states often. (Version control
is a tool, like Git, that saves each version of your code so you can go back.) Run (or generate)
tests so a **regression** shows up at once. (A regression is when a change breaks something that
used to work.) Review the diff before you merge — this lets you move fast *because* mistakes are
caught early and can be undone.

**Keep secrets and sensitive data out of prompts.** Also check the security of what the AI
writes. It will happily produce SQL injection, missing login checks, or hard-coded keys if you
don't watch for them. (SQL injection is a common attack where bad input is used to break into a
database.)

**Know when to take the wheel.** The loop is **prompt → run → verify → refine**. (Verify means to
prove it really works, by running it and checking the result.) When the AI starts going in
circles, guessing, or inventing APIs that don't exist, stop prompting and fix it yourself. (An API
is a set of functions or commands one program uses to talk to another.) All through this, protect
**architectural coherence**: don't let the codebase turn into something no one on the team can
make sense of. (Architectural coherence means the whole system fits together in one clear,
consistent way.)

## How each role uses this

- **Developer:** Runs the prompt → run → verify → refine loop in small diffs, reads every generated line, and saves working states so nothing they don't understand reaches main.
- **Tester:** Treats AI-written code as untrusted until it is tested, and guards against output that looks right but is broken by writing real checks.
- **Project Manager:** Makes clear that "fast" still means reviewed and tested — not unread AI output shipped on vibes — and protects time for the verify step.
- **Designer:** Turns a fuzzy request into the clear intent and acceptance criteria that make a good prompt and a checkable result.
- **Enterprise Architect:** Keeps the system fitting together as AI-assisted code grows, so it doesn't drift into something no one can make sense of.
