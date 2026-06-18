# Worked Example: Two Ways to Vibe-Code the Same Feature

**The task.** Maya needs to add a "reset password" endpoint to a web app. She decides to vibe-
code it — prompt an AI assistant to write the code. Two versions of Maya tackle it.

**Reckless Maya.** She types: *"add password reset to my app."* The AI returns ~120 lines
touching three files: a route, an email sender, and a token store. It looks plausible, so she
pastes it in, sees the server start, and opens a pull request titled "password reset done." She
never read the token logic. Two days later: reset tokens never expire (so an old link works
forever), the email password is hard-coded in the committed file, and the token is compared with
`==` against user input with no constant-time check. The diff was big, unread, and untested — the
bugs shipped on vibes.

**Disciplined Maya.** She starts from intent: *"endpoint that emails a one-time reset token,
token expires in 15 minutes, single use, no secrets in code."* She prompts for one piece at a
time. First the token model — she **reads the diff**, notices the AI invented a
`crypto.randomToken()` API that doesn't exist, and says so; the AI corrects it. She runs it,
commits. Next the email step — she keeps the SMTP password in an environment variable, not the
prompt. Then she asks the AI to write a test for expiry, **runs it**, and watches it pass. Each
step is a small, reviewed, committed diff she fully understands. When the AI starts guessing at
the mailer config in a loop, she **takes the wheel** and wires it herself.

**Same tool, opposite outcomes.** Both used AI to write the code. The difference was Maya's
discipline: clear intent, small steps, reading every diff, tests and version control as a safety
net, secrets kept out — and knowing when to stop prompting and take over.
