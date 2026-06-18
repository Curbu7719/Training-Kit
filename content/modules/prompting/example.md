# Worked Example: Turning a Vague Prompt into a Reliable One

**The task:** a team wants a model to classify incoming customer messages as `billing`, `technical`, or `other`, so a script can route them automatically.

**First attempt (vague):**

> Read this message and tell me what it's about: "My card was charged twice this month."

The model replies with a friendly paragraph: *"It sounds like you've been double-charged — I'd recommend contacting billing support..."* That's helpful to a human but useless to a router. There's no fixed category, and the wording changes every run.

**Engineered prompt.** We add a role, explicit categories, a delimiter around the data, and a strict output format:

> **System:** You are a message classifier. Respond with exactly one word: `billing`, `technical`, or `other`. No explanation.
>
> **User:** Classify the message between the tags.
> `<message>My card was charged twice this month.</message>`

Now the model returns:

> `billing`

**Adding a few-shot example** makes edge cases consistent. We prepend two examples to the user message:

> Examples:
> `<message>The app crashes when I open settings.</message>` → `technical`
> `<message>Do you ship to Canada?</message>` → `other`
>
> Now classify: `<message>My card was charged twice this month.</message>`

**Why each change mattered:**

- The **system message** pinned the role and forbade extra prose — so output is parseable.
- **Explicit categories** removed guesswork about the label set.
- **Delimiters** (`<message>` tags) separated the data from the instruction, so a message containing the word "classify" can't hijack the prompt.
- **Few-shot examples** showed the boundary cases, cutting misclassification.

**The lesson:** the model didn't get smarter between attempts — the *brief* did. A structured, specific, example-backed prompt turned an unpredictable paragraph into a single reliable token the rest of the system can act on.
