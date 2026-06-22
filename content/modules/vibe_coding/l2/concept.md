# Vibe Coding in Depth: Failure Modes and the Disciplines That Contain Them

At L1 you learned the disciplined loop: clear intent, small steps, read every diff, tests and
version control as a safety net, and take the wheel when the AI goes in circles. (Vibe coding means
asking an AI assistant to write the code, then guiding it to a working result. A diff is the exact
lines the AI added, removed, or changed.) At L2 the question changes from *what the good practices
are* to *why they exist*. Each discipline is a defense against one specific failure that comes back
again and again in AI-generated code. (A failure mode is a typical way something goes wrong.) When
you know the failure modes, you can place the disciplines on purpose instead of by habit.

**The core failure modes.**

- **Silent wrong code.** The code runs, returns a value, and is simply wrong — off-by-one, a
  flipped condition, a wrong default. Nothing crashes, so "it runs" tells you nothing. *Contained
  by:* tests that check behaviour, not just the absence of errors. (Contained by means "the
  practice that keeps this failure under control.")
- **Plausible-but-broken.** The output reads like clean, confident code and passes a quick look,
  but it mishandles an edge case, a null, or two things happening at once. Its smooth look is the
  trap. (Plausible-but-broken means it looks correct but is not.) *Contained by:* actually reading
  the diff with the edge cases from your spec in mind. (A spec is a short, clear description of what
  the code should do.)
- **Hallucinated APIs.** The AI invents methods, parameters, or libraries that don't exist, or it
  uses a real API with the wrong shape. (To hallucinate means the AI confidently makes something up.
  An API is the set of functions one program uses to talk to another.) *Contained by:* running it,
  and spotting when the AI is stuck so you take the wheel instead of coaxing a fake API into being.
- **Scope creep.** You asked for one endpoint, but the diff also "helpfully" reworked unrelated
  modules, changed defaults, or added dependencies. (Scope creep means the work quietly grows
  beyond what you asked for.) *Contained by:* small, single-purpose prompts and rejecting diffs that
  go past the ask.
- **Eroded understanding.** The slowest and most dangerous failure: accept enough unread output and
  no one can explain how the system works, so no one can debug, secure, or extend it. (Eroded means
  slowly worn away.) *Contained by:* the non-negotiable rule — never ship code you don't understand
  — and keeping a clear picture of the system in your head.

**Disciplines as a system, not a checklist.** The disciplines stack like layers of defense, each
one catching what the one before it missed. A clear **spec** gives reading and testing a target.
**Small diffs** make reading possible and keep scope creep contained. **Reading** catches
plausible-but-broken logic that a test might not cover. **Tests** catch silent wrong code that
reads fine. **Version control** makes every step reversible and reviewable. (Version control is a
tool, like Git, that saves each version so you can go back.) **Human review gates** stop unverified
output at the door. Drop one layer and the failure it held back walks straight through.

**Keeping a mental model.** The deepest discipline is keeping an accurate picture of the system in
your own head as the AI writes into it. This is what makes architectural coherence possible: you
can only reject a drifting diff, name the right abstraction, or spot a security gap if you still
understand the whole. (Architectural coherence means the whole system fits together in one clear,
consistent way.) Speed that wears away that picture is borrowing against debt — and you will repay
it with interest when something breaks.

## How each role uses this

- **Developer:** Matches each discipline to the failure mode it contains, reads for plausible-but-broken logic, runs the code to expose hallucinated APIs, and protects the mental model that keeps the system coherent.
- **Tester:** Designs tests that check behaviour to catch silent wrong code, and hunts for the plausible-but-broken edge cases the AI is likely to mishandle.
- **Enterprise Architect:** Watches for scope creep and guards architectural coherence against drift as AI generates more of the code.
- **Project Manager:** Treats eroded understanding as growing risk, not free speed, and budgets for review and test rather than rewarding unread output.
